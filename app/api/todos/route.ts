import { PrismaClient, Todo } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";

const prisma = new PrismaClient();

function jsonWithNoCache(data: { error: string } | Todo[] | Todo, status: number = 200) {
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
    if (!token) return jsonWithNoCache({ error: "No token provided" }, 401);

    const result = verifyToken(token);
    if (typeof result === "string") return jsonWithNoCache({ error: result }, 401);

    const user = await prisma.user.findUnique({
      where: { email: result.email },
    });
    if (!user) return jsonWithNoCache({ error: "User not found" }, 404);

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return jsonWithNoCache(todos);
  } catch (error) {
    return jsonWithNoCache({ error: `${error}` }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
    if (!token) return jsonWithNoCache({ error: "No token provided" }, 401);

    const result = verifyToken(token);
    if (typeof result === "string") return jsonWithNoCache({ error: result }, 401);

    const user = await prisma.user.findUnique({
      where: { email: result.email },
    });
    if (!user) return jsonWithNoCache({ error: "User not found" }, 404);

    const { title, description, deadline } = await request.json();

    if (!title) return jsonWithNoCache({ error: "Title is required" }, 400);

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        deadline,
        userId: user.id,
      },
    });

    return jsonWithNoCache(todo,201);
  } catch (error) {
    return jsonWithNoCache({ error: `${error}` }, 500);
  }
}
