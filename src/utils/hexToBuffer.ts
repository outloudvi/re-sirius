export default function hexToBuffer(hex: string): Buffer {
  return Buffer.from(
    hex
      .replace(/\n/g, " ")
      .split(" ")
      .filter((x) => x)
      .map((x) => Number.parseInt(x, 16))
  )
}
