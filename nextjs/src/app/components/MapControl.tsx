import Image from "next/image";
import { useContext, useRef, useState } from "react";
import { MapContext } from "../context/mapContext";

const LayerButton = ({
  icon,
  alt,
  title,
  label,
  variant,
  onClick,
}: {
  icon: string;
  alt: string;
  title: string;
  label: string;
  variant: "inactive" | "active";
  onClick?: () => void;
}) => {
  const colors = {
    inactive: "bg-slate-700 hover:bg-slate-600",
    active: "bg-lime-700 hover:bg-lime-600",
  };
  return (
    <button
      className={`${
        colors[variant] || "bg-slate - 700"
      } pl-2 pr-2 pt-1 pb-1 flex flex-col justify-center rounded-md ml-1 mr-1`}
      onClick={onClick}
    >
      <Image src={icon} alt={alt} width={45} height={45} title={title} />
      <label>{label}</label>
    </button>
  );
};

const MapControl = () => {
  const [controlHidden, setControlHidden] = useState(true);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showSlope, toggleShowSlope, activeShade, toggleActiveShade } =
    useContext(MapContext);
  return (
    <div className="top-12 right-0 absolute above-map m-2 cursor-pointer flex items-center">
      <div
        onMouseEnter={() => {
          if (timeoutId.current) clearTimeout(timeoutId.current);
          setControlHidden(false);
        }}
        onMouseLeave={() => {
          if (timeoutId.current) clearTimeout(timeoutId.current);
          timeoutId.current = setTimeout(() => {
            setControlHidden(true);
          }, 1500);
        }}
        className={`${
          controlHidden ? "invisible opacity-0" : "visible opacity-100"
        } control-layer flex cursor-pointer relative mr-2 transition-all duration-200 bg-slate-900 pl-1 pr-1 pt-2 pb-2 rounded-lg text-white`}
      >
        <LayerButton
          icon="/icons/avalanche.svg"
          alt="show slope layer"
          title="Slope hazard"
          label="Slope"
          variant={showSlope ? "active" : "inactive"}
          onClick={() => toggleShowSlope()}
        />
        <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/75 ml-1 mr-1"></div>
        <LayerButton
          icon="/icons/morning.svg"
          alt="toggle morning sun and shade layer"
          title="Morning sun"
          label="AM"
          variant={activeShade === 0 ? "active" : "inactive"}
          onClick={() => toggleActiveShade(0)}
        />
        <LayerButton
          icon="/icons/midday.svg"
          alt="toggle midday sun and shade layer"
          title="Midday sun"
          label="Noon"
          variant={activeShade === 1 ? "active" : "inactive"}
          onClick={() => toggleActiveShade(1)}
        />
        <LayerButton
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
        onMouseEnter={() => {
          setControlHidden(!controlHidden);
          timeoutId.current = setTimeout(() => {
            setControlHidden(true);
          }, 3000);
        }}
        className={`${
          controlHidden ? "hover:scale-110" : "scale-110"
        } duration-200 transition-all`}
      />
    </div>
  );
};

export default MapControl;
