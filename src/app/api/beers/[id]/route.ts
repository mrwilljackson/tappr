import { NextResponse } from 'next/server';
import { sampleBeers } from '@/utils/sample-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const beer = sampleBeers.find((beer) => beer.id === id);

  if (!beer) {
    return NextResponse.json(
      { error: 'Beer not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(beer);
}
