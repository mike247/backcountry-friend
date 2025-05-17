import Image from "next/image";
import { useContext } from "react";
import { MapContext } from "../context/mapContext";
import ControlButton from "./ControlButton";

const MapControl = () => {
  const { showSlope, toggleShowSlope, activeShade, toggleActiveShade } =
    useContext(MapContext);
  return (
    <div className="fixed bottom-0 sm:bottom-auto sm:top-12 sm:right-0 sm:absolute above-map sm:m-2 cursor-pointer flex items-center">
      <div
        className={`w-screen sm:w-auto control-layer flex cursor-pointer relative transition-all duration-200 bg-slate-900/75 px-1 pt-2 pb-2 sm:rounded-lg text-white`}
      >
        <ControlButton
          icon="/icons/avalanche.svg"
          alt="show slope layer"
          title="Slope hazard"
          label="Slope"
          variant={showSlope ? "active" : "inactive"}
          onClick={() => toggleShowSlope()}
        />
        <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/75 ml-1 mr-1"></div>
        <ControlButton
          icon="/icons/morning.svg"
          alt="toggle morning sun and shade layer"
          title="Morning sun"
          label="AM"
          variant={activeShade === 0 ? "active" : "inactive"}
          onClick={() => toggleActiveShade(0)}
        />
        <ControlButton
          icon="/icons/midday.svg"
          alt="toggle midday sun and shade layer"
          title="Midday sun"
          label="Noon"
          variant={activeShade === 1 ? "active" : "inactive"}
          onClick={() => toggleActiveShade(1)}
        />
        <ControlButton
          icon="/icons/afternoon.svg"
          alt="toggle afternoon sun and shade layer"
          title="Afternoon sun"
          label="PM"
          variant={activeShade === 2 ? "active" : "inactive"}
          onClick={() => toggleActiveShade(2)}
        />
      </div>
      <Image
        src="/icons/layer.svg"
        alt="Layer menu"
        width={60}
        height={60}
        className={`duration-200 transition-all hidden`}
      />
    </div>
  );
};

export default MapControl;
