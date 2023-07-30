import * as lz4 from "lz4"

export default function lz4Decompress(d: Buffer): Buffer {
  const decompressedBuf = Buffer.alloc(3 * 1024 * 1024) // 3MB
  const size = lz4.decodeBlock(d, decompressedBuf)
  return decompressedBuf.subarray(0, size)
}
