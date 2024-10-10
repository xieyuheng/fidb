import fs from "node:fs/promises"
import { join } from "path"
import type { Data, Db, Id } from "../db/index.js"
import { AlreadyExists } from "../errors/AlreadyExists.js"
import { NotFound } from "../errors/NotFound.js"
import type { JsonObject } from "../utils/Json.js"
import { isErrnoException } from "../utils/node/isErrnoException.js"
import { readJsonObject } from "../utils/node/readJsonObject.js"
import { writeJson } from "../utils/node/writeJson.js"
import { resolvePath } from "./resolvePath.js"

export type FiDbConfig = {
  directory: string
}

export class FiDb implements Db {
  constructor(public config: FiDbConfig) {}

  private resolveIdPath(id: Id): string {
    const [datasetName, dataId] = id.split("/")
    return resolvePath(
      this.config.directory,
      join(datasetName, "datasets", dataId),
    )
  }

  private async writeData(id: Id, data: Data): Promise<void> {
    const path = join(this.resolveIdPath(id), "data.json")
    await writeJson(path, data)
  }

  private async readData(id: Id): Promise<Data> {
    const path = join(this.resolveIdPath(id), "data.json")
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
    await fs.rm(this.resolveIdPath(id), {
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
    throw new Error()
  }

  async put(id: Id, input: JsonObject): Promise<Data> {
    throw new Error()
  }
}
