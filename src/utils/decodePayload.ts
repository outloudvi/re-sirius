import { decode } from "msgpack-lite"
import { DecodeBuffer } from "msgpack-lite/lib/decode-buffer"
import { ExtBuffer } from "msgpack-lite/lib/ext-buffer"

import lz4Decompress from "./lz4Decompress"

function buildStructInside(x: any) {
  if (!Array.isArray(x)) return

  for (const key in x) {
    const item = x[key]
    buildStructInside(item)
    if (typeof item === "object" && item !== null) {
      if ("buffer" in item && "type" in item) {
        // a raw buffer - we try to extract it
        if (item.type === 255) {
          // DateTime
          const timestamp = (item.buffer as Buffer).readUInt32BE()
          x[key] = new Date(timestamp * 1000)
        }
      }
    }
  }
}

export function unpackMsgpackLz4Payload(obj: any): any {
  if (Array.isArray(obj) && obj.length === 2 && obj[0] instanceof ExtBuffer) {
    if (obj[0].type !== 0x62) {
      throw Error(`Not an LZ4BlockArray item - type = ${obj[0].type}`)
    }
    // this is an LZ4 compressed block
    const innerMsgpackBuf = lz4Decompress(obj[1])
    const decodedInner = decode(innerMsgpackBuf)
    return decodedInner
  }
  return obj
}

export default function decodePayload(buf: Buffer): any[] {
  const decodeBuf = DecodeBuffer()
  decodeBuf.write(buf)
  decodeBuf.flush()
  const items = decodeBuf.buffers.map(unpackMsgpackLz4Payload)

  return items
    .filter((x) => !(Array.isArray(x) && x.length === 0))
    .map((x) => {
      buildStructInside(x)
      return x
    })
}
