# Test class

Tests created using the `test` method are instances of the [Test class](https://github.com/japa/runner/blob/develop/modules/core/main.ts#L57). You can invoke the following available class methods to configure the test further.

In this guide, we will go through all the methods and properties available on the test class.

## skip
Mark the test as skipped. You can either pass a boolean to the `skip` method or a function that is lazily evaluated to determine whether the test should be skipped.

```ts
// Skip the test
test('add two numbers', () => {
})
.skip(true)
```

```ts
// Skip conditionally
test('add two numbers', () => {
})
.skip(!!process.env.CI)
```

```ts
// Skip lazily
test('add two numbers', () => {
})
.skip(() => {
  return findIfShouldBeSkipped()
})
```

You can also define the reason for skipping the test as follows.

```ts
test('add two numbers', () => {
})
.skip(true, 'Cannot run it in CI')
```

## fails
Mark the test as a regression test. Regression tests are meant to fail.

A great example of a regression test is someone reporting a bug with a failing test, and once the bug has been fixed, you can remove the call to the `fails` method.

```ts
test('add two numbers', ({ assert }) => {
  assert.equal(add(2, 2), 4)
})
.fails('add method should return 4, currently it returns 5')
```

## timeout
Define the `timeout` for the test. By default, the [config.timeout](./runner_config.md#timeout-optional) value is used. However, you can override it directly on the test.

In the following example, the test will be marked as failed if it is not complete within **6 seconds**.

```ts
test('add two numbers', () => {
})
.timeout(6000)
```

## disableTimeout
Disable timeout for a given test.

```ts
test('add two numbers', () => {
})
.disableTimeout()
```


## resetTimeout

Reset the timeout duration of the test. You can also call this method within the test callback.

```ts
test('get payments list', (ctx) => {
  ctx.test.resetTimeout(60 * 10000)
  
  await getPaymentsList()
})
 .timeout(2000)
```

## tags
Assign tags to a test. You can later use tags to filter and run only specific tests. 

See also: [Tagging tests](../guides/filtering_tests.md#tagging-tests)

```ts
test('add two numbers', () => {
})
.tags(['@slow', '@network'])
```

The method accepts an optional strategy for defining tags. The strategy can be `replace`, `append`, or `prepend`. Defaults to `replace`.

```ts
// append tags
test('add two numbers', () => {
})
.tags(['@network'], 'append')
```

```ts
// prepend tags
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

See also: [Testing asynchronous code](../guides/testing_async_code.md)

```ts
test('add two numbers', async () => {
  await someAsyncOperation()
})
```

However, there can be cases when you cannot use `async/await`, especially when dealing with **streams and events**.

Therefore, you can use the `waitForDone` method to instruct Japa to wait until an explicit call to the `done` method is made. For example:

```ts
test('add two numbers', async (ctx, done) => {
  emitter.on('someEvent', () => {
    done()
  })
})
.waitForDone()
```

## pin
Pin the test. When one or more tests are pinned, Japa will execute only the pinned tests and skip all others.

See also: [Pinned tests](../guides/filtering_tests.md#pinning-tests)

```ts
test('add two numbers', () => {
})
.pin()
```

## with
Define the dataset for the test. The dataset must be an array, and the test will execute for each item in the array.

See also: [Datasets](../guides/datasets.md)

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
Define the setup hook for the test.

See also: [Hooks](../guides/lifecycle_hooks.md)

```ts
test('add two numbers', () => {
})
.setup(async () => {
  // executed before the test
})
```

## teardown
Define the teardown hook for the test.

See also: [Hooks](../guides/lifecycle_hooks.md)

```ts
test('add two numbers', () => {
})
.teardown(async () => {
  // executed after the test
})
```

## options
A reference to the properties defined on the test. You can access the test instance within the test callback and hooks using the `ctx.test` property.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.test.options)
})

/**
  {
    title: string
    tags: string[]
    timeout: number
    meta: {
      suite: Suite,
      group: Group,
      fileName: string
    }
    retries?: number
    executor?: TestExecutor<any, any>
    isTodo: false
  }
*/
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

## isPinned

A property to know if the test is pinned using the `pin` method.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.test.isPinned)
})
```

## Extending Test class
You can add custom properties to the `Test` class using **macros** and **getters**. Macros and getters offer an API to add properties to the prototype of a class. You can think of them as Syntactic sugar for `Object.defineProperty`. Under the hood, we use [macroable package](https://github.com/poppinss/macroable/tree/next), and you can refer to its README for an in-depth technical explanation.

You can define custom properties inside the Japa entry point file (i.e., `bin/test(.js|.ts)`).

```ts
import { Test } from '@japa/runner/core'

Test.macro('isSlow', function () {
  this.tags(['@slow'], 'append')
  return this
})
```

Once you have defined the `isSlow` method, you can call it as follows on the `test` object.

```ts
import { test } from '@japa/runner'

test('get users list', () => {
})
.isSlow()
```

### Defining TypeScript types
If you use TypeScript, you must notify its compiler about the newly added property using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

Again, you may write the following code within the Japa entry point file.

```ts
declare module '@japa/runner/core' {
  interface Test {
    isSlow(): this
  }
}
```
