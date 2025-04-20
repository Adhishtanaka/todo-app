import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";

const prisma = new PrismaClient();

function jsonWithNoCache(data: { error?: string; details?: string } | { name: string; email: string }, status: number = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": "no-store",
    },
  });
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

    if (!token) {
      return jsonWithNoCache({ error: "No token provided" }, 401);
    }

    const result = verifyToken(token);
    if (typeof result === "string") {
      return jsonWithNoCache({ error: result }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: result.email },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return jsonWithNoCache({ error: "User not found" }, 404);
    }

    return jsonWithNoCache(user);
  } catch (error) {
    return jsonWithNoCache({ error: "Internal server error", details: `${error}` }, 500);
  }
}
