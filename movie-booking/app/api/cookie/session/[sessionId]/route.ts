import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } } 
)
{
  try {
    const { sessionId } = params;
    const cookieStore = await cookies();

    cookieStore.set('paymentSession', sessionId, {
      httpOnly: true,
      maxAge: 15 * 60,
      path: '/',
    });


    return NextResponse.json({ message: 'Session created' });
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}