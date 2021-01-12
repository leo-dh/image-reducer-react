import { EncodeOptions } from '../codecs/mozjpeg/mozjpeg_enc';

// doesn't allow export const enum
export enum MozJpegColorSpace {
  GRAYSCALE = 1,
  RGB,
  YCbCr,
}

export const defaultOptions: EncodeOptions = {
  quality: 75,
  baseline: false,
  arithmetic: false,
  progressive: true,
  optimize_coding: true,
  smoothing: 0,
  color_space: MozJpegColorSpace.YCbCr.valueOf(),
  quant_table: 3,
  trellis_multipass: false,
  trellis_opt_zero: false,
  trellis_opt_table: false,
  trellis_loops: 1,
  auto_subsample: true,
  chroma_subsample: 2,
  separate_chroma_quality: false,
  chroma_quality: 75,
};
