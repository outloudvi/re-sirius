import decodeMsgpackResponse from "../utils/decodeMsgpackResponse"
import hexToBuffer from "../utils/hexToBuffer"
import readline from "../utils/readline"
;(async () => {
  const text = await readline()
  console.log(decodeMsgpackResponse(hexToBuffer(text.toString("utf8"))))
})()
