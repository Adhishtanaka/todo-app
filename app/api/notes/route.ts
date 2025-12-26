import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";

const prisma = new PrismaClient();

type NoteType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

function jsonWithNoCache(data: { error: string } | NoteType[] | NoteType, status: number = 200) {
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

    const notes = await (prisma as any).note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return jsonWithNoCache(notes);
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

    const { title, content } = await request.json();

    if (!title) return jsonWithNoCache({ error: "Title is required" }, 400);
    if (!content) return jsonWithNoCache({ error: "Content is required" }, 400);

    const note = await (prisma as any).note.create({
      data: {
        title,
        content,
        userId: user.id,
      },
    });

    return jsonWithNoCache(note, 201);
  } catch (error) {
    return jsonWithNoCache({ error: `${error}` }, 500);
  }
}