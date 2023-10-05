# Testing asynchronous code

Japa has first-class support for testing asynchronous workflows, including **Promises**, **events**, **callbacks** and **streams**.

In this guide, we will learn how to test asynchronous code and explore various techniques to convert common async workflows to promises.

## Async/await

The recommended approach is writing tests that use Promises or `async/await`. As soon as the test callback is executed, Japa will mark the test as completed. Therefore, you must always `await` Promises or return them as a value from the callback.

```ts
// title: await Promise
test('verify email address', async () => {
  await validateEmail(email)
})
```

```ts
// title: Return Promise as a value
test('verify email address', async () => {
  return validateEmail(email)
})
```

## Waiting for the `done` method call
If your test relies on **event emitter**, **callbacks**, or **timeouts**, you must instruct Japa to wait until the `done` method is called within the test callback.

```ts
test('make redis connection', async (ctx, done) => {
  const redis = new Redis()
  
  redis.on('connected', () => {
    // highlight-start
    // Mark test as completed
    done()
    // highlight-end
  })

  await redis.connect()
})
// highlight-start
.waitForDone()
// highlight-end
```

In case of an error, you must pass the error object to the `done` method, and Japa will mark the test as failed.

```ts
test('make redis connection', async (ctx, done) => {
  const redis = new Redis()
  
  redis.on('connected', () => {
    // highlight-start
    // Mark test as completed
    done()
    // highlight-end
  })

  redis.on('error', (error) => {
    // highlight-start
    // Mark test as failed
    done(error)
    // highlight-end
  })

  await redis.connect()
})
.waitForDone()
```

## Strategies to promisify your codebase

Even though you can write tests relying on callbacks or events, we highly recommend you prefer `async/await` over any other API. The `async/await` code reads linearly and is easy to reason about.

Let us share some ways to convert callbacks, events, or timeouts to promises.

### Callbacks to Promises

Node.js ships with a utility function called `promisify` that you may use to convert callbacks into promises.

:::caption{for="info"}
**Code using an async callback**
:::

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

:::caption{for="info"}
**Converted to a promise**
:::

```ts
import { promisify } from 'util'

test('generate pdf', async (ctx) => {
  const toFile = promisify(pdf.create(html, options).toFile)
  await toFile()
})
```

### setTimeout as a Promise

Instead of using the global `setTimeout` method, you can import it from the `timers/promises` module and invoke the method as a Promise. For example:

```ts
import { setTimeout } from 'node:timers/promises'

test('generate pdf', async (ctx) => {
  await operation1()

  // for 5 seconds
  await setTimeout(5000)

  await operation2()
})
```

### Promisify event listeners

You can also convert event listeners to Promises using the [p-event package](https://github.com/sindresorhus/p-event).

In the following example, the Promise will be rejected if an `error` event is emitted and resolved when the `connected` event is emitted.

```ts
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

### Promisify streams
You can promisify streams using the [get-stream package](https://github.com/sindresorhus/get-stream).

```ts
import getStream from 'get-stream'
import { createReadStream } from 'node:fs'

test('handle file uploads', async (ctx) => {
  const stream = createReadStream('../package.json')
  const buffer = await getStream(someReadableStream)
})
```
