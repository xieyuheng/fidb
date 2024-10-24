import fs from "node:fs/promises"
import { join } from "path"
import type { Data, Db } from "../db/index.js"
import { AlreadyExists } from "../errors/AlreadyExists.js"
import { NotFound } from "../errors/NotFound.js"
import type { JsonObject } from "../utils/Json.js"
import { isErrnoException } from "../utils/node/isErrnoException.js"
import { readJsonObject } from "../utils/node/readJsonObject.js"
import { writeJson } from "../utils/node/writeJson.js"
import { objectMatchProperties } from "../utils/objectMatchProperties.js"
import { objectMergeProperties } from "../utils/objectMergeProperties.js"
import { resolvePath } from "./resolvePath.js"

export type FiDbConfig = {
  directory: string
}

export class FiDb implements Db {
  constructor(public config: FiDbConfig) {}

  private resolve(path: string): string {
    return resolvePath(this.config.directory, path)
  }

  private async writeData(path: string, data: Data): Promise<void> {
    await writeJson(this.resolve(join(path, "index.json")), data)
  }

  private async readData(path: string): Promise<Data> {
    return (await readJsonObject(
      this.resolve(join(path, "index.json")),
    )) as Data
  }

  async create(path: string, input: JsonObject): Promise<Data> {
    if (await this.has(path)) {
      throw new AlreadyExists(`Already exists, path: ${path}`)
    }

    const data = {
      ...input,
      "@path": path,
      "@createdAt": Date.now(),
      "@updatedAt": Date.now(),
    }

    await this.writeData(path, data)
    return data
  }

  async delete(path: string): Promise<void> {
    await fs.rm(this.resolve(path), {
      recursive: true,
      force: true,
    })
  }

  async getOrFail(path: string): Promise<Data> {
    try {
      return await this.readData(path)
    } catch (error) {
      if (isErrnoException(error) && error.code === "ENOENT") {
        throw new NotFound(`path: ${path}`)
      }

      throw error
    }
  }

  async get(path: string): Promise<Data | undefined> {
    try {
      return await this.getOrFail(path)
    } catch (error) {
      if (error instanceof NotFound) {
        return undefined
      }

      throw error
    }
  }

  async has(path: string): Promise<boolean> {
    const data = await this.get(path)
    if (data === undefined) {
      return false
    } else {
      return true
    }
  }

  async patch(path: string, input: JsonObject): Promise<Data> {
    const found = await this.get(path)
    if (!found) {
      throw new NotFound(`Not found, id ${path}`)
    }

    const data = {
      ...objectMergeProperties(found, input),
      "@path": path,
      "@updatedAt": Date.now(),
      "@createdAt": found["@createdAt"],
    }

    await this.writeData(path, data)
    return data
  }

  async put(path: string, input: JsonObject): Promise<Data> {
    const found = await this.get(path)

    const data = {
      ...input,
      "@path": path,
      "@updatedAt": Date.now(),
      "@createdAt": found ? found["@createdAt"] : Date.now(),
    }

    await this.writeData(path, data)
    return data
  }

  async *find(
    prefix: string,
    options?: {
      properties: JsonObject
    },
  ): AsyncIterable<Data> {
    try {
      const dir = await fs.opendirfor

      (this.resolve(prefix), {
        bufferSize: 1024, // default: 32
      }) await (const dirEntry of dir) {
        if (!dirEntry.isDirectory()) continue

        const path = `${prefix}/${dirEntry.name}`
        const data = await this.get(path)

        if (
          data !== undefined &&
          objectMatchProperties(data, options?.properties || {})
        ) {
          yield data
        }
      }
    } catch (error) {
      if (!(isErrnoException(error) && error.code === "ENOENT")) {
        throw error
      }
    }
  }
}
