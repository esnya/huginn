declare module 'save-file' {
  export function save(data: Blob, filename: string): Promise<void>;
}
