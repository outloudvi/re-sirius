import { decode } from "msgpack-lite"
import { DecodeBuffer } from "msgpack-lite/lib/decode-buffer"
import { ExtBuffer } from "msgpack-lite/lib/ext-buffer"

import { decompress } from "./lz4"

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
  if (
    Array.isArray(obj) &&
    obj.length >= 2 &&
    obj[0] instanceof ExtBuffer &&
    obj[0].type === 0x62
  ) {
    // Lz4BlockArray
    const innerMsgpackBufs = obj.slice(1).map((x) => decompress(x))
    const decodedInner = decode(Buffer.concat(innerMsgpackBufs))
    return decodedInner
  } else if (obj instanceof ExtBuffer && obj.type === 0x63) {
    // Lz4Block
    // the first 5 bytes is a "int 32" indicating the decompressed size
    const lz4Payload = obj.buffer.subarray(5)
    const innerMsgpackBuf = decompress(lz4Payload)
    const decodedInner = decode(innerMsgpackBuf)
    return decodedInner
  } else {
    return obj
  }
}

export default function decodePayload(buf: Buffer): any[] {
  const decodeBuf = DecodeBuffer()
  decodeBuf.write(buf)
  decodeBuf.flush()
  // empty data
  if (!decodeBuf.buffers) return []
  const items = decodeBuf.buffers.map(unpackMsgpackLz4Payload)
  const startFrom = items.findIndex(
    (x) => !(Array.isArray(x) && x.length === 0)
  )
  const endAt = findLastExistingElem(items)

  return items.slice(startFrom, endAt + 1).map((x) => {
    buildStructInside(x)
    return x
  })
}

function findLastExistingElem(items: any[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    if (!(Array.isArray(item) && item.length === 0)) {
      return i
    }
  }
  return 0
}
