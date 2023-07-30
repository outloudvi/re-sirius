import decodeMsgpackResponse from "./decodeMsgpackResponse"
import hexToBuffer from "./hexToBuffer"
import readline from "./readline"
;(async () => {
  const text = await readline()
  console.log(decodeMsgpackResponse(hexToBuffer(text.toString("utf8"))))
})()
