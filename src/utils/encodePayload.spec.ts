import { expect } from "chai"
import encodePayload from "./encodePayload"
import { CompressMethod } from "./types"

it("encodePayload", function () {
  expect(encodePayload(["Rest"], CompressMethod.Lz4BlockArray)).to.deep.eq(
    Buffer.from([
      146, 212, 98, 6, 198, 0, 0, 0, 7, 96, 145, 164, 82, 101, 115, 116,
    ])
  )
})
