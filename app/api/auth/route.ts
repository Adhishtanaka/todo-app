import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt"; // Adjust if your path differs

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const result = verifyToken(token);
    if (typeof result === "string") {
      return NextResponse.json({ error: result }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: result.email },
      select: {
        name: true,
        email: true
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
