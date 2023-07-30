import { decode } from "msgpack-lite"
import { ExtBuffer } from "msgpack-lite/lib/ext-buffer"

import lz4Decompress from "./lz4Decompress"

export default function decodeMsgpackResponse(buf: Buffer) {
  const cleanedBuf = Buffer.from(
    buf
      .toString("binary")
      .replace(/\x92\xd4\x62\x01\xc6\x00\x00\x00\x02\x10\x90/g, ""),
    "binary"
  )

  const outerMsgpack = decode(cleanedBuf)
  if (outerMsgpack[0] instanceof ExtBuffer) {
    if (outerMsgpack[0].type !== 0x62) {
      throw Error(`Not an LZ4BlockArray item - type = ${outerMsgpack[0].type}`)
    }
    // this is an LZ4 compressed block
    const innerMsgpackBuf = lz4Decompress(outerMsgpack[1])
    return decode(innerMsgpackBuf)
  }
  return outerMsgpack
}
