# Test class

The [Test class](https://github.com/japa/core/blob/develop/src/Test/index.ts) exposes the API to configure a single test. You can create a new instance of a test as follows.

```ts
import {
 Test,
 Emitter,
 Refiner,
 TestContext,
} from '@japa/core'

const emitter = new Emitter()
const refiner = new Refiner({})
const getContext = () => new TestContext()

const test = new Test(
  title,
  getContext,
  emitter,
  refiner
)
```

A test needs the following constructor arguments.

- `title`: The title for the test. The developer writing the test will usually supply the test title.
- `getContext`: A function that returns an isolated context for the test. This function can either return an instance of the `TestContext` class or return an arbitrary object.
- `emitter`: A global instance of the Emitter. Make sure you use only one emitter instance throughout the complete cycle of running tests.
- `refiner`: A global instance of the Refiner class. The refiner is used to cherry-pick tests and groups to run specific tests only.

## run

Use the `run` method to define the test implementation function. The test is marked as **todo** when no implementation is provided.

```ts
test.run((ctx) => {
  // write test logic
})
```


## skip

Mark the test as skipped. You can either pass a boolean to the `skip` method or a function that is lazily evaluated to find if the test should be skipped or not.

```ts
// skip the test
test.skip(true)

// skip when `CI` env var exists
test.skip(!!process.env.CI)

// Use a function to compute at the time of
// running the test
test.skip(() => {
  return computedIsShouldBeSkipped()
})
```

The 2nd optional argument is the reason for skipping the test.

```ts
test.skip(true, 'Not running CI')
```

## fails

Mark test as a regression test. Regression tests are meant to fail.

A great example of a regression test is someone reporting a bug with a failing test, and once the bug has been fixed, you can remove the call to the `fails` method.

```ts
test
  .run(({ assert }) => {
    assert.equal(add(2, 2), 4)
  })
  .fails('add method should return 4, instead it returns 5')
```

## timeout

Define the `timeout` for the test. All tests timeout after **2 seconds** automatically. However, you can configure the timeout at the test level as well.

```ts
// 6 seconds
test.timeout(6000)

// disable timeout
test.timeout(0)
```

## disableTimeout

A shorthand method to disable the timeout. It is the same as calling `timeout(0)`.

```ts
test.disableTimeout()
```

## tags

Assign tags to a test. You can later use tags to filter and run only specific tests.

```ts
test.tags(['@slow', '@network'])
```

The method accepts an optional strategy for defining tags. The strategy can be either `replace`, `append`, or `prepend`.

```ts
test.tags(['@slow'])

// Append to existing tags
test.tags(['@network'], 'append')

// Prepend to existing tags
test.tags(['@network'], 'prepend')
```

## retry

Define the retry count for the test. Only after the mentioned retries will the test be marked as failed.

In the following example, the test will run four times. First is the original attempt, and then three retries before it is marked as failed.

```ts
test.retry(3)
```

## waitForDone

You can run asynchronous operations inside the test implementation function using `async/await`. For example:

```ts
test.run(async () => {
	await someAsyncOperation()
})
```

However, you cannot use `async/await` in some situations, especially with **streams and events**. In those cases, you can tell the test to wait until the `done` method is called.

In the following example, the test will wait until the `done` method is called explicitly.


:::warn
The test will timeout, if the `done` method is never called.
:::

```ts
test
  .run((ctx, done) => {
    emitter.on('someEvent', () => {
      done()
    })
  })
  .waitForDone()
```

You can also pass an error object to the `done` method to mark the test as failed.

```ts
test
  .run((ctx, done) => {
    stream.on('error', (error) => done(error))
  })
  .waitForDone()
```

## pin

Pin the test. When one or more tests are pinned, we will execute only those tests and skip all others.

```ts
test.pin()
```

## with

Define the dataset for the test. The dataset must be an array, and we will execute the test for each item in the array.

```ts
test
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

test
  .with(getTestEmails)
  .run(async (ctx, email) => {
    // executed for each email	  
  })
```

## setup

Define the setup hook for the test. 

```ts
test.setup(async () => {
  // executed before the test
})
```

## teardown

Define the teardown hook for the test. 

```ts
test.teardown(async () => {
  // executed after the test
})
```

## exec

Execute the test. Ideally, you will never call this method manually, as the tests runner invokes it.

```ts
await test.execute()
```

## options

A reference to the properties defined on the test. 

```ts
console.log(test.options)

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
test.setup((self) => {
  console.log(self.dataset)
})
```

## context

Reference to the test context.

```ts
test.setup((self) => {
  console.log(self.context)
})
```

## static dispose

You can run synchronous functions just before the test is disposed. The test is considered as disposed right after the test executor function is called and before the `teardown` hooks.

The dispose actions are usually helpful when you want to validate or clean up something in the context.

For example, the assert package [validates the assertions executed](https://github.com/japa/assert/blob/develop/index.ts#L22-L26) using the dispose function.

:::note
Any exceptions raised by the dispose actions will fail the underlying test.
:::

```ts
import { Test } from '@japa/core'

Test.dispose(function () {
  throw new Error('Something went wrong')
})
```
