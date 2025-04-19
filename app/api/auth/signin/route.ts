import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { createToken } from '@/app/utils/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;
        
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password:_, ...userWithoutPassword } = user;
        const token = createToken(userWithoutPassword);
        
        return NextResponse.json({ 
            success: true, 
            token 
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}