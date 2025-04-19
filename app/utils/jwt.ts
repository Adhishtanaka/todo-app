import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || ''; 

export interface TokenPayload {
    email: string;
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | string {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return `Invalid token: ${error}`;
  }
}