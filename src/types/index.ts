export enum CompressionMode {
  LOSSLESS = 'LOSSLESS',
  LOSSY = 'LOSSY',
  // CUSTOM = 'CUSTOM',
}

export interface CompressResults {
  filename: string;
  initialSize: string;
  finalSize: string;
  url: string;
}

export type Encode = (
  imageData: ImageData,
  quality: number,
  mimetype: string,
) => Promise<ImageData> | Promise<Blob>;

export interface EncoderWorker extends Worker {
  encode: Encode;
}
