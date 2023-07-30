export default function read(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buf: Buffer[] = []
    process.stdin.on("data", function (d) {
      buf.push(Buffer.from(d))
    })
    process.stdin.on("error", (e) => {
      reject(e)
    })
    process.stdin.on("end", function () {
      resolve(Buffer.concat(buf))
    })
  })
}
