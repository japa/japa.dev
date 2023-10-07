---
title: Snapshot
description: Snapshot testing plugin for Japa
---

# Snapshot

The snapshot plugin allows you to write snapshot tests for your application. You can install the plugin from the npm packages registry as follows.
Note that you will need at least `@japa/expect` or `@japa/assert` since the plugin extends them with 2 new matchers.

```sh
npm i -D @japa/snapshot@1.0.1-3
```

The next step is registering the plugin inside the `plugins` array.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { snapshot } from '@japa/snapshot'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [snapshot()],
    // highlight-end
  },
})
```

```ts
// title: CommonJS
// highlight-start
const { snapshot } = require('@japa/snapshot')
// highlight-end

const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [snapshot()],
    // highlight-end
  },
})
```

:::

## Basic usage

Once the plugin has been registered, you can access the `snapshot` property from the [test context](../test-context.md). The `snapshot` property exposes two new matchers `toMatchSnapshot` and `toMatchInlineSnapshot` :

```ts
// title: tests/my-test.spec.ts
test('match snapshot', async ({ assert, expect }) => {
  // with @japa/assert
  assert.snapshot('1').match()

  // with @japa/expect
  expect('1').toMatchSnapshot()
})
```

The above test will create a snapshot file with the following content:

```ts
// title: tests/__snapshots__/my-test.spec.ts.cjs
exports['match snapshot 1'] = `"1"`
```

:::note
Note the `1` at the end of the export name. This is a sequential number that is used to uniquely identify each snapshot, in case you have multiple snapshots inside the same test.

That means if you re-order your snapshots assertions, you will have to update your snapshots with the `--update-snapshots` flag.
:::

## Inline snapshots

You can also use inline snapshots to write the snapshot value inline with the test:

```ts
test('match snapshot', async ({ expect, assert }) => {
  // with @japa/assert
  assert.snapshot('1').matchInline()

  // with @japa/expect
  expect('1').toMatchInlineSnapshot()
})
```

The above test, after it first run, will append the snapshot value to the test file as follows:

```ts
// title: tests/my-test.spec.ts
test('match snapshot', async ({ expect, assert }) => {
  // with @japa/assert
  assert.snapshot('1').matchInline('"1"')

  // with @japa/expect
  expect('1').toMatchInlineSnapshot('"1"')
})
```

## Updating snapshots

You can update the snapshots by passing the `--update-snapshots` or `-u` flag to the CLI:

```sh
npm run test -- -u
```

## Snapshot options

The `snapshot` plugin exposes the following options:

| Option                | Description                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prettyFormatOptions` | The options to pass to the [pretty-format](https://www.npmjs.com/package/pretty-format) package. This is used to format the snapshot value.                   |
| `resolveSnapshotPath` | A callback to resolve the location of the snapshot file. By default, the snapshot file is created inside the `__snapshots__` directory next to the test file. |

You can pass the options to the plugin as follows:

```ts
configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    plugins: [
      snapshot({
        resolveSnapshotPath: (testPath) => {
          /**
           * This will create a snapshot file next to your
           * test file.
           */
          return testPath.replace('.spec.ts', '.spec.ts.cjs')
        }
        prettyFormatOptions: {
          printFunctionName: true
        }
      })
    ]
  }
})
```
