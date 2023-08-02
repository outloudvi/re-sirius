import { expect } from "chai"
import convertHexLike from "./convertHexLike"

it("convertHexLike", function () {
  expect(
    convertHexLike(
      `
00000000  68 65 6c 6c 6f 2c 20 77  6f 72 6c 64 20 7c 20 48  |hello, world | H|
00000010  45 4c 4c 4f 57 4f 52 4c  44 20 21 21 21 21 21 21  |ELLOWORLD !!!!!!|
`
    )
  ).to.eq(
    `68 65 6c 6c 6f 2c 20 77  6f 72 6c 64 20 7c 20 48
45 4c 4c 4f 57 4f 52 4c  44 20 21 21 21 21 21 21`
  )

  expect(
    convertHexLike(
      `0000000000 68 65 6c 6c 6f 2c 20 77  6f 72 6c 64 20 7c 20 48   hello, world | H
0000000010 45 4c 4c 4f 57 4f 52 4c  44 20 21 21               ELLOWORLD !!`
    )
  ).to.eq(
    `68 65 6c 6c 6f 2c 20 77  6f 72 6c 64 20 7c 20 48
45 4c 4c 4f 57 4f 52 4c  44 20 21 21`
  )
})
