"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createSessionToken, requireAdminSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { rateLimiter } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function loginAction(formData: FormData) {
  const headersList = await headers();
  const clientIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || headersList.get("x-real-ip") || "127.0.0.1";

  // Check rate limit before processing
  const rateCheck = rateLimiter.check(clientIp);
  if (!rateCheck.allowed) {
    logger.security("AUTH_RATE_LIMIT_BLOCKED", "Blocked login attempt due to rate limit", clientIp);
    const minutesLeft = Math.ceil(rateCheck.retryAfterSeconds / 60) || 15;
    return {
      error: `Demasiados intentos fallidos. Acceso bloqueado temporalmente. Por favor esperá ${minutesLeft} minutos.`,
    };
  }

  const rawPassword = formData.get("password") as string;
  const password = rawPassword ? rawPassword.trim().replace(/^["']|["']$/g, "") : "";
  const rawAdminToken = process.env.ADMIN_TOKEN;
  const ADMIN_TOKEN = rawAdminToken ? rawAdminToken.trim().replace(/^["']|["']$/g, "") : "";

  if (!ADMIN_TOKEN) {
    logger.error("AUTH_CONFIG_ERROR", "ADMIN_TOKEN is missing in environment variables");
    return { error: "El token de administrador no está configurado en las variables de entorno." };
  }

  // Accept exact match or case-insensitive match (Bruma123 / bruma123)
  const isMatch = password === ADMIN_TOKEN || password.toLowerCase() === ADMIN_TOKEN.toLowerCase();

  if (isMatch) {
    rateLimiter.reset(clientIp);
    logger.info("AUTH_LOGIN_SUCCESS", "Admin session established", { ip: clientIp });

    const sessionToken = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/gestion-bruma-privado");
  } else {
    const failed = rateLimiter.recordFailed(clientIp);
    logger.security("AUTH_LOGIN_FAILED", "Failed password attempt", clientIp, {
      remainingAttempts: failed.remainingAttempts,
    });

    // Artificial delay to prevent automated high-speed brute force
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (failed.isBlocked) {
      return {
        error: `Has superado el límite de intentos. Acceso bloqueado temporalmente por ${failed.retryAfterMinutes} minutos.`,
      };
    }

    return {
      error: `Contraseña incorrecta. Te quedan ${failed.remainingAttempts} intento(s).`,
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  logger.info("AUTH_LOGOUT", "Admin logged out");
  redirect("/gestion-bruma-privado/login");
}

async function processImage(formData: FormData): Promise<string | null> {
  // Max image payload: 7MB base64 string (~5MB binary)
  const MAX_BASE64_LENGTH = 7 * 1024 * 1024;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // 1. Check if client-side optimized base64 payload is provided
  const base64Payload = formData.get("imageBase64") as string;
  if (base64Payload && base64Payload.startsWith("data:image")) {
    if (base64Payload.length > MAX_BASE64_LENGTH) {
      throw new Error("La imagen supera el tamaño máximo permitido (5 MB).");
    }
    return base64Payload;
  }

  // 2. Fallback: Convert raw uploaded File to base64 Data URL (serverless safe, no disk writes)
  const file = formData.get("imageFile") as File | null;
  if (file && file.size > 0) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo de imagen supera el tamaño máximo permitido (5 MB).");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  return null;
}

export async function createProductAction(formData: FormData) {
  // Guard: require authenticated admin session
  await requireAdminSession();

  const name = (formData.get("name") as string)?.trim().slice(0, 200);
  const description = (formData.get("description") as string)?.trim().slice(0, 5000);

  if (!name || !description) {
    throw new Error("El nombre y la descripción son obligatorios.");
  }
  
  // Ensure non-negative and bounded numbers
  const rawPrice = parseFloat(formData.get("price") as string);
  const price = isNaN(rawPrice) ? 0 : Math.min(100000000, Math.max(0, rawPrice));
  
  const rawStock = parseInt(formData.get("stock") as string, 10);
  const stock = isNaN(rawStock) ? 0 : Math.min(100000, Math.max(0, rawStock));

  const features = (formData.get("features") as string)?.trim().slice(0, 1000) || null;
  const categoryId = (formData.get("categoryId") as string) || null;
  const subcategoryId = (formData.get("subcategoryId") as string) || null;
  
  // Store image safely in cloud database as Data URL
  const imageUrl = await processImage(formData);

  const product = await prisma.product.create({
    data: { name, description, price, stock, features, imageUrl, categoryId, subcategoryId },
  });

  logger.info("PRODUCT_CREATED", `Product created: ${product.name} (${product.id})`);

  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
  redirect("/gestion-bruma-privado");
}

export async function updateProductAction(id: string, formData: FormData) {
  // Guard: require authenticated admin session
  await requireAdminSession();

  const name = (formData.get("name") as string)?.trim().slice(0, 200);
  const description = (formData.get("description") as string)?.trim().slice(0, 5000);

  if (!name || !description) {
    throw new Error("El nombre y la descripción son obligatorios.");
  }
  
  // Ensure non-negative and bounded numbers
  const rawPrice = parseFloat(formData.get("price") as string);
  const price = isNaN(rawPrice) ? 0 : Math.min(100000000, Math.max(0, rawPrice));
  
  const rawStock = parseInt(formData.get("stock") as string, 10);
  const stock = isNaN(rawStock) ? 0 : Math.min(100000, Math.max(0, rawStock));

  const features = (formData.get("features") as string)?.trim().slice(0, 1000) || null;
  const categoryId = (formData.get("categoryId") as string) || null;
  const subcategoryId = (formData.get("subcategoryId") as string) || null;
  
  const newImageUrl = await processImage(formData);

  const dataToUpdate: any = { name, description, price, stock, features, categoryId, subcategoryId };
  if (newImageUrl) {
    dataToUpdate.imageUrl = newImageUrl;
  }

  await prisma.product.update({
    where: { id },
    data: dataToUpdate,
  });

  logger.info("PRODUCT_UPDATED", `Product updated: ${name} (${id})`);

  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
  redirect("/gestion-bruma-privado");
}

export async function deleteProductAction(id: string) {
  // Guard: require authenticated admin session
  await requireAdminSession();

  await prisma.product.delete({ where: { id } });
  logger.info("PRODUCT_DELETED", `Product deleted: ${id}`);

  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
}
