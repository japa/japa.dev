---
title: Runner config
description: Reference to the configuration options accepted by the Japa runner
ogImage: runner-config.jpeg
---

# Runner config

The `configure` method configures the tests runner within the `bin/test.js` file. The method accepts an object of configuration values. 

You can either hardcode all the values or compute them dynamically. In the following example, we use the `processCliArgs` method to process the command-line flags and merge them with a handwritten object.

:::languageSwitcher
```ts
// title: ESM
import { assert } from '@japa/assert'
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    plugins: [],
    reporters: [],
    timeout: 2000,
  },
})
```

```ts
// title: CommonJS
const { assert } = require('@japa/assert')
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    plugins: [],
    reporters: [],
    timeout: 2000,
  },
})
```
:::

Following is the list of available properties.

```ts
configure({
  files: ['tests/**/*.spec.js'],
  suites: [{
    name: 'unit',
    files: ['tests/unit/**/*.spec.js'],
    configure: () => {},
  }],
  plugins: [assert()],
  reporters: [],
  filters: {
    tests: [],
    tags: [],
    groups: [],
    files: [],
  },
  timeout: 2000,
  forceExit: false,
  importer: (filePath) => import(filePath),
  refiner: new Refiner({})
})
```

## files

The `files` property can be an array of glob patterns or a function that returns an array of files to import.

Under the hood, Japa uses the fast-glob package. So feel free to [reference their documentation](https://github.com/mrmlnc/fast-glob#pattern-syntax).

```ts
{
  files: ['tests/**/*.spec.js', '!tests/unit/some-test-file.js']
}
```

You can also implement a custom function to collect test files. The function must return an array of absolute file paths.

```ts
{
  files: () => {
    return []
  }
}
```

## suites *(optional)*
The `suites` property registers multiple test suites. You must use `files` or `suites` as both cannot be used together. [Learn more about test suites](./test-suites.md)

- Every suite object must define a unique name.
- The `files` property can be an array of glob patterns or a function that returns an array of files.
- The optional `configure` method can be used configure the suite instance.

```ts
{
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
      configure: (suite) => {
        // configure suite
      },
    }
  ],
}
```

## plugins *(optional)*

The `plugins` property allows you to register multiple plugins. Every plugin is represented as a function and called when running the tests. [Learn more about plugins](./extend/creating-plugins.md)

```ts
configure({
  plugins: [
    assert()
  ]
})

// Or an inline function
configure({
  plugins: [
    async function (config, runner, { Test, TestContext, Group }) {
    }
  ]
})
```

## reporters *(optional)*

The `reporters` property allows you to register one or more tests reporters. Every plugin is represented as a function and receives the emitter instance to listen for events. [Learn more about reporters](./extend/creating-reporters.md)

```ts
configure({
  reporters: [
    specReporter()
  ]
})

// Or an inline function
configure({
  reporters: [
    function (runner, emitter) {
    }
  ]
})
```

## filters *(optional)*

The `filters` property accepts an object of different filtering layers to cherry-pick and run specific tests. [Learn more about filtering tests](./filtering-tests.md)

```ts
configure({
  filters: {
    tests: [], // by tests title
    tags: [], // by tags
    groups: [], // by group titles
    files: [], // import only mentioned files
  }
})
```

## timeout *(optional)*
> Computed using the `--timeout` CLI flag.

Define the timeout for tests. The tests will timeout and be marked as failed after the given time has been elapsed. 

Set the value to `0` if you want to disable the timeout.

:::note
You can [configure the timeout for individual tests](./underlying-test-class.md#timeout) as well. The test timeout has precedence over the global timeout.
:::

```ts
{
  timeout: 2000
}
```

## forceExit *(optional)*
> Computed using the `--force-exit` CLI flag.

The tests runner waits for the process to exit gracefully. It means if your application makes any long-lived connections with a database or starts an HTTP server, then you must close it after the tests, or the process will not exit.

We recommend you gracefully close all open connections. However, you can force the tests runner to exit forcefully as soon as tests are finished. 

```ts
{
  forceExit: true
}
```

## importer *(optional)*

Japa imports the test files using the Node.js [dynamic import function](https://nodejs.org/api/esm.html#import-expressions). It works both for CJS and ESM. However, you can also supply a custom function to import test files if required.

```ts
{
  importer: (filePath) => import(filePath)
}
```

## refiner *(optional)*

The refiner object applies the filters and cherry-picks tests for execution. The default implementation relies on the [Refiner class](https://github.com/japa/core/blob/develop/src/Refiner/index.ts). However, you can also supply your refiner to customize the filter's logic.

```ts
{
  refiner: {
    filters: {},
    pinnedTests: new Set(),
    
    add(layer, values) {
      this.filters[layer].push(...values)
    },
      
    pinTest(test) {
      this.pinnedTests.add(test)
    }
      
    allows(testOrGroup) {
      return true 
    }
  }
}
```

The refiner object must implement the following methods.

- The `add` method accepts filters for a given layer. The layer can be `test`, `tags`, or `groups`. The value is always an array of strings.
- The `pinTest` method receives the test to pin.
- The `allows` receives an instance of the group or a test and must return a boolean.
    - `true` means run the test or group.
    - `false` means skip the test or group.
