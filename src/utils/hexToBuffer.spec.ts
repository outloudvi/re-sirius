import { expect } from "chai"
import hexToBuffer from "./hexToBuffer.js"

it("hexToBuffer", function () {
  expect(hexToBuffer("0a 00 0b 0c").toString("hex")).to.eq("0a000b0c")
  expect(
    hexToBuffer(`
  
  0a 0b 0c
  `).toString("hex")
  ).to.eq("0a0b0c")
})
