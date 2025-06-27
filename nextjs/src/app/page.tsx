import Map from "./ui/Map";
import { getForecast } from "./api/forecast";
import Head from "next/head";

export default async function Home() {
  const forecast = await getForecast();
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#222b38" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <Map forecast={forecast} />
    </>
  );
}
