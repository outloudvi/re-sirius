declare module "msgpack-lite/lib/decode-buffer" {
  declare class DecodeBuffer {
    // it's a subset of the actual class
    flush(): void
    write(chunk: Buffer): void
    buffers: any[]
  }
  declare function DecodeBuffer(): DecodeBuffer
}
