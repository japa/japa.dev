# Exceptions

We all write tests that deal with exceptions and promise rejections. For example:

- Assert, a call to function `foo` throws an exception.
- Assert, the database insert statement for a duplicate value rejects the promise with a `Unique constraint` exception.

Usually, you will wrap these function calls inside a `try/catch` statement and write assertions for the `error` object. 

```ts
test('validate email format', ({ assert }) => {
  try {
    validateEmail('foo')
  } catch (error) {
    assert.equal(error.message, '"foo" is not a valid email address')
  }
})
```

```ts
test('do not insert duplicate emails', ({ assert }) => {
  await createUser({ email: 'foo@bar.com' })

  try {
    await createUser({ email: 'foo@bar.com' })
  } catch (error) {
    assert.matches(error.message, /Unique constraint/)
  }
})
```

There are two problems with the `try/catch` statement.

- You will get a **"false positive"** test if the code inside the try block never raises an exception.
- The `try/catch` statement adds visual noise to your tests, especially when writing nested statements.

## Using dedicated assertion methods

Both the [assert](../plugins/assert.md) and the [expect](../plugins/expect.md) plugins of Japa have dedicated methods to assert a function call throws an exception.

### assert.throws

The `assert.throws` method accepts a function as the first parameter and the error message you expect as the second parameter.

This method only works with synchronous function calls.

```ts
test('validate email format', ({ assert }) => {
  assert.throws(
    () => validateEmail('foo'),
    '"foo" is not a valid email address'
  )
})
```

### assert.rejects

Similar to the `assert.throws`, the `assert.rejects` method also accepts a function and the error message for assertion. However, in this case, the callback function must return a Promise.

```ts
test('do not insert duplicate emails', ({ assert }) => {
  await createUser({ email: 'foo@bar.com' })
  
  await assert.rejects(
    async () => createUser({ email: 'foo@bar.com' }),
    /Unique constraint/ 
  )
})
```

### expect.toThrow

The `expect.toThrow` method accepts a callback function and the error message for assertion. The callback function should be synchronous in nature.

```ts
test('validate email format', ({ expect }) => {
  expect(() => validateEmail('foo'))
    .toThrow('"foo" is not a valid email address')
})
```

### expect.rejects

The `expect.rejects` matcher accepts the promise as the first parameter and allows you to chain other matchers like `toThrow` or `toEqual`.

```ts
test('do not insert duplicate emails', ({ expect }) => {
  await createUser({ email: 'foo@bar.com' })
  
  await expect(createUser({ email: 'foo@bar.com' }))
    .rejects
    .toThrow(/Unique constraint/)
})
```

## High order assertion

An alternative API (independent of the assertion library) is to expect a test to throw an exception and write an assertion directly on the `test` using the `test.throws` method.

Let's re-write the above two examples with a high-order assertion.

```ts
test('validate email format', () => {
  validateEmail('foo')
})
 .throws('"foo" is not a valid email address')
```

```ts
test('do not insert duplicate emails', () => {
  await createUser({ email: 'foo@bar.com' })
  
  /**
   * The second call will throw an exception, and
   * there is no need to handle it within the test
   * callback
   */
  await createUser({ email: 'foo@bar.com' })
})
 .throws(/Unique constraint/)
```
