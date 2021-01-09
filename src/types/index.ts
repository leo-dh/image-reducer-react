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
