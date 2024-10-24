import fs from "node:fs/promises"
import { join } from "path"
import type { Data, Db, Id } from "../db/index.js"
import { AlreadyExists } from "../errors/AlreadyExists.js"
import { NotFound } from "../errors/NotFound.js"
import type { Json, JsonObject } from "../utils/Json.js"
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

  private resolveDatasetPath(datasetName: string): string {
    return resolvePath(this.config.directory, datasetName)
  }

  private resolveDataPath(id: Id): string {
    const [datasetName, dataId] = id.split("/")
    return resolvePath(this.config.directory, join(datasetName, dataId))
  }

  private async writeData(id: Id, data: Data): Promise<void> {
    const path = join(this.resolveDataPath(id), "index.json")
    await writeJson(path, data)
  }

  private async readData(id: Id): Promise<Data> {
    const path = join(this.resolveDataPath(id), "index.json")
    return (await readJsonObject(path)) as Data
  }

  async create(id: Id, input: JsonObject): Promise<Data> {
    if (await this.has(id)) {
      throw new AlreadyExists(`Already exists, id: ${id}`)
    }

    const data = {
      ...input,
      "@id": id,
      "@createdAt": Date.now(),
      "@updatedAt": Date.now(),
    }

    await this.writeData(id, data)
    return data
  }

  async delete(id: Id): Promise<void> {
    await fs.rm(this.resolveDataPath(id), {
      recursive: true,
      force: true,
    })
  }

  async getOrFail(id: Id): Promise<Data> {
    try {
      return await this.readData(id)
    } catch (error) {
      if (isErrnoException(error) && error.code === "ENOENT") {
        throw new NotFound(`id: ${id}`)
      }

      throw error
    }
  }

  async get(id: Id): Promise<Data | undefined> {
    try {
      return await this.getOrFail(id)
    } catch (error) {
      if (error instanceof NotFound) {
        return undefined
      }

      throw error
    }
  }

  async has(id: Id): Promise<boolean> {
    const data = await this.get(id)
    if (data === undefined) {
      return false
    } else {
      return true
    }
  }

  async patch(id: Id, input: JsonObject): Promise<Data> {
    const found = await this.get(id)
    if (!found) {
      throw new NotFound(`Not found, id ${id}`)
    }

    const data = {
      ...objectMergeProperties(found, input),
      "@id": id,
      "@updatedAt": Date.now(),
      "@createdAt": found["@createdAt"],
    }

    await this.writeData(id, data)
    return data
  }

  async put(id: Id, input: JsonObject): Promise<Data> {
    const found = await this.get(id)

    const data = {
      ...input,
      "@id": id,
      "@updatedAt": Date.now(),
      "@createdAt": found ? found["@createdAt"] : Date.now(),
    }

    await this.writeData(id, data)
    return data
  }

  async *find(
    datasetName: string,
    options?: {
      properties: Record<string, Json>
    },
  ): AsyncIterable<Data> {
    try {
      const dir = await fs.opendir(this.resolveDatasetPath(datasetName), {
        bufferSize: 1024, // default: 32
      })

      for await (const dirEntry of dir) {
        if (!dirEntry.isDirectory()) continue

        const data = await this.get(`${datasetName}/${dirEntry.name}`)
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
