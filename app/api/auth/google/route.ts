import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { findUserByEmail, createUser, generateToken } from '@/lib/auth';
import { User, UserRole } from '@/types/user';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { idToken, role } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'Google ID token is required' },
        { status: 400 }
      );
    }

    // 1. Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.name) {
      return NextResponse.json(
        { error: 'Invalid Google token payload' },
        { status: 400 }
      );
    }

    const { email, name } = payload;

    // 2. Check if the user exists
    let user: User | null = await findUserByEmail(email);

    if (!user) {
      // 3. Create the user with default or requested role
      const assignedRole = (role as UserRole) || 'CITIZEN';

      user = await createUser({
        name,
        email,
        role: assignedRole,
        passwordHash: null,
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to find or create user' },
        { status: 500 }
      );
    }

    // 4. Generate app JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // 5. Exclude passwordHash (if any) from response
    const { passwordHash, ...userWithoutPassword } = user as any;

    // 6. Return response and set token in cookie
    const response = NextResponse.json(
      {
        message: 'Authenticated successfully with Google',
        user: userWithoutPassword,
      },
      { status: 200 }
    );

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
    console.error('Google Auth Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during Google Sign-In verification' },
      { status: 500 }
    );
  }
}
