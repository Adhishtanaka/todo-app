import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();
        
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }
        
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingUser) {
          return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
              password: hashedPassword,
              name: name,
              email: email,
            },
        });
        return NextResponse.json({ status: 201 });
    }catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
