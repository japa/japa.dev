---
title: From `japa` to `@japa/runner`
description: Upgrade your existing to the latest release of Japa
ogImage: version-5.jpeg
---

# From `japa` to `@japa/runner`

Japa has received a massive rewrite, and all the packages have been moved to the `@japa` npm scope. The existing package [japa](https://www.npmjs.com/package/japa) is replaced with [@japa/runner](https://npmjs.com/package/@japa/runner).

- We recommend you not use `japa` anymore and migrate your tests to `@japa/runner`.
- The old package has been moved into maintenance mode and will not receive any updates. However, it will be archived at the end of the year 2022.

## Setup Japa runner
The first step is to set up the newer version of Japa by executing the following command.

:::note
Choose `@japa/assert` as the assertion library, as the older version used.
:::

```sh
npm init japa
```

## Copy/paste configuration options
Open the existing `japaFile(.js|.ts)` and copy the configuration options of the `configure` method to the newly created `bin/test(.js|.ts)` file.

```ts
// title: bin/test(.js|.ts)
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    // paste your configuration here 👈
  },
})
```

Let's go through all the configuration options and the changes required to work with the newer version.

- The `files` and the `timeout` properties are unchanged.
- The `bail` and the `experimentalEsmSupport` properties have been removed.
- The `grep` property has been removed in favor of filters. If you were using it, then replace it as follows.
  
  ```ts
  {
    // delete-start
    grep: 'Some test title',
    // delete-end
    // insert-start
    filters: {
      tests: ['Some test title']
    }
    // insert-end
  }
  ```
- The `before` and `after` hooks have been renamed `setup` and `teardown`.
  
  ```ts
  {
    // delete-start
    before: [action1, action2],
    after: [action1, action2],
    // delete-end
    // insert-start
    setup: [action1, action2],
    teardown: [action1, action2],
    // insert-end
  }
  ```
- The `reporterFn` property has been removed in favor of `reporters`.
  
  ```ts
  {
    // delete-start
    reporterFn: (emitter) => {
      // listen for events
    },
    // delete-end
    // insert-start
    reporters: [
      (runner, emitter) => {
        // listen for events
      }
    ]
    // insert-end
  }
  ```

- The files `filter` method has been removed. Instead, you can use the `filters.files` array to specify the partial file names.

  ```ts
  {
    // delete-start
    filter: (file) => file.includes('some-name.spec'),
    // delete-end
    // insert-start
    filters: {
      files: ['some-name.spec']
    }
    // insert-end
  }
  ```

## Update tests to use correct imports
The next step is to open the test files and update the `test` method import. You can also do a bulk search and replace using your code editor's replace feature.

```ts
// delete-start
import test from 'japa'
// delete-end
// insert-start
import { test } from '@japa/runner'
// insert-end
```

## Update `assert` reference
The `assert` property has been moved to the [Test context](../test-context.md), and therefore you must update the test callback function and destruct it from the context object.

```ts
// delete-start
test('my test title', (assert) => {
})
// delete-end
// insert-start
test('my test title', ({ assert }) => {
})
// insert-end
```

## Update lifecycle hooks
The lifecycle hooks have been renamed from `before` and `after` to `setup` and `teardown`. So again, you can use your code editor's bulk search and replace it to perform the update.

```ts
test.group('Group 1', (group) => {
  // delete-start
  group.before(() => {
  })
  // delete-end
  // insert-start
  group.setup(() => {
  })
  // insert-end

  // delete-start
  group.after(() => {
  })
  // delete-end
  // insert-start
  group.teardown(() => {
  })
  // insert-end
})
```

The `beforeEach` and `afterEach` methods are replaced with `each.setup` and `each.teardown`.

```ts
test.group('Group 1', (group) => {
  // delete-start
  group.beforeEach(() => {
  })
  // delete-end
  // insert-start
  group.each.setup(() => {
  })
  // insert-end

  // delete-start
  group.afterEach(() => {
  })
  // delete-end
  // insert-start
  group.each.teardown(() => {
  })
  // insert-end
})
```

## Update tests using the `done` callback
The tests using the `done` callback needs must explicitly call the `waitForDone` method.

```ts
test('make redis connection', ({ assert }, done) => {
})
// insert-start
.waitForDone()
// insert-end
```

## Replace test variations with chainable methods
The variations like `test.only` or `test.skip` are no longer available. Instead, you can use chainable methods for similar behavior.

With the new version, the `skip` method can also be a function to compute if the test should be skipped or not lazily.

```ts
// delete-start
test.skip('my test title', () => {
})
// delete-end
// insert-start
test('my test title', () => {
})
.skip(true)
// insert-end
```

The `test.only` is replaced with the `.pin` method. Also, now you can pin multiple tests.

```ts
// delete-start
test.only('my test title', () => {
})
// delete-end
// insert-start
test('my test title', () => {
})
.pin()
// insert-end
```

Finally, the `test.fail` is replaced with the `fails` method. Now, you can also specify the failure reason.

```ts
// delete-start
test.fail('my test title', () => {
})
// delete-end
// insert-start
test('my test title', () => {
})
.fails('Expect to do x, but does y')
// insert-end
```

## Tests are stuck after the upgrade
The newer version of Japa relies on Node.js to gracefully exit the process instead of explicitly calling `process.exit`.

Node.js will gracefully exit the process only when the event loop is empty, and your application has closed all long-lived connections.

There are chances you still have some open connections even after the test suite has finished, making the Japa process, not exit.

The first easy solution is to enable the `forceExit` option within the configure method.

```ts
configure({
  forceExit: true
})
```

The recommended approach is to close all open connections using the runner lifecycle hooks. So, for example, if you start the HTTP server before the tests, then make sure to close it after the tests.

```ts
configure({
  setup: [
    () => {
      const server = createServer(() => {})
      server.listen()

      // close using cleanup method
      return () => server.close()
    }
  ]
})
```
