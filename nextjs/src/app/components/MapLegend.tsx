import { useContext } from "react";
import { shadeLayers, slopeLayers } from "../maps/layers";
import { MapContext } from "../context/mapContext";

const Gradient = ({
  gradient,
}: {
  gradient: { min: string; mid: string; max: string };
}) => {
  return (
    <div
      className="h-36 w-6 bg-lime-200 mb-2 mt-2"
      style={{
        backgroundImage: `linear-gradient(${gradient.min}, ${gradient.mid}, ${gradient.max})`,
      }}
    />
  );
};

const LegendText = ({ text }: { text: string }) => {
  return <span>{text}</span>;
};

const LegendKey = ({
  minText,
  midText,
  maxText,
}: {
  minText: string;
  midText: string;
  maxText: string;
}) => {
  return (
    <div className="flex flex-col justify-between mt-1 mb-1 mr-2 text-right">
      <LegendText text={minText} />
      <LegendText text={midText} />
      <LegendText text={maxText} />
    </div>
  );
};

const MapLegend = () => {
  const { showSlope, activeShade } = useContext(MapContext);
  return (
    <div className="bottom-4 right-4 absolute above-map flex">
      <div
        className={`${
          activeShade >= 0 ? "visible" : "hidden"
        } flex bg-slate-800/75 pl-2 pr-2 m-2 rounded-lg justify-end`}
      >
        <LegendKey {...shadeLayers.legend} />
        <Gradient gradient={shadeLayers.legend.gradient} />
      </div>
      <div
        className={`${
          showSlope ? "visible" : "hidden"
        } flex bg-slate-800/75 pl-2 pr-2 m-2 rounded-lg justify-end`}
      >
        <LegendKey {...slopeLayers.legend} />
        <Gradient gradient={slopeLayers.legend.gradient} />
      </div>
    </div>
  );
};

export default MapLegend;
