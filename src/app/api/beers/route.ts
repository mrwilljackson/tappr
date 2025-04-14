import { NextResponse } from 'next/server';
import { sampleBeers } from '@/utils/sample-data';

export async function GET() {
  return NextResponse.json(sampleBeers);
}
