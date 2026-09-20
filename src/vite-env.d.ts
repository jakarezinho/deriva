declare module '*.wasm?url' {
  const url: string;
  export default url;
}

declare module '*.wasm?arraybuffer' {
  const buffer: ArrayBuffer;
  export default buffer;
}
