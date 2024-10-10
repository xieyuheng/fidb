import { join } from "path"
import type { Data, Db, Id } from "../db/index.js"
import type { JsonObject } from "../utils/Json.js"
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
    await writeJson(join(this.resolveIdPath(id), "data.json"), data)
  }

  async create(id: Id, input: JsonObject): Promise<Data> {
    if (await this.has(id)) {
      throw new Error(`Already exists, id: ${id}`)
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
    throw new Error()
  }

  async getOrFail(id: Id): Promise<Data> {
    throw new Error()
  }

  async get(id: Id): Promise<Data | undefined> {
    throw new Error()
  }

  async has(id: Id): Promise<boolean> {
    throw new Error()
  }

  async patch(id: Id, input: JsonObject): Promise<Data> {
    throw new Error()
  }

  async put(id: Id, input: JsonObject): Promise<Data> {
    throw new Error()
  }
}
