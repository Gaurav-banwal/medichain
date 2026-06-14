import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import type { Role } from '@/generated/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role, walletAddress } = body;

    // Validation
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    const validRoles = ['CITIZEN', 'DOCTOR', 'PHARMACY', 'REGULATOR'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Clean email
    const cleanEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 400 }
      );
    }

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        role: role as Role,
        walletAddress: walletAddress || null,
        passwordHash: null, // No password for Google Sign-in users
      },
    });

    // Generate custom session JWT
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
    });

    const { passwordHash, ...userWithoutPassword } = newUser;

    // Response with HttpOnly Cookie
    const response = NextResponse.json(
      {
        message: 'Google registration completed successfully',
        user: {
          ...userWithoutPassword,
          role: userWithoutPassword.role as string,
        },
      },
      { status: 201 }
    );

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
    console.error('Google Register Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error occurred' },
      { status: 500 }
    );
  }
}
