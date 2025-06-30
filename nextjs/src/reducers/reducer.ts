import { Action } from "./actions";
import { MapConfig, baseMap, shaderLayers, Layer } from "./state";

export const mapReducer = (map: MapConfig, action: Action) => {
  switch (action.type) {
    case "updateActiveBaseLayer": {
      const newBase =
        action.payload.layer.id === map.activeBase.id
          ? baseMap
          : action.payload.layer;
      return {
        ...map,
        activeBase: newBase,
      };
    }
    case "toggleAvalancheLayer":
      return {
        ...map,
        avalancheLayer: {
          ...map.avalancheLayer,
          active: action.payload.active,
        },
      };
    case "updateLayerActive":
      const { dataLayer, id, active } = action.payload;
      const dataLayers = {
        ...map.dataLayers,
        [dataLayer]: {
          ...map.dataLayers[dataLayer],
          layers: map.dataLayers[dataLayer].layers.map((layer) => {
            layer.active = false;
            if (id === layer.id) {
              layer.active = active;
            }
            return layer;
          }),
        },
      };

      // Eco - remove layers not actively looked at
      const activeLayers = Object.entries(map.dataLayers).reduce<Layer[]>(
        (al, [, dataLayer]) => {
          return al.concat(dataLayer.layers.filter((layer) => layer.active));
        },
        []
      );

      // Hybrid - keep layers not actively looked at but selected running
      // const activeLayers = map.activeLayers.concat(
      //   map.dataLayers[dataLayer].layers.filter((layer) => layer.id === id)
      // );

      return {
        ...map,
        activeLayers,
        dataLayers,
      };
    case "setSearchCenter": {
      const { center } = action.payload;
      return {
        ...map,
        searchResults: {
          center,
          zoom: map.searchResults.zoom, // Not settable at the moment
        },
      };
    }
    case "toggle3dMode": {
      return {
        ...map,
        threeDimensions: action.payload.value,
        activeLayers: map.activeLayers.filter((activeLayer) => {
          map.dataLayers.shadeLayers.layers.some(
            (layer) => layer.id !== activeLayer.id
          );
        }),
        dataLayers: {
          ...map.dataLayers,
          shadeLayers: {
            ...map.dataLayers.shadeLayers,
            layers: map.dataLayers.shadeLayers.layers.map((layer) => {
              return {
                ...layer,
                active: false,
              };
            }),
          },
        },
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            active: action.payload.value ? map.effectsState.sun.active : false,
          },
        },
      };
    }
    case "updateTimestamp": {
      return {
        ...map,
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            timestamp: action.payload.value,
          },
        },
      };
    }
    case "updateViewState": {
      return {
        ...map,
        viewState: {
          ...map.viewState,
          ...action.payload.viewState,
        },
      };
    }
    case "updateSlider": {
      return {
        ...map,
        shaderLayers: shaderLayers.map((shader) => {
          if (shader.id === action.payload.shader)
            shader.sliders[action.payload.slider].value = action.payload.value;
          return shader;
        }),
      };
    }
    case "updateShader": {
      const { id: updatedId, active } = action.payload;

      // Hybrid - keep layers not actively looked at but selected running
      // const activeLayers = map.activeLayers.concat(
      //   map.dataLayers[dataLayer].layers.filter((layer) => layer.id === id)
      // );

      const activeShaders = active
        ? map.activeShaders.concat([updatedId])
        : map.activeShaders.filter((id) => id !== updatedId);
      return {
        ...map,
        activeShaders,
        shadeLayers: shaderLayers.map((shader) => {
          if (shader.id === updatedId) shader.active = active;
          return shader;
        }),
      };
    }
    case "toggleSun": {
      return {
        ...map,
        effectsState: {
          ...map.effectsState,
          sun: {
            ...map.effectsState.sun,
            active: action.payload.active,
          },
        },
      };
    }
    default:
      throw new Error("unknown action type in the map reducer");
  }
};
