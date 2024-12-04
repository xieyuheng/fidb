import fs from "node:fs"
import { join } from "path"
import type { Db } from "../db/index.ts"
import { DataAlreadyExists } from "../errors/DataAlreadyExists.ts"
import { DataNotFound } from "../errors/DataNotFound.ts"
import type { Data } from "../types/index.ts"
import type { JsonObject } from "../utils/Json.ts"
import { isErrnoException } from "../utils/node/isErrnoException.ts"
import { readJsonObject } from "../utils/node/readJsonObject.ts"
import { writeJson } from "../utils/node/writeJson.ts"
import { objectMatchProperties } from "../utils/objectMatchProperties.ts"
import { objectMergeProperties } from "../utils/objectMergeProperties.ts"
import { resolvePath } from "./resolvePath.ts"

export type FiDbConfig = {
  directory: () => string
}

export class FiDb implements Db {
  constructor(public config: FiDbConfig) {}

  resolve(path: string): string {
    return resolvePath(this.config.directory(), path)
  }

  private async writeData(path: string, data: Data): Promise<void> {
    await writeJson(this.resolve(join(path, "index.tson")), data)
  }

  private async readData(path: string): Promise<Data> {
    return (await readJsonObject(
      this.resolve(join(path, "index.tson")),
    )) as Data
  }

  async create(path: string, input: JsonObject): Promise<Data> {
    if (await this.has(path)) {
      throw new DataAlreadyExists(`Already exists, path: ${path}`)
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
    await fs.promises.rm(this.resolve(path), {
      recursive: true,
      force: true,
    })
  }

  async getOrFail(path: string): Promise<Data> {
    try {
      return await this.readData(path)
    } catch (error) {
      if (isErrnoException(error) && error.code === "ENOENT") {
        throw new DataNotFound(`path: ${path}`)
      }

      throw error
    }
  }

  async get(path: string): Promise<Data | undefined> {
    try {
      return await this.getOrFail(path)
    } catch (error) {
      if (error instanceof DataNotFound) {
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
      throw new DataNotFound(`Not found, id ${path}`)
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
      const dir = await fs.promises.opendir(this.resolve(prefix), {
        bufferSize: 1024, // default: 32
      })

      for await (const dirEntry of dir) {
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
