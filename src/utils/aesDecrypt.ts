import { subtle } from "node:crypto"

export default async function aesDecrypt(
  bodyWithIv: Buffer,
  keyBuf: Buffer
): Promise<ArrayBuffer> {
  const iv = bodyWithIv.subarray(0, 16)
  const data = bodyWithIv.subarray(16)
  const cryptoKey = await subtle.importKey("raw", keyBuf, "AES-CBC", true, [
    "encrypt",
    "decrypt",
  ])
  return subtle.decrypt(
    {
      iv,
      name: "AES-CBC",
    },
    cryptoKey,
    data
  )
}
