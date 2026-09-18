"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const rawPassword = formData.get("password") as string;
  const password = rawPassword ? rawPassword.trim().replace(/^["']|["']$/g, "") : "";
  const rawAdminToken = process.env.ADMIN_TOKEN;
  const ADMIN_TOKEN = rawAdminToken ? rawAdminToken.trim().replace(/^["']|["']$/g, "") : "";

  if (!ADMIN_TOKEN) {
    return { error: "El token de administrador no está configurado en las variables de entorno." };
  }

  // Accept exact match or case-insensitive match (Bruma123 / bruma123)
  const isMatch = password === ADMIN_TOKEN || password.toLowerCase() === ADMIN_TOKEN.toLowerCase();

  if (isMatch) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    redirect("/gestion-bruma-privado");
  } else {
    return { error: "Contraseña incorrecta" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/gestion-bruma-privado/login");
}

async function processImage(formData: FormData): Promise<string | null> {
  // 1. Check if client-side optimized base64 payload is provided
  const base64Payload = formData.get("imageBase64") as string;
  if (base64Payload && base64Payload.startsWith("data:image")) {
    return base64Payload;
  }

  // 2. Fallback: Convert raw uploaded File to base64 Data URL (serverless safe, no disk writes)
  const file = formData.get("imageFile") as File | null;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  }

  return null;
}

export async function createProductAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  
  // Ensure non-negative numbers
  const rawPrice = parseFloat(formData.get("price") as string);
  const price = isNaN(rawPrice) ? 0 : Math.max(0, rawPrice);
  
  const rawStock = parseInt(formData.get("stock") as string, 10);
  const stock = isNaN(rawStock) ? 0 : Math.max(0, rawStock);

  const features = (formData.get("features") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string) || null;
  const subcategoryId = (formData.get("subcategoryId") as string) || null;
  
  // Store image safely in cloud database as Data URL
  const imageUrl = await processImage(formData);

  await prisma.product.create({
    data: { name, description, price, stock, features, imageUrl, categoryId, subcategoryId },
  });

  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
  redirect("/gestion-bruma-privado");
}

export async function updateProductAction(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  
  // Ensure non-negative numbers
  const rawPrice = parseFloat(formData.get("price") as string);
  const price = isNaN(rawPrice) ? 0 : Math.max(0, rawPrice);
  
  const rawStock = parseInt(formData.get("stock") as string, 10);
  const stock = isNaN(rawStock) ? 0 : Math.max(0, rawStock);

  const features = (formData.get("features") as string)?.trim();
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

  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
  redirect("/gestion-bruma-privado");
}

export async function deleteProductAction(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/gestion-bruma-privado");
}
