import * as fs from "node:fs"
import decodePayload from "#/utils/decodePayload"
import getClassProperties from "#/utils/getClassProperties"
import type { ClassField } from "#/utils/getClassProperties"

const CSharpBuiltinTypes = [
  "bool",
  "byte",
  "sbyte",
  "char",
  "decimal",
  "double",
  "float",
  "int",
  "uint",
  "nint",
  "nuint",
  "long",
  "ulong",
  "short",
  "ushort",
  "object",
  "string",
  "dynamic",
]

const StructDefCache: Record<string, ClassField[]> = {}

function mergeStructAndSchema(
  data: any,
  className: string,
  srcLines: string[]
): Record<string, any> {
  if (CSharpBuiltinTypes.includes(className)) {
    return data
  }
  const structDef =
    StructDefCache[className] ??
    (StructDefCache[className] = getClassProperties(className, srcLines))

  const v: Record<string, any> = {}
  for (const [key, val] of Object.entries(data)) {
    const prop = structDef.find((x) => x.index === Number(key))
    if (prop === undefined) {
      console.warn(`Unknown property order ${key} in ${className}, skipping`)
      continue
    }
    const k = prop.name
    if (Array.isArray(val)) {
      if (prop.type.endsWith("[]")) {
        // need deeper merge
        const innerTypeName = prop.type.replace(/\[\]$/, "")
        v[k] = val.map((x) => mergeStructAndSchema(x, innerTypeName, srcLines))
      } else {
        v[k] = mergeStructAndSchema(val, prop.type, srcLines)
      }
    } else {
      v[k] = val
    }
  }
  return v
}

function mergeArrayAndSchema(
  data: any[][],
  className: string,
  srcLines: string[]
): Record<string, any>[] {
  const ret: Record<string, any>[] = []
  for (const line of data) {
    ret.push(mergeStructAndSchema(line, className, srcLines))
  }
  return ret
}

class MasterReader {
  #tree: [string, [number, number]][] | null = null
  #tableId = 0
  #srcLines: string[] = []

  init(srcLines: string[]) {
    if (fs.existsSync("mm/")) {
      fs.rmSync("mm/", {
        recursive: true,
        force: true,
      })
    }
    fs.mkdirSync("mm/")
    this.#srcLines = srcLines
  }
  push(data: any) {
    if (this.#tree === null) {
      // the first payload is the tree
      console.debug("Reading MM tree")
      this.#tree = data
      fs.writeFileSync("mm/__tree.json", JSON.stringify(data, null, 2))
    } else {
      const [className, [offset, size]] = Object.entries(this.#tree)[
        this.#tableId++
      ]
      console.debug(`Reading part: ${className} - expected size: ${size}`)
      const dataWithSchema = mergeArrayAndSchema(
        data,
        className,
        this.#srcLines
      )
      fs.writeFileSync(
        `mm/${className}.json`,
        JSON.stringify(dataWithSchema, null, 2)
      )
    }
  }
}

;(async () => {
  const masterBuf = fs.readFileSync(process.argv[2])
  const decodeResults = decodePayload(masterBuf)

  const mr = new MasterReader()
  mr.init(fs.readFileSync(process.argv[3], "utf-8").split("\n"))
  for (const i of decodeResults) {
    mr.push(i)
  }
})()
