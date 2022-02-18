---
title: Run failed tests
description: A plugin to run only failed tests on subsequent runs
ogImage: run-failed-tests.jpeg
---

# Run failed tests
The `@japa/run-failed-tests` plugin allows you to run only failed tests on subsequent runs. Here's how the plugin works under the hood.

- You ran the tests suite, and a couple of tests failed.
- On the next run, only the failed test will run.
- If all tests are green, the next run will execute all the tests.

The workflow is usually helpful during refactoring, where you want to just focus on the failing tests only.

:::tip
The `runFailedTests` function uses the [test title filter](../filtering-tests.md#filter-by-test-title) to run only the failing tests. The test will be skipped, if you change the title of the failing test before the next run.
:::


## Installation and setup
You can install the package from npm registry as follows.

```sh
npm i -D @japa/run-failed-tests
```

And register it as a plugin within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { runFailedTests } from '@japa/run-failed-tests'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [runFailedTests()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { runFailedTests } = require('@japa/run-failed-tests')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [runFailedTests()]
    // highlight-end
  }
})
```
:::

You can also apply the plugin conditionally. For example, disable it during CI/CD workflow.

```ts
const developmentPlugins = []
if (!process.env.CI) {
  developmentPlugins.push(runFailedTests())
}

configure({
  plugins: [].concat(developmentPlugins)
})
```
