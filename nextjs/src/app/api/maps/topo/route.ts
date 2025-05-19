import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const subdomains = ["a", "b", "c", "d"];
  const subdomain = subdomains.includes(searchParams.get("s") || "'")
    ? searchParams.get("s")
    : subdomains[Math.floor(Math.random() * subdomains.length)];

  const url = `http://tiles-${subdomain}.tiles-cdn.koordinates.com/services;key=${
    process.env.LINZ_API_KEY
  }/tiles/v4/layer=${searchParams.get("layerId")}/EPSG:3857/${searchParams.get(
    "z"
  )}/${searchParams.get("x")}/${searchParams.get("y")}.png`;

  const response = await fetch(url);
  return response;
}
