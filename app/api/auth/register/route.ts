import { NextResponse } from 'next/server';
import { createUser, signToken } from '@/libs/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, walletAddress } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Name, email, and role are required fields' },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      role,
      walletAddress,
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role }, '7d');

    const response = NextResponse.json({
      message: 'User registered successfully',
      user,
      token,
    }, { status: 201 });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
