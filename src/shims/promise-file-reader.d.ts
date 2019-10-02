declare module 'promise-file-reader' {
  export function readAsText(blob: Blob): Promise<string>;
}
