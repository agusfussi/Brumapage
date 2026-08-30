"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  await prisma.category.create({ data: { name } });
  revalidatePath("/gestion-bruma-privado/categories");
}

export async function deleteCategoryAction(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/gestion-bruma-privado/categories");
}
