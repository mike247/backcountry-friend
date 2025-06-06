"use client";
import NavBar from "../components/NavBar.tsx";
import MapControl from "../components/MapControl.tsx";
// import MapLegend from "../components/MapLegend.tsx";
import dynamic from "next/dynamic";
import { useReducer } from "react";
import { initialMap, MapContext, mapReducer } from "../reducers/mapReducer.ts";

const DynamicMap = dynamic(() => import("../components/Map.tsx"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  const [map, dispatch] = useReducer(mapReducer, initialMap);
  return (
    <MapContext.Provider value={{ map, dispatch }}>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex-grow">
          <DynamicMap />
          <MapControl />
        </div>
      </div>
    </MapContext.Provider>
  );
}
