import prisma from '../prisma';
import { User, Role } from '@prisma/client';

/**
 * Finds a user in the database by their email.
 * @param email - The email to look up.
 * @returns The user object from database, or null.
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { 
      email: email.toLowerCase() 
    },
  });
}

/**
 * Finds a user in the database by their ID.
 * @param id - The unique user ID.
 * @returns The user object from database, or null.
 */
export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: Role;
  walletAddress?: string | null;
  passwordHash?: string | null;
}

/**
 * Creates and registers a new user in the database.
 * @param userData - The user creation parameters.
 * @returns The newly created user.
 */
export async function createUser(userData: CreateUserInput): Promise<User> {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role,
      walletAddress: userData.walletAddress,
      passwordHash: userData.passwordHash,
    },
  });
}




