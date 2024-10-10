import assert from "node:assert"
import { test } from "node:test"
import { createTestFiDb } from "./createTestFiDb.js"

test("fidb / crud", async () => {
  const db = await createTestFiDb()

  assert.deepStrictEqual(await db.get("users/xieyuheng"), undefined)

  const data = await db.create("users/xieyuheng", {
    name: "Xie Yuheng",
  })

  assert.deepStrictEqual(await db.get("users/xieyuheng"), data)

  await db.delete("users/xieyuheng")

  assert.deepStrictEqual(await db.get("users/xieyuheng"), undefined)
})
