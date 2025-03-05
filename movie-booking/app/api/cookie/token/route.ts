import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")

    if (!token) {
      return NextResponse.json({ message: 'No token found' }, { status: 200 });
    }

    return NextResponse.json({ token: token.value }, { status: 200 });
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ error: 'Failed to retrieve token' }, { status: 500 });
  }
}