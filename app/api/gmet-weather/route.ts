import { NextResponse } from 'next/server';

import { fetchGMetWeather } from '@/lib/gmet-weather';

export async function GET() {
  try {
    const data = await fetchGMetWeather();
    return data
      ? NextResponse.json(data)
      : NextResponse.json({ error: 'GMet forecast unavailable' }, { status: 503 });
  } catch (error) {
    console.error('GMet forecast request failed', error);
    return NextResponse.json({ error: 'GMet forecast unavailable' }, { status: 503 });
  }
}
