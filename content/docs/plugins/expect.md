
# Expect

The `@japa/expect` plugin is a wrapper on top of [jest-expect](https://jestjs.io/docs/expect#expect). Please reference Jest documentation to view the list of available assertion methods.

## Installation

Install the package from the npm packages registry as follows.

```sh
npm i -D @japa/expect
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
// highlight-start
import { expect } from '@japa/expect'
// highlight-end
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  // highlight-start
  plugins: [expect()]
  // highlight-end
})
```


Once done. You can access the `expect` property from the [Test context](../reference/test_context.md) as follows.

:::note

In Jest, the `expect` property is available globally. However, with Japa, we recommend you always read it from the Test context.

:::

```ts
test('add two numbers', ({ expect }) => {
  expect(2 + 2).toEqual(4)
})
```
