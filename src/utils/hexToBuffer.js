export default function hexToBuffer(hex) {
  return Buffer.from(
    hex
      .replaceAll("\n", " ")
      .split(" ")
      .filter((x) => x)
      .map((x) => Number.parseInt(x, 16))
  )
}
