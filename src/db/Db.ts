import type { Json, JsonObject } from "../utils/Json.js"

export type Id = `${string}/${string}`

export type Metadata = {
  "@id": Id
  "@createdAt": number
  "@updatedAt": number
}

export type Data = JsonObject & Metadata

export interface Db {
  create(id: Id, input: JsonObject): Promise<Data>
  delete(id: Id): Promise<void>
  getOrFail(id: Id): Promise<Data>
  get(id: Id): Promise<Data | undefined>
  has(id: Id): Promise<boolean>
  patch(id: Id, input: JsonObject): Promise<Data>
  put(id: Id, input: JsonObject): Promise<Data>
  find(
    datasetName: string,
    options?: { properties: Record<string, Json> },
  ): AsyncIterable<Data>
}
