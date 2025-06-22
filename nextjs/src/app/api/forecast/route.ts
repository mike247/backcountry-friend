import { NextResponse } from "next/server";
import { getForecast } from ".";

export async function GET() {
  const validForecasts = await getForecast();

  return NextResponse.json(validForecasts);
}
