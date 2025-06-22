import Map from "./ui/Map";
import { getForecast } from "./api/forecast";

export default async function Home() {
  const forecast = await getForecast();
  return <Map forecast={forecast} />;
}
