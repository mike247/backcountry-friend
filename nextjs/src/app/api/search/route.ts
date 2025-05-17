import { NextRequest } from "next/server";
import { config, geocoding, Language } from "@maptiler/client";

config.apiKey = process.env.MAPTILER_API_KEY || "";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const result = await geocoding.forward(searchParams.get("string") || "", {
    language: [Language.ENGLISH],
    country: ["nz"],
    fuzzyMatch: true,
    autocomplete: true,
  });

  return new Response(JSON.stringify(result.features), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
