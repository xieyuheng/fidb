import fs from "node:fs/promises"
import { resolve } from "node:path"
import { formatDateTime } from "../utils/formatDate.js"
import { randomHexString } from "../utils/randomHexString.js"
import { slug } from "../utils/slug.js"
import { FiDb } from "./FiDb.js"

const PREFIX = resolve(import.meta.dirname, "../../tmp/databases/")

export async function createTestFiDb(): Promise<FiDb> {
  const time = formatDateTime(Date.now())
  const basename = slug(`${time}-${randomHexString(4)}`)
  const directory = resolve(PREFIX, basename)
  await fs.mkdir(directory, { recursive: true })
  const db = new FiDb({ directory })
  return db
}
