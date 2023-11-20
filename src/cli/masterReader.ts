import * as fs from "node:fs"
import decodePayload from "#/utils/decodePayload"
import {
  getClassProperties,
  getEnumProperties,
} from "#/utils/getClassProperties"
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

  "DateTime",
]

const StructDefCache: Record<string, ClassField[]> = {}
const EnumDefCache: Record<string, string[]> = {}
const WarningLinesCache: string[] = []

function printWarn(text: string) {
  if (!WarningLinesCache.includes(text)) {
    console.warn(text)
    WarningLinesCache.push(text)
  }
}

function mergeStructAndSchema(
  data: any,
  className: string,
  srcLines: string[]
): Record<string, any> | any {
  const clearClassName = className.replace(/Nullable<(.+)>/, "$1")
  if (CSharpBuiltinTypes.includes(clearClassName)) {
    return data
  }

  // Non-struct
  if (data === null) {
    // null
    return null
  }
  if (!Array.isArray(data)) {
    if (Number.isNaN(data)) {
      // non-enum
      return data
    }

    const enumDef =
      EnumDefCache[clearClassName] ??
      (EnumDefCache[clearClassName] = getEnumProperties(
        clearClassName,
        srcLines
      ))
    if (enumDef.length === 0) {
      // non-enum
      return data
    }
    const item = enumDef[data]
    if (item !== undefined) {
      return item
    }

    // fallback
    const maybeBitwise = tryBitwiseParse(data, enumDef)
    if (maybeBitwise !== null) {
      printWarn(`[${clearClassName}] Read as a bit-wise enum`)
      return maybeBitwise.join(",")
    }
    printWarn(`[${clearClassName}] Unknown enum id ${data}, skipping`)
    return data
  }

  // struct
  const structDef =
    StructDefCache[clearClassName] ??
    (StructDefCache[clearClassName] = getClassProperties(
      clearClassName,
      srcLines
    ))

  const v: Record<string, any> = {}
  for (const [key, val] of Object.entries(data)) {
    const prop = structDef.find((x) => x.index === Number(key))
    if (prop === undefined) {
      printWarn(`[${clearClassName}] Unknown property order ${key}, skipping`)
      continue
    }
    const k = prop.name
    if (Array.isArray(val) && prop.type.endsWith("[]")) {
      // need deeper merge
      const innerTypeName = prop.type.replace(/\[\]$/, "")
      v[k] = val.map((x) => mergeStructAndSchema(x, innerTypeName, srcLines))
    } else {
      v[k] = mergeStructAndSchema(val, prop.type, srcLines)
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

function canBeBitwiseEnum(enumDef: string[]) {
  const keys = Object.keys(enumDef)
  return (
    keys.filter((x) => Number(x).toString(2).match(/10?/) === null).length === 0
  )
}

function tryBitwiseParse(data: number, enumDef: string[]): string[] | null {
  if (!canBeBitwiseEnum(enumDef)) return null
  if (data === 0) {
    return ["[NONE]"]
  }
  return data
    .toString(2)
    .split("")
    .reverse()
    .map((v, i) => ({ value: v, bit: 2 ** i }))
    .filter(({ value }) => value === "1")
    .map(({ bit }) => enumDef[bit] ?? String(bit))
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
