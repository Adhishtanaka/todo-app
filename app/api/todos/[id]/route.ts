export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/app/utils/jwt";

const prisma = new PrismaClient();

function getTokenFromRequest(request: Request): string | null {
  return request.headers.get("cookie")?.match(/token=([^;]+)/)?.[1] ?? null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const result = verifyToken(token);
    if (typeof result === "string") return NextResponse.json({ error: result }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: result.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const id = params.id;
    const { title, description, completed, deadline } = await request.json();

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== user.id) {
      return NextResponse.json({ error: "Todo not found or access denied" }, { status: 404 });
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

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const result = verifyToken(token);
    if (typeof result === "string") return NextResponse.json({ error: result }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: result.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const id = params.id;

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== user.id) {
      return NextResponse.json({ error: "Todo not found or access denied" }, { status: 404 });
    }

    await prisma.todo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}