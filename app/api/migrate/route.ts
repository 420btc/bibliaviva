import { NextResponse } from 'next/server';
import { migrate } from '@/lib/migrate';

export async function GET() {
  const result = await migrate();
  return NextResponse.json(result);
}
