export type ClassField = {
  index: number
  name: string
  type: string
}

function findText(
  text: string,
  lines: readonly string[],
  lineStart: number
): number {
  for (let i = lineStart; i < lines.length; i++) {
    if (lines[i].replace(/\s/g, "") === text) {
      return i
    }
  }
  return -1
}

export default function getClassProperties(
  className: string,
  lines: readonly string[]
): ClassField[] {
  const classConstLine = lines.findIndex((line) =>
    line.includes(`class ${className} `)
  )
  const classStartLine = findText("{", lines, classConstLine + 1)
  const classEndLine = findText("}", lines, classStartLine + 1)
  const ret: ClassField[] = []

  let nextKey = null
  for (let i = classStartLine + 1; i < classEndLine; i++) {
    const r1 = lines[i].match(/\[Key\((\d+)\)\]/)
    if (r1 !== null) {
      // Key
      nextKey = Number(r1[1])
      continue
    }
    if (lines[i].includes("public") && lines[i].includes("{ get; set; }")) {
      // Name & Type
      const [_, type, name] = lines[i]
        .replace(/\t/g, "")
        .replace(/ +/g, " ")
        .replace(/^ +/, "")
        .split(" ")
      if (nextKey === null) {
        console.warn(`No key found for ${name}, skipping`)
        continue
      }
      ret.push({ index: nextKey, type, name })
      nextKey = null
    }
  }
  return ret
}
