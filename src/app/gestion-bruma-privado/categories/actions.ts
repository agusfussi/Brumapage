"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.category.create({ data: { name } });
  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/");
}

export async function deleteCategoryAction(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/");
}

export async function createSubcategoryAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  if (!name || !categoryId) return;

  await prisma.subcategory.create({
    data: {
      name,
      categoryId,
    },
  });

  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/gestion-bruma-privado/product/new");
  revalidatePath("/");
}

export async function deleteSubcategoryAction(id: string) {
  await prisma.subcategory.delete({ where: { id } });
  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/gestion-bruma-privado/product/new");
  revalidatePath("/");
}
