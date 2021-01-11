declare module '*?worker' {
  function workerWrapper(): Promise<Worker>;
  export default workerWrapper;
}
