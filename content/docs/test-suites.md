---
title: Test Suites
description: Use test suites to organize tests by their types, like a unit test suite and a functional test suite.
ogImage: suites.jpeg
---

# Test suites
Test suites allow you to organize your tests by their type. For example, you can create separate suites for **unit tests** and **functional tests** and keep their test files in dedicated sub-folders.

:::languageSwitcher
```ts
// title: ESM
import { configure } from '@japa/runner'

configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
    },
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.js'],
    }
  ]
})
```

```ts
// title: CommonJS
const { configure } = require('@japa/runner')

configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
    },
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.js'],
    }
  ]
})
```
:::

- You must not use the `files` property when you are using `suites`.
- Each suite must have a unique `name` and a `files` property to associate test files with the suite.

## Run selected suites
You can run tests for a specific suite by specifying the suite name after the test file name.

In the following example, only the unit tests will run.

```sh
node bin/test.js unit
```

The following example will run the tests for both the unit and the functional suites.

```sh
node bin/test.js unit functional
```

## Lifecycle hooks
Similar to tests and groups, you can also define lifecycle hooks for the suites. For example, you can use hooks to start the HTTP server before running the tests in the functional suite.

The `configure` method in the suite configuration object receives an instance of the [Suite class](https://github.com/japa/core/blob/develop/src/Suite/index.ts), and you can use it to register the hooks.

```ts
configure({
  suites: [
    {
      name: 'functional',
      files: ['tests/functional/**/*.spec.js'],
      // highlight-start
      configure(suite) {
        suite.setup(() => {
          server = createServer(handler)
          server.start()

          return () => server.close()
        })
      },
      // highlight-end
    }
  ]
})
```

## Configure suite groups and tests
You can drill down the layers and configure groups/tests directly using the suite instance. Imagine a plugin adding extra functionality or lifecycle hooks on every test and group.

:::note
Only the tests without any group can be accessed using the `onTest` method. However, you can use the `onGroup` method to access the group tests.
:::

```ts
configure(suite) {
  suite.onTest((test) => {
    test.setup(() => {})
  })

  suite.onGroup((group) => {
    group.tap((test) => {
      test.setup(() => {})
    })
  })
},
```

## Running suites in parallel
You might be aware that Japa does not run tests parallelly. However, you can use the following tip to run suites parallelly.

Start by installing the [concurrently](https://www.npmjs.com/package/concurrently) package from the npm registry.

```sh
npm i -D concurrently
```

And register the following scripts within the `package.json` file.

```json
{
  "scripts": {
    "unit:tests": "node bin/test.js unit",
    "functional:tests": "node bin/test.js functional",
    "test": "concurrently \"npm:unit:tests\" \"npm:functional:tests\""
  }
}
```

And finally, run the tests as usual.

```sh
npm test
```
