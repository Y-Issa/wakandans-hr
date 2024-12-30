import { UserRole, User } from '@prisma/client';

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: UserRole;
      user: User;
      // Add any other user properties you need
    };
  }
}

export {};
