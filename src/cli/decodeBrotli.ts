import { readFileSync } from "node:fs"

import decodeBrotli from "#/utils/decodeBrotli"
;(async () => {
  if (process.argv.length === 3) {
    const payloads = await decodeBrotli(readFileSync(process.argv[2]))
    console.log(Buffer.from(payloads).toString("ascii"))
  } else {
    console.log("decodeBrotli <file>")
  }
})()
