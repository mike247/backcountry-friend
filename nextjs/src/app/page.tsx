"use client";
import NavBar from "./components/NavBar";
import MapControl from "./components/MapControl.tsx";
import MapLegend from "./components/MapLegend.tsx";
import dynamic from "next/dynamic";
import { MapProvider } from "./context/mapContext.tsx";

const DynamicMap = dynamic(() => import("./components/Map.tsx"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <MapProvider>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex-grow">
          <DynamicMap />
          <MapControl />
          <MapLegend />
        </div>
      </div>
    </MapProvider>
  );
}
