import assert from "node:assert"
import { test } from "node:test"
import { slug } from "./slug.js"

// prettier-ignore
test("slug", () => {
  const target = "構造-the-constructivization-of-mathematics"

  assert.equal(slug("構造 / The constructivization of mathematics"), target)
  assert.equal(slug("[構造] / The constructivization of mathematics---"),target)
  assert.equal(slug("---[構造] / The constructivization of mathematics---"),target)
  assert.equal(slug("---「構造」 / The constructivization of mathematics---"),target)
  assert.equal(slug("---「構造」 / The constructivization of mathematics___"),target)
  assert.equal(slug("---「構造」 / The_constructivization_of_mathematics___"),target)
})
