import { z, ZodType } from "zod"
import type { JsonObject } from "../utils/Json.ts"
import { MetadataSchema, type Metadata } from "./Metadata.ts"

export type Data = JsonObject & Metadata

export const DataSchema: ZodType<Data> = z.intersection(
  MetadataSchema,
  z.record(z.string(), z.any()),
)
