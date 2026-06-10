export type UserRole = 'CITIZEN' | 'DOCTOR' | 'PHARMACY' | 'REGULATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string | null;
  createdAt: Date;
}

/**
 * Representation of a user with hashed password stored in the mock database.
 */
export interface DbUser extends User {
  passwordHash: string;
}
