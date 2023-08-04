declare module "msgpack-lite/lib/encode-buffer" {
  declare class EncodeBuffer {
    // it's a subset of the actual class
    write(payload: any): void
    buffer: Buffer
    start: number
    offset: number
  }
  declare function EncodeBuffer(): EncodeBuffer
}
