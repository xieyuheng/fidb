import { normalize, resolve } from "node:path"

export function resolvePath(directory: string, path: string): string {
  const who = "resolvePath"

  const resolvedPath = normalize(resolve(directory, path))

  if (!resolvedPath.startsWith(directory)) {
    throw new Error(
      `[${who}] Can not access path: ${path}, which is outside of database path`,
    )
  }

  return resolvedPath
}
