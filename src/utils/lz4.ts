import * as lz4 from "lz4"

const DefaultAllocSize = 3 * 1024 * 1024 // 3MB

export function decompress(d: Buffer): Buffer {
  const buf = Buffer.alloc(DefaultAllocSize)
  const size = lz4.decodeBlock(d, buf)
  return buf.subarray(0, size)
}

export function compress(d: Buffer): Buffer {
  const buf = Buffer.alloc(DefaultAllocSize)
  const size = lz4.encodeBlock(d, buf)
  return buf.subarray(0, size)
}
