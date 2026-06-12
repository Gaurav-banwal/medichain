import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWTPayload } from '@/types/auth';
import { DbUser, User, UserRole } from '@/types/user';
import { prisma } from '@/libs/prisma';
import type { Role } from '@/generated/prisma/client';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET environment variable is not set. Using fallback secret.');
}
const SECRET_KEY = JWT_SECRET || 'medichain-fallback-super-secret-key-969727a7869484baf033fa33d42f766e';

/**
 * Signs a payload to create a JWT token with a 7-day expiration.
 * @param payload - The JWTPayload containing userId, email, and role.
 * @returns Signed JWT string.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT string to verify.
 * @returns Decoded JWTPayload.
 * @throws Error if the token is invalid or expired.
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

// ==========================================
// DATABASE & REAL QUERIES
// ==========================================

/**
 * Finds a user in the database by their email.
 * @param email - User email.
 * @returns The database user record (including passwordHash) or null.
 */
export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user) return null;
  return {
    ...user,
    role: user.role as UserRole,
    passwordHash: user.passwordHash || '',
  };
}

/**
 * Finds a user in the database by their ID.
 * @param id - User ID.
 * @returns The user record (excluding passwordHash) or null.
 */
export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) return null;
  
  // Exclude passwordHash before returning
  const { passwordHash, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    role: userWithoutPassword.role as UserRole,
  };
}

/**
 * Creates a new user in the database.
 * @param userData - The registration data.
 * @returns The created user (excluding passwordHash).
 */
export async function createUser(userData: Omit<DbUser, 'id' | 'createdAt'>): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role as Role,
      walletAddress: userData.walletAddress || null,
      passwordHash: userData.passwordHash,
    },
  });
  
  // Exclude passwordHash before returning
  const { passwordHash, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    role: userWithoutPassword.role as UserRole,
  };
}

/**
 * Asynchronously reads the JWT token from HttpOnly cookies,
 * verifies it, and returns the current user profile.
 * @returns The authenticated user object, or null.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    return await findUserById(decoded.userId);
  } catch (error) {
    // Fail silently and return null if token is expired or invalid
    return null;
  }
}
