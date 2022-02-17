# Suite class

The [Suite class](https://github.com/japa/core/blob/develop/src/Suite/index.ts) exposes the API to create a test suite of groups and tests. Think of **unit testing** or **functional testing** as an independent test suite. 

You can create a new instance of the suite class as follows.

```ts
import { Suite, Emitter } from '@japa/core'

const emitter = new Emitter()

const unitTests = new Suite('unit', emitter)
```

A suite needs the following constructor arguments.

- `name`: The name for the suite.
- `emitter`: A global instance of the Emitter. Make sure you use only one emitter instance throughout the complete cycle of running tests.

## add

Add a group or a test to the suite. If a test is added to a group, then there is no need to add it to the suite.

However, you can add top-level tests to the suite without adding them to the group.

#### Test added to the group

```ts
const test = new Test(title, getContext, emitter, refiner)

/**
 * Adding test to the group
 */
const group = new Group('Math.add', emitter, refiner)
group.add(test)

/**
 * Then just add the group to the suite
 */
suite.add(group)
```

#### Test added to the suite

```ts
const test = new Test(title, getContext, emitter, refiner)
suite.add(test)
```

## onTest

Tap into the tests as they are added to the suite. Remember, this method is called only for the top-level tests added to the suite, not the tests inside a group.

```ts
suite.onTest((test) => {
  test.tags(['@unit'])
})
```

## onGroup

Tap into the groups as they are added to the suite.

```ts
suite.onGroup((group) => {
  group.tap((test) => {
    test.tags(['@unit'])
  })
})
```

## setup

Define the setup hook for the suite.

```ts
suite.setup(() => {
 // called before all the tests and groups
})
```

## teardown

Define the teardown hook for the suite.

```ts
suite.teardown(() => {
 // called after all the tests and groups
})
```

## exec

Execute the suite. Ideally, you will not call this method directly, as the test runner will call it.

```ts
await suite.exec()
```

## stack

A reference to the array of tests and groups added to the suite.

```ts
console.log(suite.stack)
```
