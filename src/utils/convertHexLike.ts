const stdFormatRegex = /( +[0-9A-Fa-f]{2}){16} /

export default function convertHexLike(s: string): string {
  const lines = s
    .split("\n")
    .filter((x) => x.trim() !== "")
    .map((x) => x.replace(/\t/g, " "))
  const firstLine = lines?.[0]
  if (!firstLine) {
    return s
  }
  const lineRef = (" " + firstLine + " ").match(stdFormatRegex)
  if (!lineRef) {
    return s
  }

  const startIndex = lineRef.index! - 1
  const endIndex = startIndex + lineRef[0].length - 1
  return lines.map((x) => x.slice(startIndex, endIndex + 1).trim()).join("\n")
}
