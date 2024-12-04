import fs from "node:fs"
import { resolve } from "node:path"
import { formatDateTime } from "../utils/formatDate.ts"
import { randomHexString } from "../utils/randomHexString.ts"
import { slug } from "../utils/slug.ts"
import { FiDb } from "./FiDb.ts"

const PREFIX = resolve(import.meta.dirname, "../../tmp/databases/")

export async function createTestFiDb(): Promise<FiDb> {
  const time = formatDateTime(Date.now())
  const basename = slug(`${time}-${randomHexString(4)}`)
  const directory = resolve(PREFIX, basename)
  await fs.promises.mkdir(directory, { recursive: true })
  return new FiDb({ directory: () => directory })
}
