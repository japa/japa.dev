# Test context
An instance of the [TestContext](https://github.com/japa/runner/blob/next/modules/core/main.ts#L38) class is shared with all the tests and the test hooks. Japa creates an isolated instance of `TestContext` for every test. Therefore, you can add custom properties without worrying about it leaking to other tests.

Based on your installed plugins, you may access different properties via the `ctx` object.

```ts
// title: Access context inside a test
import { test } from '@japa/runner'

test('add two numbers', (ctx) => {
  // highlight-start
  console.log(ctx)
  // highlight-end
})
```

```ts
// title: Access context inside hooks
import { test } from '@japa/runner'

test.group('Maths.add', (group) => {
  // highlight-start
  group.each.setup(($test) => {
    console.log($test.context)
  })

  group.each.teardown(($test) => {
    console.log($test.context)
  })
  // highlight-end

  test('add two number', (ctx) => {
    console.log(ctx)
  })
})
```

## TestContext properties
Following is the list of properties you may access through the `TestContext` class.

<dl>

<dt>

assert

</dt>

<dd>

The `assert` property is shared by the [@japa/assert](../plugins/assert.md) plugin.

</dd>

<dt>

expect

</dt>

<dd>

The `expect` property is shared by the [@japa/expect](../plugins/expect.md) plugin.

</dd>

<dt>

fs

</dt>

<dd>

The `fs` property is shared by the [@japa/file-system](../plugins/file_system.md) plugin.

</dd>

<dt>

expectTypeOf

</dt>

<dd>

The `expectTypeOf` property is shared by the [@japa/expect-type](../plugins/expect_type.md) plugin.

</dd>

<dt>

client

</dt>

<dd>

The `client` property is shared by the [@japa/api-client](../plugins/api_client.md) plugin.


</dd>

<dt>

browser, browserContext, visit

</dt>

<dd>

The browser-related properties are shared by the [@japa/browser-client](../plugins/browser_client.md) plugin.

</dd>

<dt>

cleanup

</dt>

<dd>

The `cleanup` function can define a cleanup hook from within the test callback. [Learn more](../guides/test_resources.md#solution-2---test-resources).

</dd>

</dl>


## Extending TestContext
You can add custom properties to the `TestContext` class using **macros** and **getters**. Macros and getters offer an API to add properties to the prototype of a class. You can think of them as Syntactic sugar for `Object.defineProperty`. Under the hood, we use [macroable package](https://github.com/poppinss/macroable/tree/next), and you can refer to its README for an in-depth technical explanation.

You can define custom properties inside the Japa entry point file (i.e., `bin/test(.js|.ts)`).

```ts
// title: bin/test.js
import { TestContext } from '@japa/runner/core'

TestContext.macro('sleep', function (milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
})
```

Once you have defined the `sleep` method, you can access it as follows within your tests.

```ts
test('add two numbers', ({ sleep }) => {
  await sleep(4000)
})
```

### Defining TypeScript types
If you use TypeScript, you must notify its compiler about the newly added property using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

Again, you may write the following code within the Japa entry point file.

```ts
declare module '@japa/runner/core' {
  interface TestContext {
    sleep(milliseconds: number): Promise<void>
  }
}
```
