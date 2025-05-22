import { Fragment } from "react";
import ControlButton from "./ControlButton";
import { useMapContext } from "../reducers/mapReducer";
// import TimeSlider from "./TimeSlider";
import Slider from "./Slider";

const MapControl = ({ experimental }: { experimental?: boolean }) => {
  const { map, dispatch } = useMapContext();

  const controlGroups = Object.entries(map.dataLayers).map(
    ([key, dataLayer], index) => {
      const controls = dataLayer.layers
        .filter((layer) => layer.control)
        .map((layer) => {
          return (
            // TODO Should be { layer.control && ....}
            <ControlButton
              key={layer.control!.title}
              icon={layer.control!.icon}
              alt={layer.control!.alt}
              title={layer.control!.title}
              label={layer.control!.label}
              variant={layer.active ? "active" : "inactive"}
              onClick={() =>
                dispatch({
                  type: "updateLayerActive",
                  payload: {
                    id: layer.id,
                    dataLayer: key as keyof typeof map.dataLayers,
                    active: !layer.active,
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
    <div className="fixed flex bottom-0 sm:bottom-auto sm:top-12 sm:right-0 sm:absolute above-map sm:m-2 cursor-pointer sm:flex-col flex-col-reverse items-center">
      <div
        className={`w-screen sm:w-auto control-layer flex cursor-pointer relative transition-all duration-200 bg-slate-900/75 px-1 pt-2 pb-2 sm:rounded-lg text-white`}
      >
        {experimental && (
          <>
            <ControlButton
              icon={"/icons/3d.svg"}
              alt="toggle 3d"
              title="3d"
              label="3d"
              variant={map.effectsState.threeDimensions ? "active" : "inactive"}
              onClick={() =>
                dispatch({
                  type: "toggle3dMode",
                  payload: {
                    value: !map.effectsState.threeDimensions,
                  },
                })
              }
            />
            <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/75 ml-1 mr-1"></div>
            {map.shaderLayers.map((layer) => {
              return (
                <ControlButton
                  key={layer.control!.title}
                  icon={layer.control!.icon}
                  alt={layer.control!.alt}
                  title={layer.control!.title}
                  label={layer.control!.label}
                  variant={layer.active ? "active" : "inactive"}
                  onClick={() =>
                    dispatch({
                      type: "updateShader",
                      payload: {
                        id: layer.id,
                        active: !layer.active,
                      },
                    })
                  }
                />
              );
            })}
            <div className="inline-block min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/75 ml-1 mr-1"></div>
          </>
        )}
        {controlGroups}
      </div>

      {map.shaderLayers
        .filter((shader) => shader.active)
        .map((shader) => {
          return Object.entries(shader.sliders).map(([slider, value]) => {
            return (
              <div className="w-full" key={slider + shader.id}>
                <Slider
                  shader={shader.id}
                  slider={slider}
                  value={value.value}
                  legend={value.legend}
                  min={value.min}
                  max={value.max}
                  title={value.title}
                />
              </div>
            );
          });
        })}

      {map.effectsState.threeDimensions && false && (
        <div className="w-full">{/* <TimeSlider />  */}</div>
      )}
    </div>
  );
};

export default MapControl;
