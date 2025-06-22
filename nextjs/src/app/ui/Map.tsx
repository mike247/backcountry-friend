"use client";
import NavBar from "../../components/NavBar.tsx";
import MapControl from "../../components/MapControl.tsx";
// import MapLegend from "../components/MapLegend.tsx";
import dynamic from "next/dynamic";
import { useReducer } from "react";
import { initialMap } from "../../reducers/state.ts";
import { mapReducer } from "@/reducers/reducer.ts";
import { MapContext } from "@/reducers/context.ts";
import { Forecast } from "@/reducers/forecastTypes.ts";

const DynamicMap = dynamic(() => import("../../components/MapComponent.tsx"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Map({ forecast }: { forecast: Forecast[] }) {
  const [map, dispatch] = useReducer(mapReducer, { ...initialMap, forecast });
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
