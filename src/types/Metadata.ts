import { z, ZodType } from "zod"

export type Metadata = {
  "@path": string
  "@createdAt": number
  "@updatedAt": number
}

export const MetadataSchema: ZodType<Metadata> = z.object({
  "@path": z.string(),
  "@createdAt": z.number(),
  "@updatedAt": z.number(),
})
