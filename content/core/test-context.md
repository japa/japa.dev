# Tests Context

Test context is an object passed to the test implementation function. The context can hold any properties you want to give to the test.

Even though you can pass a plain object as a context, using the [TestContext class](https://github.com/japa/core/blob/next/src/TestContext/index.ts) is recommended, since it is extensible using macros and getters.

```ts
import { TestContext, Test, Emitter, Refiner } from '@japa/core'

// highlight-start
function getContext() {
  return new TestContext() 
}
// highlight-end

const emitter = new Emitter()
const refiner = new Refiner({})

const test = new Test(title, getContext, emitter, refiner)
```

## Extending the Test Context

You can extend the TestContext using macros and getters.

```ts
import { Assert } from '@japa/assert'

TestContext.getter('assert', function () {
  return new Assert()
}, true)
```

Since the `assert` property is added at the runtime, you will have to use [TypeScript module augmentation ](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to extend it statically.
