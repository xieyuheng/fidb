import assert from "node:assert"
import { test } from "node:test"
import { createTestFiDb } from "./createTestFiDb.js"

test("fidb / crud", async () => {
  const db = await createTestFiDb()

  const data = await db.create("users/xieyuheng", {
    name: "Xie Yuheng",
  })

  assert.deepStrictEqual(data, await db.get("users/xieyuheng"))
})
