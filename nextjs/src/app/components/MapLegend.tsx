import { useMapContext } from "../reducers/mapReducer";

const Gradient = ({
  gradient,
}: {
  gradient: { min: string; mid: string; max: string };
}) => {
  return (
    <>
      <div
        className={`w-auto h-6 sm:h-36 sm:w-6 bg-white hidden sm:block`}
        style={{
          backgroundImage: `linear-gradient(${gradient.min}, ${gradient.mid}, ${gradient.max})`,
        }}
      />
      <div
        className={`w-auto h-6 sm:h-36 sm:w-6 bg-white sm:hidden`}
        style={{
          backgroundImage: `linear-gradient(to right, ${gradient.min}, ${gradient.mid}, ${gradient.max})`,
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
    <div className="flex sm:flex-col justify-between m-2 text-right">
      <LegendText text={minText} />
      <LegendText text={midText} />
      <LegendText text={maxText} />
    </div>
  );
};

const MapLegend = () => {
  const { map } = useMapContext();

  const legends = Object.entries(map.dataLayers)
    .filter(([, dataLayer]) => dataLayer.layers.some((layer) => layer.active))
    .map(([key, dataLayer]) => {
      return (
        <div
          key={key}
          className={`flex-col sm:flex sm:flex-row justify-end bg-slate-800/75 rounded-lg overflow-hidden my-1 sm:flex`}
        >
          <LegendKey {...dataLayer.legend} />
          <Gradient gradient={dataLayer.legend.gradient} />
        </div>
      );
    });

  return (
    <div className="w-screen sm:w-auto flex bottom-[75px] sm:bottom-4 sm:right-4 absolute text-white">
      <div className="flex-grow mx-2  relative above-map flex-col sm:flex sm:items-end">
        {legends.reverse()}
      </div>
    </div>
  );
};

export default MapLegend;
