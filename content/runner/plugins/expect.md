# Expect

The `@japa/expect` plugin is a wrapper on top of [jest-expect](https://jestjs.io/docs/expect). Please read the Jest documentation to view the methods available on the `expect` object.

Suppose you have not configured the plugin during the initial setup. Then, you can install it from the npm registry as follows.

```sh
npm i -D @japa/expect
```

And register it as a plugin within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { expect } from '@japa/expect'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    plugins: [expect()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { expect } = require('@japa/expect')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    plugins: [expect()]
    // highlight-end
  }
})
```
:::

Once done. You can access the `expect` property on the [Test context](../test-context.md) as follows.

```ts
test('add two numbers', ({ expect }) => {
  expect(2 + 2).toEqual(4)
})
```

In Jest, the `expect` property is available globally. However, with Japa, we recommend you always read it from the Test context.

## TypeScript types
You can define the types for the `expect` property using [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

Create the `bin/japaTypes.ts` file if it does not already exist and copy/paste the following code snippet inside it.

  ```ts
  import { Expect } from '@japa/expect'

  declare module '@japa/runner' {
    interface TestContext {
      expect: Expect
    }
  }
  ```
