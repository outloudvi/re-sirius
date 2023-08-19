## CLI

### aesDecrypt.ts

``` sh
npm run cli src/cli/aesDecrypt.ts <aesKeyInAscii> <file>
# e.g. npm run cli src/cli/aesDecrypt.ts HUQglhF4jYvlUjYt9SIjeRZnX4_PC7YI response.bin
```

### decodePayload.ts

``` sh
npm run cli src/cli/decodePayload.ts <payload> # or
cat <payload-file> | npm run cli src/cli/decodePayload.ts
# e.g. cat response.bin | npm run cli src/cli/decodePayload.ts
```


### masterReader.ts

``` sh
npm run cli src/cli/masterReader.ts <masterBlob> <dump-cs-path>
# e.g. npm run cli src/cli/masterReader.ts master.bin ../dump.cs
```