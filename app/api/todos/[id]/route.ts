import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/app/utils/jwt";

const prisma = new PrismaClient();

function getTokenFromRequest(request: Request): string | null {
  return request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1] ?? null;
}

type ApiResponse = {
  error?: string;
  success?: boolean;
} | Record<string, unknown>;

function jsonWithNoCache(data: ApiResponse, status: number = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": "no-store",
    },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return jsonWithNoCache({ error: "No token provided" }, 401);

    const result = verifyToken(token);
    if (typeof result === "string") return jsonWithNoCache({ error: result }, 401);

    const user = await prisma.user.findUnique({ where: { email: result.email } });
    if (!user) return jsonWithNoCache({ error: "User not found" }, 404);

    const { id } = await params;
    const { title, description, completed, deadline } = await request.json();

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== user.id) {
      return jsonWithNoCache({ error: "Todo not found or access denied" }, 404);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        title: title ?? todo.title,
        completed: completed ?? todo.completed,
        deadline: deadline ?? todo.deadline,
        description: description ?? todo.description,
      },
    });

    return jsonWithNoCache(updatedTodo);
  } catch (error) {
    return jsonWithNoCache({ error: `${error}` }, 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return jsonWithNoCache({ error: "No token provided" }, 401);

    const result = verifyToken(token);
    if (typeof result === "string") return jsonWithNoCache({ error: result }, 401);

    const user = await prisma.user.findUnique({ where: { email: result.email } });
    if (!user) return jsonWithNoCache({ error: "User not found" }, 404);

    const { id } = await params;

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== user.id) {
      return jsonWithNoCache({ error: "Todo not found or access denied" }, 404);
    }

    await prisma.todo.delete({ where: { id } });

    return jsonWithNoCache({ success: true });
  } catch (error) {
    return jsonWithNoCache({ error: `${error}` }, 500);
  }
}
