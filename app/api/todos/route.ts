import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";

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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    });

 

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, description, deadline } = await request.json();
    console.log("title", title);
    console.log("description", description);
    console.log("deadline", deadline);

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        deadline,
        userId: user.id,
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
