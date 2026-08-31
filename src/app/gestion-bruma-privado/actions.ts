"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

  if (!ADMIN_TOKEN) {
    return { error: "El token de administrador no está configurado en las variables de entorno." };
  }

  if (password && password === ADMIN_TOKEN) {
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

async function saveImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${crypto.randomBytes(8).toString('hex')}${ext}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
  
  await writeFile(filepath, buffer);
  return `/uploads/${filename}`;
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
  
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrl = await saveImage(imageFile);

  await prisma.product.create({
    data: { name, description, price, stock, features, imageUrl, categoryId },
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
  
  const imageFile = formData.get("imageFile") as File | null;
  const newImageUrl = await saveImage(imageFile);

  const dataToUpdate: any = { name, description, price, stock, features, categoryId };
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
