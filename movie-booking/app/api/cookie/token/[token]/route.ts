import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: { token: string } } 
)
{
  try {
    const { token } = params;
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true,
      maxAge: 3600,
      path: '/',
    });

    return NextResponse.json({ message: 'token created' });
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}