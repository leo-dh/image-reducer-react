import {
  QuantizerModule,
  ImagequantOptions as EncodeOptions,
} from '../codecs/imagequant/imagequant';

export type ImagequantOptions = EncodeOptions;
export const defaultOptions: ImagequantOptions = {
  num_colors: 256,
  min_quality: 60,
  max_quality: 80,
  dithering: 0.5,
};
declare const quantizerModule: QuantizerModule;
export type Quantize = typeof quantizerModule.quantize;
