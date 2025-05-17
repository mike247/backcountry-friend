import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const url = `https://api.maptiler.com/tiles/${searchParams.get(
    "layerId"
  )}/${searchParams.get("z")}/${searchParams.get("x")}/${searchParams.get(
    "y"
  )}.png?key=${process.env.MAPTILER_API_KEY}`;

  const response = await fetch(url);
  return response;
}
