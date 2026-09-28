"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function createCategoryAction(formData: FormData) {
  await requireAdminSession();

  const name = (formData.get("name") as string)?.trim().slice(0, 100);
  if (!name) return;

  const category = await prisma.category.create({ data: { name } });
  logger.info("CATEGORY_CREATED", `Category created: ${category.name} (${category.id})`);

  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/");
}

export async function deleteCategoryAction(id: string) {
  await requireAdminSession();

  await prisma.category.delete({ where: { id } });
  logger.info("CATEGORY_DELETED", `Category deleted: ${id}`);

  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/");
}

export async function createSubcategoryAction(formData: FormData) {
  await requireAdminSession();

  const name = (formData.get("name") as string)?.trim().slice(0, 100);
  const categoryId = (formData.get("categoryId") as string)?.trim();
  if (!name || !categoryId) return;

  const subcategory = await prisma.subcategory.create({
    data: {
      name,
      categoryId,
    },
  });
  logger.info("SUBCATEGORY_CREATED", `Subcategory created: ${subcategory.name} (${subcategory.id})`);

  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/gestion-bruma-privado/product/new");
  revalidatePath("/");
}

export async function deleteSubcategoryAction(id: string) {
  await requireAdminSession();

  await prisma.subcategory.delete({ where: { id } });
  logger.info("SUBCATEGORY_DELETED", `Subcategory deleted: ${id}`);

  revalidatePath("/gestion-bruma-privado/categories");
  revalidatePath("/gestion-bruma-privado/product/new");
  revalidatePath("/");
}
