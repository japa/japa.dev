---
title: Testing asynchronous code
description: Japa has first class support for testing asynchronous workflows including Promises, events, callbacks and streams.
ogImage: async-code.jpeg
---

# Testing asynchronous code

Japa has first class support for testing asynchronous workflows including **Promises**, **events**, **callbacks** and **streams**.

In this guide, we will learn how to test asynchronous code and explore various techniques to convert common async workflows to promises.

## Async await
Writing tests that use promises or async/await is the recommended approach. As soon as the test callback is finished, Japa will mark the test as passed. Likewise, the test will be marked as failed in case of an error.

```ts
test('verify email address', async () => {
  // await promise
  await validateEmail(email)
})
```

```ts
test('verify email address', async () => {
  // Return promise
  return validateEmail(email)
})
```

## Waiting for `done` method call

If your test code relies on the **event emitter**, **callbacks**, or **timeouts**, then you can instruct Japa to wait for an explicit call to the `done` method.

```ts
test('make redis connection', async (ctx, done) => {
  const redis = new Redis()
  
  redis.on('connected', () => {
    //👇 Now the test will be marked as completed
    done()
  })

  await redis.connect()
})
.waitForDone() // 👈 telling japa to wait for done call
```

In case of errors, you can pass the error to the `done` method, and the test will be marked as failed.

```ts
test('make redis connection', async (ctx, done) => {
  const redis = new Redis()
  
  redis.on('connected', () => {
    // passed
    done()
  })

  redis.on('error', (error) => {
    // failed
    done(error)
  })

  await redis.connect()
})
.waitForDone()
```


## Strategies to promisify your codebase

Even though you can write tests that rely on callbacks or events, we highly recommend you prefer `async/await` over any other async API. The `async/await` code reads linearly and is easy to reason. 

Let us share some of the ways you can use to convert callbacks, events, or timeouts to promises.

### Callbacks to promises

Node.js ships with a utility function `promisify` that you can use to convert callbacks into promises.

Let's say you are testing the following piece of code.

```ts
test('generate pdf', (ctx, done) => {
  pdf
    .create(html, options)
    .toFile('./businesscard.pdf', function(error, res) {
      if (error) {
        done(error)
      } else {
        done()
      }
    })
})
.waitForDone()
```

You can convert the above method to a promise as follows.

:::languageSwitcher
```ts
// title: ESM
import { promisify } from 'util'

test('generate pdf', async (ctx) => {
  const toFile = promisify(pdf.create(html, options).toFile)
  await toFile()
})
```

```ts
// title: CommonJS
const { promisify } = require('util')

test('generate pdf', async (ctx) => {
  const toFile = promisify(pdf.create(html, options).toFile)
  await toFile()
})
```
:::

### Promisify setTimeout

Most of the time, you use `setTimeout` to sleep between operations. Therefore, you can create a dedicated sleep method that resolves the promise after the timeout.

```ts
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
```

You can make use of it as follows.

```ts
test('generate pdf', async (ctx) => {
  await operation1()

  await sleep(5000) // for 5 seconds

  await operation2()
})
```

### Promisify event listeners

You can also convert event listeners to promises using the [p-event](https://github.com/sindresorhus/p-event) package.

In the following example, the promise will reject if an `error` event is emitted and resolve when a `connected` event is emitted.

:::languageSwitcher
```ts
// title: ESM
import pEvent from 'p-event'

test('make redis connection', async (ctx) => {
  const redis = new Redis()
  
  await Promise.all([
    pEvent(
      redis,
      'connected',
      { rejectionEvents: ['error'] }
    ),

    redis.connect()
  ])
})
```

```ts
// title: CommonJS
const pEvent = require('p-event')

test('make redis connection', async (ctx) => {
  const redis = new Redis()
  
  await Promise.all([
    pEvent(
      redis,
      'connected',
      { rejectionEvents: ['error'] }
    ),

    redis.connect()
  ])
})
```
:::

### Promisify streams
You can promisify streams using the [get-stream](https://github.com/sindresorhus/get-stream) npm package.

:::languageSwitcher
```ts
// title: ESM
import getStream from 'get-stream'

test('handle file uploads', async (ctx) => {
  const buffer = await getStream(someReadableStream)
})
```

```ts
// title: CommonJS
const getStream = require('get-stream')

test('handle file uploads', async (ctx) => {
  const buffer = await getStream(someReadableStream)
})
```
:::
