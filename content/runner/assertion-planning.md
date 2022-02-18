---
title: Assertion planning
description: Plan assertions to eliminate false-positive tests
ogImage: assertion-planning.jpeg
---

# Assertion planning
Assertion planning is a technique to eliminate tests with **false-positive** outcomes.

We expect the `someOperation` method to raise an exception in the following test. However, our test will still be green if no exception is ever raised. 

This is a classic case of a **false-positive** test, as the assertion block is never executed.

```ts
test('a false-positive test', async ({ assert }) => {
  try {
    await someOperation()
  } catch (error) {
    assert.equal(error.message, 'The expected error message')
  }
})
```

To prevent this behavior, you can use **assertion planning**. In the following example, we tell the assert module to expect exactly one assertion (using the `assert.plan(1)` method) by the end of the test.

If no assertions were made (meaning, the `someOperation` method didn't raise an exception), mark the test as failed.

```ts
test('a false-positive test', async ({ assert }) => {
  // highlight-start
  assert.plan(1)
  // highlight-end

  try {
    await someOperation()
  } catch (error) {
    assert.equal(error.message, 'The expected error message')
  }
})
```

## Assertion planning with `@japa/assert`
The `@japa/assert` plugin allows for assertion planning using the `assert.plan` method.

```ts
test('a false-positive test', async ({ assert }) => {
  assert.plan(1)

  try {
    await someOperation()
  } catch (error) {
    assert.equal(error.message, 'The expected error message')
  }
})
```

If fewer or more assertions are made, then it will make the test fail with the following error message.

![](https://res.cloudinary.com/adonis-js/image/upload/v1645072583/japa/chai-assertion-planning_cn8hps.png)

## Assertion planning with `@japa/expect`
The `@japa/expect` plugin uses the Jest expect [expect.assertions](https://jestjs.io/docs/expect#expectassertionsnumber) method.

```ts
test('a false-positive test', async ({ expect }) => {
  expect.assertions(1)

  try {
    await someOperation()
  } catch (error) {
    expect(error.message).toEqual('The expected error message')
  }
})
```

If fewer or more assertions are made, then it will make the test fail with the following error message.

![](https://res.cloudinary.com/adonis-js/image/upload/v1645072584/japa/expect-assertion-planning_kzelvc.png)
