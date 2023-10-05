# Datasets

Datasets allow you to run a specific test multiple times with different data every time.

Datasets are usually helpful when testing a piece of code against varying values. For example, Testing the email validation function against different email formats.

You can define datasets using the `with` method. It accepts an array of values and passes each row to the test callback function as the second argument.

```ts
test('validate email', ({ assert }, email) => {
  assert.isTrue(validateEmail(email))
})
.with([
  'some+user@gmail.com',
  'some.user@gmail.com',
  'email@123.123.123.123'
])
```

The dataset array can have objects as well. Continuing with the validate email example, let's pass some valid and invalid email addresses as a dataset.

```ts
test('validate email', ({ assert }, row) => {
  assert.equal(validateEmail(row.email), row.result)
})
.with([
 {
   email: 'some+user@gmail.com',
   result: true,
 },
 {
   email: 'some.user@gmail.com',
   result: true,
 },
 {
   email: 'email@example.com (Joe Smith)',
   result: false,
 },
 {
   email: '@example.com',
   result: false,
 }
])
```

## Lazily generate datasets

You can compute the dataset lazily by passing a function to the `test.with` method. The function can be async and must return an array of values.

```ts
test('validate email', ({ assert }, email) => {
  assert.isTrue(validateEmail(email))
})
.with(async () => {
  return getEmailsToTest()
})
```

## TypeScript IntelliSense 

Using Japa in a TypeScript project will show you the compiler error when accessing the dataset row inside the test callback.

It happens because TypeScript cannot know about the second argument your test callback is trying to access.

```ts
test('validate email', ({ assert }, email) => {
  // TypeScript 🗣                  ˄ How do I know what is this?
})
```

Instead, you can move the test callback to the `run` method and call the `with` method before it.

```ts
test('validate email')
 .with([
    'some+user@gmail.com',
    'some.user@gmail.com',
    'email@123.123.123.123'
  ])
  .run(({ assert }, email) => {
    assert.isTrue(validateEmail(email))
  })
```

The above approach has a couple of benefits.

- TypeScript can properly infer the data type of the `with` method and use it to type-check the test callback.
- The test visually reads better. **with(dataset).run(thisFunction)**.

## Dynamic title for each test

You may use the interpolation syntax to reference values from the dataset within the test title. The interpolation syntax uses a single curly brace `{}` as a delimiter.

```ts
// highlight-start
test('validate email - "{email}"')
// highlight-end
  .with([
    {
      email: 'some+user@gmail.com',
      result: true,
    },
    {
      email: 'some.user@gmail.com',
      result: true,
    },
  ])
  .run(({ assert }, { email, result }) => {
    assert.equal(validateEmail(email), result)
  })
```

- You can access the array's current index using the special keyword `$i`. The index starts from 1 and not 0.

  ```ts
  test('{$i} validate email - "{email}"')
  ```

- If the dataset array contains literal values, you may access them using the special keyword `$self`.

  ```ts
  test('validate email - "{$self}"')
    .with([
      'some+user@gmail.com',
      'some.user@gmail.com',
      'email@123.123.123.123'
    ])
  ```
