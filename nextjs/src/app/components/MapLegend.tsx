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
      className="w-auto h-6 sm:h-36 sm:w-6 bg-lime-200"
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
    <div className="flex sm:flex-col justify-between m-2 text-right">
      <LegendText text={minText} />
      <LegendText text={midText} />
      <LegendText text={maxText} />
    </div>
  );
};

const MapLegend = () => {
  const { showSlope, activeShade } = useContext(MapContext);
  console.log(showSlope);
  return (
    <div className="w-screen sm:w-auto flex bottom-[75px] sm:bottom-4 sm:right-4 absolute text-white">
      <div className="flex-grow mx-2  relative above-map flex-col sm:flex sm:items-end">
        {activeShade >= 0 && (
          <div
            className={`flex-col sm:flex sm:flex-row justify-end bg-slate-800/75 rounded-lg overflow-hidden my-1 sm:flex`}
          >
            <LegendKey {...shadeLayers.legend} />
            <Gradient gradient={shadeLayers.legend.gradient} />
          </div>
        )}
        {showSlope && (
          <div
            className={`flex-col sm:flex sm:flex-row justify-end bg-slate-800/75 rounded-lg overflow-hidden my-1`}
          >
            <LegendKey {...slopeLayers.legend} />
            <Gradient gradient={slopeLayers.legend.gradient} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapLegend;
