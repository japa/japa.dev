---
title: Snapshot
description: Snapshot testing plugin for Japa
---

# Snapshot

The snapshot plugin brings [snapshot testing](https://www.sitepen.com/blog/snapshot-testing-benefits-and-drawbacks) (popularised by Jest) to Japa. The plugin extends the [assert](./assert.md) and [expect](./expect.md) modules by adding assertion methods that use either inline snapshots or on-disk snapshots for writing assertions.


## Installation

You can install the plugin from the npm packages registry as follows.

```sh
npm i -D @japa/snapshot
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
// highlight-start
import { snapshot } from '@japa/snapshot'
// highlight-end
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  // highlight-start
  plugins: [snapshot()],
  // highlight-end
})
```

## Basic usage

Once the plugin has been registered, you can use the `toMatchSnapshot` and `toMatchInlineSnapshot` methods for writing assertions.

```ts
// title: Usage with Japa Assert
test('match snapshot', async ({ assert }) => {
  assert.snapshot('1').match()
})
```

```ts
// title: Usage with Japa Expect
test('match snapshot', async ({ assert, expect }) => {
  expect('1').toMatchSnapshot()
})
```

If you run the above test, a new snapshot will be created inside the `tests/__snapshots__` directory with the following contents.

```ts
// title: tests/__snapshots__/my-test.spec.ts.cjs
exports['match snapshot 1'] = `"1"`
```

The snapshots are saved as per the following rules.

- One snapshot file is created for each test file.
- The snapshot export combines the test title and a sequence counter. The sequence counter represents the number of snapshot assertions you have in a test.

## Inline snapshots

You can use inline snapshots to write the snapshot value inline within the test.

```ts
// title: Usage with Japa Assert
test('match snapshot', async ({ expect, assert }) => {
  assert.snapshot('1').matchInline()
})
```

```ts
// title: Usage with Japa Expect
test('match snapshot', async ({ expect, assert }) => {
  expect('1').toMatchInlineSnapshot()
})
```

If you run the above test, the snapshot plugin will modify your test file and paste the output of the snapshot inline within the test. 

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

Snapshots, once generated, are treated as the source of truth for future assertions. However, you can update/override them by running your tests with the `--update-snapshots` CLI flag.

```sh
node bin/test.js --update-snapshots

# Or use the alias
node bin/test.js -u
```

## Configuration options
You can configure the snapshot plugin with the following options.

```ts
configure({
  files: ['tests/**/*.spec.js'],
  plugins: [
    snapshot({
      resolveSnapshotPath: (testPath) => {
        /**
         * This will create a snapshot file next to your
         * test file.
         */
        return testPath.replace('.spec.ts', '.spec.ts.cjs')
      },
      prettyFormatOptions: {
        printFunctionName: true
      }
    })
  ]
})
```

<dl>

<dt>

prettyFormatOptions

</dt>

<dd>

The options to pass to the [pretty-format](https://www.npmjs.com/package/pretty-format) package. This is used to format the snapshot value.

</dd>

<dt>

resolveSnapshotPath

</dt>

<dd>

A callback to resolve the location of the snapshot file. By default, the snapshot file is created inside the `__snapshots__` directory next to the test file.

</dd>

</dl>
