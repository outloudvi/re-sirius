import { readFileSync } from "node:fs"

import aesDecrypt from "#/utils/aesDecrypt"
;(async () => {
  if (process.argv.length === 4) {
    const payloads = await aesDecrypt(
      readFileSync(process.argv[3]),
      Buffer.from(process.argv[2])
    )
    console.log(Buffer.from(payloads).toString("binary"))
  } else {
    console.log("aesDecrypt <aesKeyInAscii> <file>")
  }
})()
