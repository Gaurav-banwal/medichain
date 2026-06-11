import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { findUserByEmail, createUser, generateToken } from '@/lib/auth';
import { UserRole } from '@/types/user';

// Simple regex for basic email verification
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, walletAddress } = body;

    // 1. Request Body Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password is required and must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['CITIZEN', 'DOCTOR', 'PHARMACY', 'REGULATOR'];
    if (!role || !validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // 2. Uniqueness Check
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 400 }
      );
    }

    // 3. Password Hashing
    const passwordHash = await bcryptjs.hash(password, 10);

    // 4. Save to Database
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role as UserRole,
      walletAddress: walletAddress || null,
      passwordHash,
    });

    // 5. Generate JWT Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Return Response with HttpOnly Cookie
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user,
      },
      { status: 201 }
    );

    // Set JWT in HttpOnly Cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred during registration' },
      { status: 500 }
    );
  }
}
