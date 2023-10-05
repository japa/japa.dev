---
title: Runner config
description: Reference to the configuration options accepted by the Japa runner
---

# Runner config

The `configure` method configures the test runner within the `bin/test.js` file. The method accepts an object of configuration values. 

```ts
import { assert } from '@japa/assert'
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  timeout: 2000,
})
```

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
  reporters: {
    activated: [],
    list: []
  },
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

## suites (optional)
You can register multiple test suites inside the `suites` array. Each suite is represented as an object with the following properties

- The `name` property represents the unique name for the suite.
- The `files` property can be an array of glob patterns or a function that returns an array of files.
- The optional `configure` method can configure the suite instance.

See also: [Test suites](../guides/test_suites.md)

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

## plugins (optional)

The `plugins` property allows you to register multiple plugins.

See also: [Creating Japa plugins](./plugins.md)

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

## reporters (optional)

The `reporters` property allows you to register multiple reporters and activate some of them. You can also activate/switch between reporters using the `--reporters` CLI flag.

See also: [Test reporters](../guides/test_reporters.md)

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

## filters (optional)

The `filters` property accepts an object of different filtering layers to cherry-pick and run specific tests.

Usually, you will be using the CLI flags to compute the filters. However, you can also set them programmatically within the config object.

See also: [Filtering tests](../guides/filtering_tests.md)

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

## timeout (optional)
Define the timeout for all the tests. A test will be marked as failed, if it does not complete within the configured time.

You can also define the global timeout using the `--timeout` CLI flag.

:::note
You can [configure the timeout for individual tests](./test.md#timeout) as well. The test timeout has precedence over the global timeout.
:::

```ts
{
  timeout: 2000
}

{
  // Set value to zero to disable timeout
  timeout: 0
}
```

## forceExit (optional)
The test runner waits for the process to exit gracefully. If your application makes any long-lived connections with a database or starts an HTTP server, you must close it after the tests, or the process will not exit.

We recommend you gracefully close all open connections. However, you can force the test runner to exit forcefully after finishing tests.

You can also enable this property using `--force-exit` CLI flag.

```ts
{
  forceExit: true
}
```

## importer (optional)

Japa imports the test files using the Node.js [dynamic import function](https://nodejs.org/api/esm.html#import-expressions). However, if required, you can also supply a custom function to import test files.

```ts
{
  importer: (filePath) => import(filePath)
}
```

## refiner (optional)

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
