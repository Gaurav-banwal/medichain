import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import type { Role } from '@/generated/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json({ error: 'Credential token is required' }, { status: 400 });
    }

    let email = '';
    let name = '';

    // Mock login fallback for testing/development
    if (credential === 'mock-google-credential') {
      email = 'google-test-user@demo.io';
      name = 'Google Test User';
    } else {
      // Call Google API to verify id_token
      const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!res.ok) {
        return NextResponse.json({ error: 'Invalid Google credential token' }, { status: 401 });
      }
      const data = await res.json();
      email = data.email;
      name = data.name;

      if (!email) {
        return NextResponse.json({ error: 'Email not provided in Google profile' }, { status: 400 });
      }
    }

    // Lookup user in DB
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // Existing user -> Log them in by generating custom app token and setting cookie
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role as any,
      });

      const { passwordHash, ...userWithoutPassword } = user;

      const response = NextResponse.json({
        message: 'Logged in successfully via Google',
        isNewUser: false,
        user: {
          ...userWithoutPassword,
          role: userWithoutPassword.role as string,
        },
      });

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
    } else {
      // New user -> Request role and details selection
      return NextResponse.json({
        message: 'Google authentication successful. Registration required.',
        isNewUser: true,
        email: email.toLowerCase(),
        name,
      });
    }
  } catch (error: any) {
    console.error('Google Auth Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error occurred' },
      { status: 500 }
    );
  }
}
