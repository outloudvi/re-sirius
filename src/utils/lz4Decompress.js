import lz4 from "lz4"

export default function lz4Decompress(d) {
  const decompressedBuf = Buffer.alloc(3 * 1024 * 1024) // 3MB
  const size = lz4.decodeBlock(d, decompressedBuf)
  return Uint8Array.prototype.slice.call(decompressedBuf, 0, size)
}
