export default function createBlob(arrayBuffer: ArrayBuffer, mimetype: string) {
  const bytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([bytes.buffer], { type: mimetype });
  return blob;
}
