import { EncodeOptions } from '../codecs/mozjpeg/mozjpeg_enc';

export enum COMPRESSION_MODE {
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
  options: EncodeOptions,
  mimetype: string,
) => Promise<Blob>;

export interface EncoderWorker extends Worker {
  mozjpegEncode: MozjpegEncode;
}
