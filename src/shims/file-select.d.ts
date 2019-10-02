declare module 'file-select' {
  export default function selectFile(
    options: Record<string, any>,
  ): Promise<File>;
}
