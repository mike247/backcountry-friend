import Image from "next/image";
import { Fragment } from "react";
import ControlButton from "./ControlButton";
import { useMapContext } from "../reducers/mapReducer";

const MapControl = () => {
  const { map, dispatch } = useMapContext();

  const controlGroups = Object.entries(map.dataLayers).map(
    ([key, dataLayer], index) => {
      const controls = dataLayer.layers.map((layer, index) => {
        return (
          <ControlButton
            key={layer.legend.title}
            icon={layer.legend.icon}
            alt={layer.legend.alt}
            title={layer.legend.title}
            label={layer.legend.label}
            variant={layer.active ? "active" : "inactive"}
            onClick={() =>
              dispatch({
                type: "updateLayerActive",
                payload: {
                  index,
                  dataLayer: key as keyof typeof map.dataLayers,
                  value: !layer.active,
                },
              })
            }
          />
        );
      });
      return (
        <Fragment key={key}>
          {controls}
          {index < Object.keys(map.dataLayers).length - 1 && ( // Break lines in the middle
            <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/75 ml-1 mr-1"></div>
          )}
        </Fragment>
      );
    }
  );
  return (
    <div className="fixed bottom-0 sm:bottom-auto sm:top-12 sm:right-0 sm:absolute above-map sm:m-2 cursor-pointer flex items-center">
      <div
        className={`w-screen sm:w-auto control-layer flex cursor-pointer relative transition-all duration-200 bg-slate-900/75 px-1 pt-2 pb-2 sm:rounded-lg text-white`}
      >
        {controlGroups}
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
