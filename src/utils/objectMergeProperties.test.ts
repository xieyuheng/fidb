import assert from "node:assert"
import { test } from "node:test"
import { objectMergeProperties } from "./objectMergeProperties.js"

test("objectMergeProperties", () => {
  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: 1,
        y: 2,
      },
      {
        x: 1,
      },
    ),
    {
      x: 1,
      y: 2,
    },
  )

  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: 1,
        y: 2,
      },
      {
        x: 2,
      },
    ),
    {
      x: 2,
      y: 2,
    },
  )

  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: { x: 1 },
        y: 2,
      },
      {
        x: { x: 1 },
      },
    ),
    {
      x: { x: 1 },
      y: 2,
    },
  )

  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: { x: 1 },
        y: 2,
      },
      {
        x: { x: 2 },
      },
    ),
    {
      x: { x: 2 },
      y: 2,
    },
  )

  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: { x: [1] },
        y: 2,
      },
      {
        x: { x: [1] },
      },
    ),
    {
      x: { x: [1] },
      y: 2,
    },
  )

  assert.deepStrictEqual(
    objectMergeProperties(
      {
        x: { x: [1] },
        y: 2,
      },
      {
        x: { x: [2] },
      },
    ),
    {
      x: { x: [2] },
      y: 2,
    },
  )
})
