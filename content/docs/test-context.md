---
title: Test Context
description: Test Context in Japa is used to share/pass data to the test. Context can be extended to add custom properties as well.
ogImage: test-context.jpeg
---

# Test Context

An instance of [Test Context class](https://github.com/japa/runner/blob/develop/src/Core/index.ts#L19) is shared every Japa test. Therefore, you can access it as the first argument within the test callback.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'

test('add two numbers', (ctx) => {
  console.log(ctx)
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')

test('add two numbers', (ctx) => {
  console.log(ctx)
})
```
:::

![](inspect-test-context.png)

The goal of the test context is to share/pass data to the test. So, for example, the `@japa/assert` package adds the `assert` property to the context, and the `@japa/expect` package adds the `expect` property.

The context object is isolated between tests; hence you can safely assume that properties/mutations from one test context will not leak to other tests.

## Extending context

The Test Context class is extensible by nature. You can use the Macros and Getters to add custom properties to it.

:::note
You can write the code for extending the context within the `bin/test.js` file or create a new file and import it inside the `bin/test.js` file.
:::

### Getters

A getter accepts the property name as the first argument and a callback function that returns the value for the property.

:::languageSwitcher
```ts
// title: ESM
import { TestContext } from '@japa/runner'

TestContext.getter('foo', function () {
  return 'bar'
})
```

```ts
// title: CommonJS
const { TestContext } = require('@japa/runner')

TestContext.getter('foo', function () {
  return 'bar'
})
```
:::

Once defined, you can access the getter as follows.

```ts
test('add two numbers', (ctx) => {
  console.log(ctx.foo) // logs 'bar'
})
```

By default, the callback is called every time the property is accessed. However, you can also create singleton getters by passing a third argument.

```ts
TestContext.getter('foo', function () {
  return 'bar'
}, true) // 👈 singleton
```

The `this` property inside the callback is scoped to the instance of the test context.

```ts
TestContext.getter('foo', function () {
  console.log(this instanceof TestContext) // true
})
```

### Macros

A macro also accepts the property name as the first argument, followed by the value. The value can be a literal or a function. For example:

```ts
TestContext.macro('getTime', function () {
  return new Date().getTime()
})

TestContext.macro('nodeVersion', process.version)
```

```ts
// Access as a function
ctx.getTime()

// Access as a property
ctx.nodeVersion
```


### Usage with TypeScript

Since getters and macros are added at runtime, you must inform the TypeScript compiler about these new properties separately. 

You can make use of [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to define these properties.

Create a new file, `bin/japa_types.ts`, and paste the following code inside it.

```ts
declare module '@japa/runner' {
    
  // Interface must match the class name
  interface TestContext {
    getTime(): number
    nodeVersion: string
    foo: { foo: boolean }
  }

}
```

