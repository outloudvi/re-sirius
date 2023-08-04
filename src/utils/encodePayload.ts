import { encode } from "msgpack-lite"
import { CompressMethod } from "#/utils/types"
import { compress } from "./lz4"
import { toU32BE, toU16BE } from "./toBigEndian"

export default function encodePayload(
  payload: any[],
  compressMethod: CompressMethod
): Buffer {
  const encodedBuf = encode(payload)
  switch (compressMethod) {
    case CompressMethod.Lz4BlockArray: {
      const size = encodedBuf.length
      const lz4CompressedBuf = compress(encodedBuf)

      // I wanted to explain this here but it's too complicated...
      // Please read code from Cysharp/MagicOnion and msgpack spec:
      // - https://github.com/Cysharp/MagicOnion/blob/8a38844a9107406b4fbfa7faa880aeed100e93b5/src/MagicOnion.Client.Unity/Assets/Scripts/MessagePack/MessagePackSerializer.cs#L472
      // - https://github.com/msgpack/msgpack/blob/master/spec.md
      const buf = Buffer.concat([
        Buffer.from([0x92]), // array of 2
        ...(size <= 256
          ? [Buffer.from([0xd4, 0x62, size])]
          : [
              Buffer.from([
                0xc7,
                Math.ceil(size.toString(16).length / 2) + 1,
                0x62,
                0xcd, // an uint16
              ]),
              Buffer.from(toU16BE(size)), // the actual size
            ]), // Item #1: type=0x62, size
        Buffer.from([0xc6]), // Item #2: type=0xc6,
        Buffer.from(toU32BE(lz4CompressedBuf.length)), // size of lz4 compressed data,
        lz4CompressedBuf, // buf
      ])

      return buf
    }
  }
}
