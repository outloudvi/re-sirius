export function toU32BE(n: number): ArrayBuffer {
  const d = new DataView(new ArrayBuffer(4))
  d.setUint32(0, n, false)
  return d.buffer
}

export function toU16BE(n: number): ArrayBuffer {
  const d = new DataView(new ArrayBuffer(2))
  d.setUint16(0, n, false)
  return d.buffer
}
