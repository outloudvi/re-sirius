declare module "msgpack-lite/lib/ext-buffer" {
  declare class ExtBuffer {
    constructor(buffer: Buffer, type: number)
    buffer: Buffer
    type: number
  }
}
