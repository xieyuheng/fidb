import ty, { Schema } from "@xieyuheng/ty"

export type Metadata = {
  "@path": string
  "@createdAt": number
  "@updatedAt": number
}

export const MetadataSchema: Schema<Metadata> = ty.object({
  "@path": ty.string(),
  "@createdAt": ty.number(),
  "@updatedAt": ty.number(),
})
