import assert from "node:assert"
import { test } from "node:test"
import { slug } from "./slug.ts"

// prettier-ignore
test("slug", () => {
  assert.equal(slug("10:59"), '10:59')

  const target = "構造-the-constructivization-of-mathematics"

  assert.equal(slug("構造 / The constructivization of mathematics"), target)
  assert.equal(slug("[構造] / The constructivization of mathematics---"),target)
  assert.equal(slug("---[構造] / The constructivization of mathematics---"),target)
  assert.equal(slug("---「構造」 / The constructivization of mathematics---"),target)
  assert.equal(slug("---「構造」 / The constructivization of mathematics___"),target)
  assert.equal(slug("---「構造」 / The_constructivization_of_mathematics___"),target)
})
