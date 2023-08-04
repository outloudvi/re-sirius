import { expect } from "chai"

import * as toBE from "./toBigEndian"

it("toU32BE", function () {
  expect(Buffer.from(toBE.toU32BE(0x12345678))).to.deep.eq(
    Buffer.from([0x12, 0x34, 0x56, 0x78])
  )
  expect(Buffer.from(toBE.toU32BE(0x12))).to.deep.eq(
    Buffer.from([0, 0, 0, 0x12])
  )
})

it("toU16BE", function () {
  expect(Buffer.from(toBE.toU16BE(0x1234))).to.deep.eq(
    Buffer.from([0x12, 0x34])
  )
  expect(Buffer.from(toBE.toU16BE(0x12))).to.deep.eq(Buffer.from([0, 0x12]))
})
