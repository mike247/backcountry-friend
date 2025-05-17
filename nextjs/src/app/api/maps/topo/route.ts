import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const url = `http://tiles-${searchParams.get(
    "s"
  )}.tiles-cdn.koordinates.com/services;key=${
    process.env.LINZ_API_KEY
  }/tiles/v4/layer=${searchParams.get("layerId")}/EPSG:3857/${searchParams.get(
    "z"
  )}/${searchParams.get("x")}/${searchParams.get("y")}.png`;

  const response = await fetch(url);
  return response;
}
