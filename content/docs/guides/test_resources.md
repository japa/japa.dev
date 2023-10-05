# Test resources

Test resources refer to some state you create at the start of the test and dispose it at the end of the test. For example, 

- Start an HTTP server and close it after the test.
- Creating a database row and removing it after the test.
- Or creating a database connection and closing it after the test.

## The problem

Let's take the HTTP server as an example. A test that starts and closes the server might look as follows.

```ts
import { test } from '@japa/runner'
import { promisify } from 'node:utils'
import { createServer } from 'node:http'

test('serve static assets', async () => {
  const server = createServer((req, res) => {
  })
  server.listen(somePort)
  
  /**
   * Here, you might make a request to the
   * HTTP server.
   *
   * And write some assertions
   */
 
  await promisify(server.close)()
})
```

The above test will work fine until an exception is thrown before closing the HTTP server. In that case, the HTTP server will never get closed.

## Solution 1 - Using try/finally statement

You may wrap your code inside a `try/finally` statement and ensure the HTTP server always gets closed, regardless of an error.

```ts
import { test } from '@japa/runner'
import { promisify } from 'node:utils'
import { createServer } from 'node:http'

test('serve static assets', async () => {
  const server = createServer((req, res) => {
  })
  server.listen(somePort)
  
  // insert-start
  try {
    /**
     * Here, you might make a request to the
     * HTTP server.
     *
     * And write some assertions
     */
  } finally {
    await promisify(server.close)()
  }
  // insert-end
})
```

The `try/finally` statement works great technically. However, it does add some visual noise to your tests, and you might end up writing nested `try` statements if creating multiple resources within a single test.

## Solution 2 - Test resources

Test resources offer an alternate API to create and dispose resources around the lifecycle of a test. Also, they can clean up a lot of state management code from your test callbacks.

Let's create a resource for an HTTP server. We will keep it inside the `tests/helpers.js` file.

```ts
// title: tests/helpers.js
import { promisify } from 'node:utils'
import { createServer } from 'node:http'
// highlight-start
import { getActiveTest } from '@japa/runner'
// highlight-end

export function createHttpServer(callback) {
  const server = createServer(callback)

  // highlight-start
  const test = getActiveTest()
  test.cleanup(() => promisify(server.close)())
  // highlight-end
  
  server.listen(somePort)
  return server
}
```

As you can notice, the `createHttpServer` is a regular JavaScript function that creates an instance of the Node.js HTTP server. However, it uses some special APIs from Japa.

1. **On line 3**: We import the `getActiveTest` helper from Japa to get an instance of the currently running test.
2. **On lines 8-9**: We grab an instance of the current test and define a cleanup function to close the HTTP server. Test cleanup functions are executed after a test is completed, regardless of an error.

Finally, within your test, you can get an instance of the HTTP server using the newly created `createHttpServer` helper. 

The `createHttpServer` helper will auto close the server after the test is completed, hence you do not have write any additional logic for the cleanup within the test callback.

```ts
import { test } from '@japa/runner'
import { createHttpServer } from './helpers.js'

test('serve static assets', async () => {
  const server = createHttpServer((req, res) => {
  })

  /**
   * Here, you might request to the
   * HTTP server.
   *
   * And write some assertions
   */
     
  /**
   * No need to close the server. It will be
   * closed automatically after the test
   */
})
```