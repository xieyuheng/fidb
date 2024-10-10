import { type JsonObject, isJsonArray, isJsonObject } from "./Json.js"

export function objectMatchProperties(
  target: JsonObject,
  properties: JsonObject,
): boolean {
  for (const [key, value] of Object.entries(properties)) {
    const targetValue = target[key]
    if (isJsonObject(value)) {
      if (!isJsonObject(targetValue)) return false
      if (!objectMatchProperties(targetValue, value)) return false
    } else if (isJsonArray(value)) {
      if (!isJsonArray(targetValue)) return false
      if (targetValue.length !== value.length) return false
      for (const [index, element] of value.entries()) {
        const targetElement = targetValue[index]
        if (targetElement !== element) return false
      }
    } else {
      if (targetValue !== value) return false
    }
  }

  return true
}
