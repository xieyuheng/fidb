import assert from "node:assert"
import { test } from "node:test"
import { createTestFiDb } from "./createTestFiDb.js"

test("fidb / crud", async () => {
  const db = await createTestFiDb()
  console.log("hi")
  assert(true)
})
