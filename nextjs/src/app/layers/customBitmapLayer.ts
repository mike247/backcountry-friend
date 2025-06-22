import { ShaderModule } from "@luma.gl/shadertools";
import {
  avalanceUniformModule,
  AvalancheUniformProps,
  customUniformModule,
  CustomUniformProps,
} from "../shaders/uniforms";
import { BitmapLayer, BitmapLayerProps } from "@deck.gl/layers";
import { Texture } from "@luma.gl/core";

interface CustomBitmapLayerProps extends BitmapLayerProps {
  customUniforms: CustomUniformProps;
  avalancheUniforms: AvalancheUniformProps | undefined;
  texture: Texture | null;
  module: ShaderModule;
  shader: string;
}

export const maskTextureModule: ShaderModule = {
  name: "texture",
  vs: "sampler2D maskTexture;",
  fs: "sampler2D maskTexture;",
  dependencies: [],
};

export class CustomBitmapLayer extends BitmapLayer<CustomBitmapLayerProps> {
  static componentName = "CustomBitmapLayer";

  draw(opts: unknown) {
    const { model } = this.state;
    const uniforms = this.props.customUniforms;
    if (model) {
      const customUniformProps: CustomUniformProps = {
        pixelSize: uniforms.pixelSize,
        textureSize: uniforms.textureSize,
        opacity: uniforms.opacity,
        cutoffElevation: uniforms.cutoffElevation,
        cutoffAngle: uniforms.cutoffAngle,
        tileBounds: uniforms.tileBounds,
        maskBounds: uniforms.maskBounds,
      };

      const props = {
        custom: customUniformProps,
        avalanche: this.props.avalancheUniforms,
      };

      model.shaderInputs.setProps(props);

      if (this.props.texture) {
        model.setBindings({
          maskTexture: this.props.texture,
        });
      }

      super.draw(opts);
    }
  }

  getShaders(): {
    vs: string;
    fs: string;
    modules: ShaderModule[]; // TODO FIx
  } {
    const shaders = super.getShaders();
    return {
      ...shaders,
      modules: [
        ...(shaders.modules || []),
        customUniformModule,
        avalanceUniformModule,
        // maskTextureModule,
        this.props.module,
      ],
      fs: this.props.shader,
    };
  }
}
