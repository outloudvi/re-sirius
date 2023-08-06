import { readFileSync } from "node:fs"
import { inspect } from "node:util"

import decodePayload from "#/utils/decodePayload"
import hexToBuffer from "#/utils/hexToBuffer"
import readline from "#/utils/readline"
import convertHexLike from "#/utils/convertHexLike"
;(async () => {
  if (process.argv.length > 2) {
    const payloads = decodePayload(readFileSync(process.argv[2]))
    console.log(JSON.stringify(payloads, null, 2))
  } else {
    const text = await readline()
    const payloads = decodePayload(
      hexToBuffer(convertHexLike(text.toString("utf-8")))
    )
    console.log(JSON.stringify(payloads, null, 2))
  }
})()
