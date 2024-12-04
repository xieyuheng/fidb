import fs from "node:fs"
import { isJsonObject, type JsonObject } from "../Json.ts"

export async function readJsonObject(path: string): Promise<JsonObject> {
  const who = "readJsonObject"

  const text = await fs.promises.readFile(path, "utf-8")

  try {
    const json = JSON.parse(text)
    if (!isJsonObject(json)) {
      throw new Error(`expect JsonObject`)
    }

    return json
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = `[${who}] path: ${path}, text: ${text}`
      error.message += "\n"
      error.message += message
    }

    throw error
  }
}
