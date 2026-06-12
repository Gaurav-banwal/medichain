import { NextResponse } from 'next/server';
import { createUser, signToken } from '@/libs/auth';
import { prisma } from '@/libs/prisma';

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

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists by email
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // User already exists. If a walletAddress was provided, verify it isn't taken by someone else
      if (walletAddress) {
        const userWithWallet = await prisma.user.findUnique({
          where: { walletAddress },
        });
        if (userWithWallet && userWithWallet.id !== user.id) {
          return NextResponse.json(
            { error: 'This wallet address is already linked to another user account' },
            { status: 400 }
          );
        }
      }

      // Update existing user details (name, role, walletAddress)
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          role,
          walletAddress: walletAddress || user.walletAddress,
        },
      });
    } else {
      // Create new user. Check if the walletAddress is already taken
      if (walletAddress) {
        const userWithWallet = await prisma.user.findUnique({
          where: { walletAddress },
        });
        if (userWithWallet) {
          return NextResponse.json(
            { error: 'This wallet address is already linked to another user account' },
            { status: 400 }
          );
        }
      }

      user = await createUser({
        name,
        email: normalizedEmail,
        role,
        walletAddress,
      });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role }, '7d');

    const response = NextResponse.json({
      message: 'User registered successfully',
      user,
      token,
    }, { status: 200 });

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
