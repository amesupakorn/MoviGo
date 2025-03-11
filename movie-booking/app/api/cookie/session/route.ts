import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("paymentSession")

    if (!session) {
      return NextResponse.json({ message: 'No payment session found' }, { status: 200 });
    }

    return NextResponse.json({ session: session.value }, { status: 200 });
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to retrieve payment session' }, { status: 500 });
  }
}