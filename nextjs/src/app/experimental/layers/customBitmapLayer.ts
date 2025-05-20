import { ShaderModule } from "@luma.gl/shadertools";
import { customUniformModule, CustomUniformProps } from "../shaders/uniform";
import { BitmapLayer, BitmapLayerProps } from "@deck.gl/layers";

interface CustomBitmapLayerProps extends BitmapLayerProps {
  pixelSize: [number, number];
  textureSize: [number, number];
  opacity: number;
  cutoffElevation: number;
  cutoffAngle: number;
  module: ShaderModule;
  shader: string;
}

export class CustomBitmapLayer extends BitmapLayer<CustomBitmapLayerProps> {
  draw(opts: unknown) {
    const { model } = this.state;
    if (model) {
      const customUniformProps: CustomUniformProps = {
        pixelSize: this.props.pixelSize,
        opacity: this.props.opacity,
        cutoffElevation: this.props.cutoffElevation,
        cutoffAngle: this.props.cutoffAngle,
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
