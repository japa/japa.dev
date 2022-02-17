# Underlying Test class

Tests created using the `test` method are instances of the [Test class](https://github.com/japa/core/tree/develop/src/Test/index.ts). You can invoke the available class methods to further configure the test.

In this guide, we will go through all the methods and properties available on the test class.

## skip

Mark the test as skipped. You can either pass a boolean to the `skip` method or a function that is lazily evaluated to find if the test should be skipped or not.

```ts
// skip the test
test('add two numbers', () => {
})
.skip(true)

// skip when `CI` env var exists
test('add two numbers', () => {
})
.skip(!!process.env.CI)

// Use a function to compute at the time of
// running the test
test('add two numbers', () => {
})
.skip(() => {
  return findIfShouldBeSkipped()
})
```

The 2nd optional argument is the reason for skipping the test.

```ts
test('add two numbers', () => {
})
.skip(true, 'Not running CI')
```

## fails

Mark test as a regression test. Regression tests are meant to fail.

A great example of a regression test is someone reporting a bug with a failing test, and once the bug has been fixed, you can remove the call to the `fails` method.

```ts
test('add two numbers', ({ assert }) => {
  assert.equal(add(2, 2), 4)
})
  .fails('add method should return 4, instead it returns 5')
```

## timeout

Define the `timeout` for the test. All tests timeout after the milliseconds are defined for [config.timeout](./runner-config.md#timeout-optional). However, you can configure the timeout at the test level as well.

```ts
// 6 seconds
test('add two numbers', () => {
})
.timeout(6000)

// disable timeout
test('add two numbers', () => {
})
.timeout(0)
```

## disableTimeout

A shorthand method to disable the timeout. It is the same as calling `timeout(0)`.

```ts
test('add two numbers', () => {
})
.disableTimeout()
```

## tags

Assign tags to a test. You can later use tags to filter and run only specific tests. [Learn more about tags](./filtering-tests.md#test-tags).

```ts
test('add two numbers', () => {
})
.tags(['@slow', '@network'])
```

The method accepts an optional strategy for defining tags. The strategy can be either `replace`, `append`, or `prepend`.

```ts
test('add two numbers', () => {
})
.tags(['@slow'])

// Append to existing tags
test('add two numbers', () => {
})
.tags(['@network'], 'append')

// Prepend to existing tags
test('add two numbers', () => {
})
.tags(['@network'], 'prepend')
```

## retry

Define the retry count for the test. Only after the mentioned retries will the test be marked as failed.

In the following example, the test will run four times. First is the original attempt, and then three retries before it is marked as failed.

```ts
test('add two numbers', () => {
})
.retry(3)
```

## waitForDone

You can run asynchronous operations inside the test implementation function using `async/await`. For example:

```ts
test('add two numbers', async () => {
  await someAsyncOperation()
})
```

However, you cannot use `async/await` in some situations, especially with **streams and events**. In those cases, you can tell the test to wait until the `done` method is called.

In the following example, the test will wait until the `done` method is called explicitly.

:::warn
The test will timeout if the `done` method is never called.
:::

```ts
test('add two numbers', async (ctx, done) => {
  emitter.on('someEvent', () => {
    done()
  })
})
.waitForDone()
```

You can also pass an error object to the `done` method to mark the test as failed.

```ts
test('add two numbers', (ctx, done) => {
  stream.on('error', (error) => done(error))
})
.waitForDone()
```

## pin

Pin the test. When one or more tests are pinned, we will execute only those tests and skip all others. [Learn more about pinned tests](./filtering-tests.md#pinning-tests).

```ts
test('add two numbers', () => {
})
.pin()
```

## with

Define the dataset for the test. The dataset must be an array, and we will execute the test for each item in the array. [Learn more about datasets](./datasets.md).

:::note
We recommend using the `run` method instead of passing the callback as the 2nd argument. 

The `run` method called after the `with` method has added benefit of type safety in TypeScript projects.
:::

```ts
test('validate email')
  .with(['virk@adonisjs.com', 'foo@bar.com'])
  .run(async (ctx, email) => {
    // executed for each email    
  })
```

You can fetch the dataset lazily by defining a function.

```ts
async function getTestEmails () {
  return ['virk@adonisjs.com', 'foo@bar.com'] 
}

test('validate email')
  .with(getTestEmails)
  .run(async (ctx, email) => {
    // executed for each email    
  })
```

## setup

Define the setup hook for the test. [Learn more about hooks]().

```ts
test('add two numbers', () => {
})
.setup(async () => {
  // executed before the test
})
```

## teardown

Define the teardown hook for the test. [Learn more about hooks](./lifecycle-hooks.md).

```ts
test('add two numbers', () => {
})
.teardown(async () => {
  // executed after the test
})
```

## options

A reference to the properties defined on the test. You can access the test instance within the test callback and hooks using `ctx.test`.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.test.options)
})

// returns
{
  title: string
  tags: string[]
  timeout: number
  meta: {}
  waitsForDone?: boolean
  executor?: TestExecutor<any, any>
  isTodo?: boolean
  isSkipped?: boolean
  isFailing?: boolean
  skipReason?: string
  failReason?: string
  retries?: number
}
```

## dataset

Reference to the test dataset. This property is defined when the `test.execute` method is called.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.test.dataset)
})
```

## context

Reference to the test context.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.test.context === ctx)
})
```

## Extending Test class

The Test class is extensible by nature. You can make use of the Macros and Getters to add custom properties to it.

:::note
You can write the code for extending the Test class within the `bin/test.js` file, or create a new file and import it inside the `bin/test.js` file.
:::

### About getters and macros

Getters and macros expose the API to add custom properties to the test class.

A **getter** is a function that is evaluated lazily when accessing the property.

```ts
import { Test } from '@japa/runner'

Test.getter('foo', function () {
  return { foo: true }
})

console.log(test('test title').foo)
// returns { foo: true }
```

Whereas **macros** can be both functions and literal values. You can access the test instance using `this`.

```ts
Test.macro('recordTime', function () {
  this.options.createdAt = new DateTime()
})

test('test title').recordTime()
```

### Usage with TypeScript
Since getters and macros are added at runtime, you must inform the TypeScript compiler about these new properties separately. 

You can make use of [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to define these properties at a static level.

Create a new file, `japaTypes.ts`, and paste the following code inside it.

```ts
declare module '@japa/runner' {
    
  // Interface must match the class name
  interface Test {
    throws(error?: ErrorConstructor, message?: string): this
  }

}
```
