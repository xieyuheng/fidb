import { type JsonObject, isJsonObject } from "./Json.ts"

export function objectMergeProperties(
  target: JsonObject,
  properties: JsonObject,
): JsonObject {
  const result: JsonObject = {}
  for (const key of [...Object.keys(target), ...Object.keys(properties)]) {
    const targetValue = target[key]
    const propertyValue = properties[key]

    if (targetValue === undefined && propertyValue !== undefined) {
      result[key] = propertyValue
    } else if (targetValue !== undefined && propertyValue === undefined) {
      result[key] = targetValue
    } else if (targetValue !== undefined && propertyValue !== undefined) {
      if (isJsonObject(targetValue) && isJsonObject(propertyValue)) {
        result[key] = objectMergeProperties(targetValue, propertyValue)
      } else {
        result[key] = propertyValue
      }
    }
  }

  return result
}
