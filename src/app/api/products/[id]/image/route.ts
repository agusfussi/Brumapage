import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!product || !product.imageUrl) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const { imageUrl } = product;

    // If it's a data URL, decode and serve as native binary image
    if (imageUrl.startsWith("data:")) {
      const matches = imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches || matches.length < 3) {
        return new NextResponse("Invalid image format", { status: 400 });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const imageBuffer = Buffer.from(base64Data, "base64");

      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": imageBuffer.length.toString(),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // If it's already an external URL, redirect directly
    return NextResponse.redirect(imageUrl, { status: 307 });
  } catch (error) {
    console.error("Error serving product image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
