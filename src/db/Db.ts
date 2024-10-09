import type { JsonObject } from "../utils/Json.js"

export type Id = `${string}/${string}`

export type Data = JsonObject

export type Metadata = {
  revision: string
  createdAt: number
  updatedAt: number
}

export interface Db {
  create(id: Id, data: Data): Promise<void>
  delete(id: Id, options: { revision: string }): Promise<void>
  metadata(id: Id): Promise<Metadata>
  getOrFail(id: Id): Promise<Data>
  get(id: Id): Promise<Data | undefined>
  has(id: Id): Promise<boolean>
  patch(id: Id, data: Data): Promise<Data>
  put(id: Id, data: Data): Promise<Data>
}
