import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = (process.env.JWT_SECRET || 'your_jwt_secret_key') as string;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'staff';
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE } as any);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
