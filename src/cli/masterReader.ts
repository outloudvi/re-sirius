import * as fs from "node:fs"
import decodePayload from "#/utils/decodePayload"
import getClassProperties from "#/utils/getClassProperties"
import type { ClassField } from "#/utils/getClassProperties"

function buildNameArray(structDef: ClassField[]): string[] {
  const ret: string[] = []
  for (const item of structDef) {
    ret[item.index] = item.name
  }
  return ret
}

function mergeDataAndStruct(
  data: any[][],
  structDef: ClassField[]
): Record<string, any>[] {
  const ret: Record<string, any>[] = []
  for (const line of data) {
    const v: Record<string, any> = {}
    const nameArray = buildNameArray(structDef)
    for (const [key, val] of Object.entries(line)) {
      const k = nameArray[Number(key)]
      if (k === undefined) continue
      v[k] = val
    }
    ret.push(v)
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
      const [tableName, [offset, size]] = Object.entries(this.#tree)[
        this.#tableId++
      ]
      console.debug(`Reading part: ${tableName} - expected size: ${size}`)
      const structDef = getClassProperties(tableName, this.#srcLines)
      if (structDef.length === 0) {
        console.warn(`No struct definition found for ${tableName}`)
      }
      fs.writeFileSync(
        `mm/${tableName}.json`,
        JSON.stringify(mergeDataAndStruct(data, structDef), null, 2)
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
