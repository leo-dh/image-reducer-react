import { QuantizerModule } from '../codecs/imagequant/imagequant';

export const defaultOptions = {
  numColors: 256,
  dither: 0.5,
};
export type ImagequantOptions = typeof defaultOptions;
declare const quantizerModule: QuantizerModule;
export type Quantize = typeof quantizerModule.quantize;
