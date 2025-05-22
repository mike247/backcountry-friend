import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const url = `https://api.maptiler.com/${searchParams.get(
    "type"
  )}/${searchParams.get("layerId")}/${searchParams.get("z")}/${searchParams.get(
    "x"
  )}/${searchParams.get("y")}.${searchParams.get("format")}?key=${
    process.env.MAPTILER_API_KEY
  }`;

  if (searchParams.get("layerId") === "terrain-rgb-v2")
    console.log("OH HELL NO");

  console.log(url);
  const response = await fetch(url);
  return response;
}
