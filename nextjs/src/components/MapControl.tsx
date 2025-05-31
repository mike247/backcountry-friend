import { Fragment } from "react";
import ControlButton from "./ControlButton";
import {
  Action,
  Layer,
  ShaderLayer,
  useMapContext,
} from "../reducers/mapReducer";
import Slider from "./Slider";
import TimeSlider from "./TimeSlider";

const MapControl = () => {
  const { map, dispatch } = useMapContext();

  const controlButton = (layer: Layer | ShaderLayer, payload: Action) => {
    return (
      <ControlButton
        key={layer.control!.title}
        icon={layer.control!.icon}
        alt={layer.control!.alt}
        title={layer.control!.title}
        label={layer.control!.label}
        variant={layer.active ? "active" : "inactive"}
        onClick={() => dispatch(payload)}
      />
    );
  };

  const controlGroups = Object.entries(map.dataLayers).map(
    ([key, dataLayer]) => {
      const controls = dataLayer.layers
        .filter(
          (layer) => (layer.control && !map.threeDimensions) || !layer.hideOn3d
        )
        .map((layer) => {
          return controlButton(layer, {
            type: "updateLayerActive",
            payload: {
              id: layer.id,
              dataLayer: key as keyof typeof map.dataLayers,
              active: !layer.active,
            },
          });
        });

      return <Fragment key={key}>{controls}</Fragment>;
    }
  );
  return (
    <div className="fixed flex bottom-0 sm:bottom-auto sm:top-12 sm:right-0 sm:absolute above-map sm:m-2 cursor-pointer sm:flex-col flex-col-reverse items-center">
      <div
        className={`w-screen flex-wrap sm:w-auto control-layer flex cursor-pointer relative transition-all duration-200 bg-slate-900/75 px-1 py-1 sm:rounded-lg text-white`}
      >
        <>
          {controlGroups}
          {map.threeDimensions && (
            <>
              <ControlButton
                icon={"/icons/midday.svg"}
                alt="toggle dynamic sun"
                title="Sun"
                label="Sun"
                variant={map.effectsState.sun.active ? "active" : "inactive"}
                onClick={() =>
                  dispatch({
                    type: "toggleSun",
                    payload: {
                      active: !map.effectsState.sun.active,
                    },
                  })
                }
              />
            </>
          )}
          {map.shaderLayers.map((layer) => {
            return controlButton(layer, {
              type: "updateShader",
              payload: {
                id: layer.id,
                active: !layer.active,
              },
            });
          })}
          <ControlButton
            icon={"/icons/3d.svg"}
            alt="toggle 3d"
            title="3d"
            label="3d"
            variant={map.threeDimensions ? "active" : "inactive"}
            onClick={() =>
              dispatch({
                type: "toggle3dMode",
                payload: {
                  value: !map.threeDimensions,
                },
              })
            }
          />
        </>
      </div>

      {map.shaderLayers
        .filter((shader) => shader.active)
        .map((shader) => {
          return Object.entries(shader.sliders)
            .filter(([, value]) => !value.hidden)
            .map(([slider, value]) => {
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
                    gradient={shader.legend ? shader.legend.gradient : null}
                  />
                </div>
              );
            });
        })}

      {map.effectsState.sun.active && (
        <div className="w-full">
          <TimeSlider />
        </div>
      )}
    </div>
  );
};

export default MapControl;
