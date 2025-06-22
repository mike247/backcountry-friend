import { JSX } from "react";
import { useMapContext } from "../reducers/context";

const Gradient = ({ gradient }: { gradient: string[] }) => {
  const linearGradient = gradient.join(",");
  return (
    <>
      <div
        className={`w-auto h-6 sm:h-36 sm:w-6 bg-white hidden sm:block`}
        style={{
          backgroundImage: `linear-gradient(to top, ${linearGradient})`,
        }}
      />
      <div
        className={`w-auto h-6 sm:h-36 sm:w-6 bg-white sm:hidden`}
        style={{
          backgroundImage: `linear-gradient(to right, ${linearGradient})`,
        }}
      />
    </>
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
    <div className="flex sm:flex-col-reverse justify-between m-2 text-right">
      <LegendText text={minText} />
      <LegendText text={midText} />
      <LegendText text={maxText} />
    </div>
  );
};

const MapLegend = () => {
  const { map } = useMapContext();

  const legends = [];

  legends.push(
    Object.entries(map.dataLayers).reduce<JSX.Element[]>(
      (acc, [key, layer]) => {
        if (layer.legend && layer.layers.some((layer) => layer.active)) {
          return acc.concat(
            <div
              key={key}
              className={`flex-col sm:flex sm:flex-row justify-end bg-slate-800/75 rounded-lg overflow-hidden my-1 sm:flex`}
            >
              <LegendKey {...layer.legend!} />
              <Gradient gradient={layer.legend!.gradient} />
            </div>
          );
        }
        return acc;
      },
      []
    )
  );

  // TODO hacky but easy
  return (
    <div
      className={`${
        map.threeDimensions ? "bottom-[144px]" : "bottom-[75px]"
      } w-screen sm:w-auto flex sm:bottom-4 sm:right-4 absolute text-white`}
    >
      <div className="flex-grow mx-2  relative above-map flex-col sm:flex sm:items-end">
        {legends.reverse()}
      </div>
    </div>
  );
};

export default MapLegend;
