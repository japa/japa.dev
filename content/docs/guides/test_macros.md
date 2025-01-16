# Test macros
Test macros are functions that are bound to the lifecycle of a given test and therefore they can create and destroy resources around a test without using the lifecycle hooks.

Let's take a example of creating a file and automatically deleting it after the test finishes. You can write a macro for it as follows.

- The `test.macro` function accepts a callback function.
- This function receives the currently executed test as the first argument. Therefore, you can assign it a cleanup function as shown in the following example.
- The callback function can receive additional arguments and they must be supplied when calling the macro.
- Finally, you can return any value from the callback function.

```ts
import { test } from '@japa/runner'
import { writeFile, rm } from 'node:fs/promises'

export const useFile = test.macro((t, filePath: string, contents: string) => {
  /**
   * Assign a hook on the test to remove the file when the
   * test finishes
   */
  t.cleanup(() => rm(filePath))

  /**
   * Create file
   */
  return writeFile(filePath, contents)
})
```

Once you have defined a macro, you can import it and use it inside a test. Again, after the test finishes, the file will be removed automatically via the `t.cleanup` hook.

```ts
import { test } from '@japa/runner'
import { useFile } from './macros.js'

test('read main property from package.json file', async () => {
  await useFile('package.json', JSON.stringify({ main: 'index.js' }))
})
```

Let's take another example. This time we will create an instance of the HTTP server and close it automatically after the test finishes.

```ts
import { test } from '@japa/runner'
import { promisify } from 'node:utils'
import { createServer } from 'node:http'

export const useServer = test.macro((t, callback) => {
  /**
   * Create an HTTP server instance
   */
  const server = createServer(callback)

  /**
   * Assign the hook to close the server when test finishes
   */
  t.cleanup(() => promisify(server.close)())

  /**
   * Listen on some random port
   */
  server.listen(':0')

  /**
   * Return server instance
   */
  return server
})
```

Usage

```ts
import { test } from '@japa/runner'
import { useServer } from './macros.js'

test('serve static files', async () => {
  const server = useServer((req, res) => {
  })
})
```
