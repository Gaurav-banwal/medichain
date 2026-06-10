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

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      message: 'User registered successfully',
      user,
      token,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
