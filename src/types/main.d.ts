// Hackish way to inline comlink lib with worker
declare module 'comlink/dist/esm/comlink.min.js' {
  export * from 'comlink';
}
