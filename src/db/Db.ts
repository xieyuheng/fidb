import type { JsonObject } from "../utils/Json.js"

export interface Db {
  create(id: string, data: JsonObject): Promise<void>
  delete(id: string, options: { revision: string }): Promise<void>
  getOrFail(id: string): Promise<JsonObject>
  get(id: string): Promise<JsonObject | undefined>
  has(id: string): Promise<boolean>
  patch(id: string, data: JsonObject): Promise<JsonObject>
  put(id: string, data: JsonObject): Promise<JsonObject>
}
