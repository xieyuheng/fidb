import assert from "node:assert"
import { test } from "node:test"
import { objectMatchProperties } from "./objectMatchProperties.ts"

test("objectMatchProperties", () => {
  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: 1,
        y: 2,
      },
      {
        x: 1,
      },
    ),
    true,
  )

  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: 1,
        y: 2,
      },
      {
        x: 2,
      },
    ),
    false,
  )

  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: { x: 1 },
        y: 2,
      },
      {
        x: { x: 1 },
      },
    ),
    true,
  )

  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: { x: 1 },
        y: 2,
      },
      {
        x: { x: 2 },
      },
    ),
    false,
  )

  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: { x: [1] },
        y: 2,
      },
      {
        x: { x: [1] },
      },
    ),
    true,
  )

  assert.deepStrictEqual(
    objectMatchProperties(
      {
        x: { x: [1] },
        y: 2,
      },
      {
        x: { x: [1, 2] },
      },
    ),
    false,
  )
})
