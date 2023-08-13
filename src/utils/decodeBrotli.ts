import * as zlib from "node:zlib"

const decodeBrotli = zlib.brotliDecompressSync

export default decodeBrotli
