import { Fragment } from "react";
import ControlButton from "./ControlButton";
import { Layer, ShaderLayer } from "../reducers/state";
import Slider from "./Slider";
import TimeSlider from "./TimeSlider";
import { Action } from "@/reducers/actions";
import { useMapContext } from "@/reducers/context";

const MapControl = () => {
  const { map, dispatch } = useMapContext();

  const controlButton = (
    layer: Layer | ShaderLayer,
    payload: Action,
    active: boolean
  ) => {
    return (
      <ControlButton
        key={layer.control!.title}
        icon={layer.control!.icon}
        alt={layer.control!.alt}
        title={layer.control!.title}
        label={layer.control!.label}
        variant={active ? "active" : "inactive"}
        onClick={() => dispatch(payload)}
      />
    );
  };

  const baseGroups = map.baseLayers.map((layer) => {
    return controlButton(
      layer,
      {
        type: "updateActiveBaseLayer",
        payload: {
          layer: layer,
          // baseLayer: key as keyof typeof map.baseLayers,
          // active: !layer.active,
        },
      },
      map.activeBase.id === layer.id
    );
  });

  const controlGroups = Object.entries(map.dataLayers).map(
    ([key, dataLayer]) => {
      const controls = dataLayer.layers
        .filter(
          (layer) => (layer.control && !map.threeDimensions) || !layer.hideOn3d
        )
        .map((layer) => {
          return controlButton(
            layer,
            {
              type: "updateLayerActive",
              payload: {
                id: layer.id,
                dataLayer: key as keyof typeof map.dataLayers,
                active: !layer.active,
              },
            },
            layer.active
          );
        });

      return <Fragment key={key}>{controls}</Fragment>;
    }
  );
  return (
    <div className="fixed flex bottom-0 sm:bottom-auto sm:right-0 sm:absolute above-map sm:m-2 cursor-pointer sm:flex-col flex-col-reverse items-center">
      <div
        className={`w-screen flex-wrap sm:w-auto control-layer flex cursor-pointer relative transition-all duration-200 bg-slate-900/75 px-1 py-1 sm:rounded-lg text-white`}
      >
        <>
          {baseGroups}
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
            return controlButton(
              layer,
              {
                type: "updateShader",
                payload: {
                  id: layer.id,
                  active: !layer.active,
                },
              },
              layer.active
            );
          })}
          <ControlButton
            icon={map.avalancheLayer.control?.icon || ""}
            alt="toggle avalanche forecast"
            title="Forecast"
            label="Forecast"
            variant={map.avalancheLayer.active ? "active" : "inactive"}
            onClick={() => {
              dispatch({
                type: "toggleAvalancheLayer",
                payload: {
                  active: !map.avalancheLayer.active,
                },
              });
            }}
          />
          <ControlButton
            icon={"/icons/3d.svg"}
            alt="toggle 3d"
            title="3d"
            label="3d"
            variant={map.threeDimensions ? "active" : "inactive"}
            onClick={() => {
              dispatch({
                type: "toggle3dMode",
                payload: {
                  value: !map.threeDimensions,
                },
              });
            }}
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
                    legendOnly={value.legendOnly || false}
                    value={value.value}
                    legend={value.legend}
                    min={value.min}
                    max={value.max}
                    title={value.title}
                    gradient={shader.legend ? shader.legend.gradient : null}
                    blocks={value.blocks}
                  />
                </div>
              );
            });
        })}

      {map.avalancheLayer.active &&
        Object.entries(map.avalancheLayer.sliders)
          .filter(([, value]) => !value.hidden)
          .map(([slider, value]) => {
            return (
              <div className="w-full" key={slider + map.avalancheLayer.id}>
                <Slider
                  shader={map.avalancheLayer.id}
                  slider={slider}
                  legendOnly={value.legendOnly || false}
                  value={value.value}
                  legend={value.legend}
                  min={value.min}
                  max={value.max}
                  title={value.title}
                  gradient={
                    map.avalancheLayer.legend
                      ? map.avalancheLayer.legend.gradient
                      : null
                  }
                  blocks={value.blocks}
                />
              </div>
            );
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
