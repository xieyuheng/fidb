import assert from "node:assert"
import { test } from "node:test"
import { objectMatchProperties } from "../utils/objectMatchProperties.js"
import { createTestFiDb } from "./createTestFiDb.js"

test("fidb / crud", async () => {
  const db = await createTestFiDb()

  assert.deepStrictEqual(await db.has("users/xieyuheng"), false)
  assert.deepStrictEqual(await db.get("users/xieyuheng"), undefined)

  await db.create("users/xieyuheng", {
    name: "Xie Yuheng",
  })

  assert(await db.has("users/xieyuheng"))
  assert(
    objectMatchProperties(await db.getOrFail("users/xieyuheng"), {
      name: "Xie Yuheng",
    }),
  )

  await db.delete("users/xieyuheng")
  assert((await db.get("users/xieyuheng")) === undefined)

  await db.put("users/xieyuheng", {
    name: "谢宇恒",
  })

  assert(
    objectMatchProperties(await db.getOrFail("users/xieyuheng"), {
      name: "谢宇恒",
    }),
  )

  await db.patch("users/xieyuheng", {
    age: 100,
  })

  assert(
    objectMatchProperties(await db.getOrFail("users/xieyuheng"), {
      name: "谢宇恒",
      age: 100,
    }),
  )

  await db.put("users/xieyuheng", {
    name: "谢宇恒",
  })

  assert(
    objectMatchProperties(await db.getOrFail("users/xieyuheng"), {
      name: "谢宇恒",
      age: undefined,
    }),
  )

  await db.put("users/xyh", {
    name: "XYH",
    age: 200,
  })

  assert((await Array.fromAsync(db.all("users"))).length === 2)
  assert((await Array.fromAsync(db.all("users", {
    properties: { age: 200 }
  }))).length === 1)
})
