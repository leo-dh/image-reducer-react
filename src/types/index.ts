import { MozjpegOptions } from '../imageprocessing/mozjpeg';
import { ImagequantOptions } from '../imageprocessing/imagequant';

export enum CompressionMode {
  LOSSLESS = 'LOSSLESS',
  LOSSY = 'LOSSY',
  CUSTOM = 'CUSTOM',
}

export interface CompressResults {
  filename: string;
  initialSize: string;
  finalSize: string;
  url: string;
}
export type MozjpegEncode = (
  imageData: ImageData,
  options: MozjpegOptions,
  mimetype: string,
) => Promise<Blob>;

export type ImagequantEncode = (
  imageData: ImageData,
  options: ImagequantOptions,
) => Promise<ImageData>;

export interface EncoderWorker extends Worker {
  mozjpegEncode: MozjpegEncode;
  imagequantEncode: ImagequantEncode;
}
