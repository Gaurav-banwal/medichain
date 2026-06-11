import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: No active session or token has expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
