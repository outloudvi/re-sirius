import * as fs from "node:fs"
import * as msgpack from "msgpack-lite"
import { ExtBuffer } from "msgpack-lite/lib/ext-buffer"

import lz4Decompress from "../utils/lz4Decompress"

function decompress(data: ExtBuffer) {
  if (data.type !== 0x63) {
    throw Error(`Invalid LZ4Block payload - type=${data.type}`)
  }
  // the first 5 bytes is a "int 32" indicating the decompressed size
  const lz4Payload = data.buffer.subarray(5)
  const decompressedPayload = lz4Decompress(lz4Payload)
  try {
    return msgpack.decode(decompressedPayload)
  } catch (e) {
    fs.writeFileSync("debug.bin", decompressedPayload)
    throw e
  }
}

class MasterReader {
  #tree: [string, [number, number]][] | null = null
  #tableId = 0

  init() {
    if (fs.existsSync("mm/")) {
      fs.rmSync("mm/", {
        recursive: true,
        force: true,
      })
    }
    fs.mkdirSync("mm/")
  }
  onData(d: any) {
    if (this.#tree === null) {
      // the first payload is the tree
      console.debug("Reading MM tree")
      this.#tree = d
      fs.writeFileSync("mm/__tree.json", JSON.stringify(d, null, 2))
    } else {
      const [tableName, [offset, size]] = Object.entries(this.#tree)[
        this.#tableId++
      ]
      console.debug(`Reading part: ${tableName} - expected size: ${size}`)
      const data = d instanceof ExtBuffer ? decompress(d) : d
      fs.writeFileSync(`mm/${tableName}.json`, JSON.stringify(data, null, 2))
    }
  }
}

;(async () => {
  const readStream = fs.createReadStream(process.argv[2])
  const decodeStream = msgpack.createDecodeStream()

  const mr = new MasterReader()
  mr.init()
  readStream.pipe(decodeStream).on("data", (x) => {
    mr.onData(x)
  })
})()
