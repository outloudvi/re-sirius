import decodeMsgpackResponse from "./decodeMsgpackResponse.js"
import hexToBuffer from "./hexToBuffer.js"
import readline from "./readline.js"
;(async () => {
  const text = await readline()
  console.log(decodeMsgpackResponse(hexToBuffer(text.toString("utf8"))))
})()
