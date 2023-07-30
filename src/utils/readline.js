export default function read() {
  return new Promise((resolve, reject) => {
    const buf = []
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
