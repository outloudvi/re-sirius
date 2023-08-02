import { readFileSync } from "node:fs"

import decodePayload from "#/utils/decodePayload"
import hexToBuffer from "#/utils/hexToBuffer"
import readline from "#/utils/readline"
import convertHexLike from "#/utils/convertHexLike"
;(async () => {
  if (process.argv.length > 2) {
    console.log(decodePayload(readFileSync(process.argv[2])))
    return
  } else {
    const text = await readline()
    console.log(
      decodePayload(hexToBuffer(convertHexLike(text.toString("utf-8"))))
    )
  }
})()
