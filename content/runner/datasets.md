---
title: Datasets
description: Run a specific test multiple times with different data every time
ogImage: datasets.jpeg
---

# Datasets

Datasets allow you to run a specific test multiple times with different data every time.

Datasets are usually helpful when testing a piece of code against varying values. For example: Testing the email validation function against different email formats.

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
  assert.equal(validateEmail(row.email), row.outcome)
})
.with([
 {
   email: 'some+user@gmail.com',
   outcome: true,
 },
 {
   email: 'some.user@gmail.com',
   outcome: true,
 },
 {
   email: 'email@example.com (Joe Smith)',
   outcome: false,
 },
 {
   email: '@example.com',
   outcome: false,
 }
])
```

## Lazily generate datasets

You may wish to fetch datasets asynchronously from a file or maybe from a database. In that case, you can provide a function that returns an array.

```ts
test('validate email', ({ assert }, email) => {
  assert.isTrue(validateEmail(email))
})
.with(async () => {
  return getEmailsToTest()
})
```

## TypeScript intellisense 

Using Japa in a TypeScript project will show you the compiler error when accessing the dataset row inside the test callback.

It happens because TypeScript has no way to know about the second argument your test callback is trying to access.

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
