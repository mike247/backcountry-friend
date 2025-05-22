import { ShaderModule } from "@luma.gl/shadertools";
import { customUniformModule, CustomUniformProps } from "../shaders/uniforms";
import { BitmapLayer, BitmapLayerProps } from "@deck.gl/layers";

interface CustomBitmapLayerProps extends BitmapLayerProps {
  customUniforms: {
    pixelSize: [number, number];
    textureSize: [number, number];
    opacity: number;
    cutoffElevation: number;
    cutoffAngle: number;
  };

  module: ShaderModule;
  shader: string;
}

export class CustomBitmapLayer extends BitmapLayer<CustomBitmapLayerProps> {
  draw(opts: unknown) {
    const { model } = this.state;
    if (model) {
      const customUniformProps: CustomUniformProps = {
        pixelSize: this.props.customUniforms.pixelSize,
        textureSize: this.props.customUniforms.textureSize,
        opacity: this.props.customUniforms.opacity,
        cutoffElevation: this.props.customUniforms.cutoffElevation,
        cutoffAngle: this.props.customUniforms.cutoffAngle,
      };

      model.shaderInputs.setProps({
        custom: customUniformProps,
      });
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
        this.props.module,
      ],
      fs: this.props.shader,
    };
  }
}
