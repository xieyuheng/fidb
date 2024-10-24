import type { JsonObject } from "../utils/Json.js"

export type Metadata = {
  "@path": string
  "@createdAt": number
  "@updatedAt": number
}

export type Data = JsonObject & Metadata

export interface Db {
  create(path: string, input: JsonObject): Promise<Data>
  delete(path: string): Promise<void>
  getOrFail(path: string): Promise<Data>
  get(path: string): Promise<Data | undefined>
  has(path: string): Promise<boolean>
  patch(path: string, input: JsonObject): Promise<Data>
  put(path: string, input: JsonObject): Promise<Data>
  find(
    prefix: string,
    options?: {
      properties: JsonObject
    },
  ): AsyncIterable<Data>
}
