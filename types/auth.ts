import { UserRole } from './user';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    walletAddress?: string | null;
  };
  token?: string;
}
