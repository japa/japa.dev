# Assertion planning
Assertion planning is a technique to eliminate tests with **false-positive** outcome.

In the following test, we are expecting the `someOperation` method to raise an exception. However, our test will be green if no exception is ever raised. 

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

To prevent this behavior, you can make use of **assertion planning**. Now, in the following example, we are telling the assert module to expect exactly one assertion (using `assert.plan(1)` method) by the end of the test.

If no assertions were made (meaning, the `someOperation` method didn't raise any exception), then mark the test as failed.

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

If less or more assertions are made, then it will make the test fail with the following error message.

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

If less or more assertions are made, then it will make the test fail with the following error message.

![](https://res.cloudinary.com/adonis-js/image/upload/v1645072584/japa/expect-assertion-planning_kzelvc.png)
