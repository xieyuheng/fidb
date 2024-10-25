import ty, { Schema } from "@xieyuheng/ty"
import type { JsonObject } from "../utils/Json.js"
import { MetadataSchema, type Metadata } from "./MetadataSchema.js"

export type Data = JsonObject & Metadata

export const DataSchema: Schema<Data> = ty.intersection(
  MetadataSchema,
  ty.dict(ty.any()),
)
