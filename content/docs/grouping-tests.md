---
title: Grouping tests
description: Use groups to define lifecycle hooks and bulk configure tests
ogImage: grouping-tests.jpeg
---

# Grouping tests

You can create a group of tests using the `test.group` method. It accepts the **group title** as the first argument and a **callback function** to define tests within the group's scope.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'

test.group('Maths.add', (group) => {
  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')

test.group('Maths.add', (group) => {
  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```
:::

The callback is given an instance of the [Group class](https://github.com/japa/core/blob/develop/src/Group/index.ts) as the first argument. You can access it to configure the group or tests within the group.

In the following example, we define a timeout for all the tests using the `group.each.timeout` method.

```ts
test.group('Maths.add', (group) => {
  group.each.timeout(6000) // 👈 set timeout on all tests

  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

The `group.each` property has the following available methods.

- `timeout`: Define the timeout for all the tests defined within the group.
- `disableTimeout`: Disable the timeout for all the tests defined within the group.
- `setup`: Register a setup hook for all the tests.
- `teardown`: Register a teardown hook for all the tests.
- `retry`: Define retries for all the tests.

## Tap into tests

You can use the `group.tap` method to access the underlying test class instance for all the group tests. This is usually helpful when you want to configure individual tests.

#### Assign tags to all the tests

```ts
test.group('Maths.add', (group) => {
  group.tap((test) => test.tags(['@maths']))

  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

#### Conditionally skip tests

```ts
test.group('Maths.add', (group) => {
  group.tap((test) => {
    if (test.title.includes('slow:')) {
      test.skip()
    }
  })

  test('add two values', ({ assert }) => {
  })

  test('slow: calculate sqrt', ({ assert }) => {
  })
})
```

## Hooks

You can register the `setup` and the `teardown` hooks on the group to run before and after the tests. [Learn more about hooks](./lifecycle-hooks.md)

```ts
test.group('Maths.add', (group) => {
  group.setup(() => {
    console.log('before all the tests')
  })

  group.teardown(() => {
    console.log('after all the tests')
  })

  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

## Can I create nested groups?

The short answer is No. Let's also discuss the reasoning behind keeping the test groups flat.

In Japa, we treat groups as a way to bulk configure tests. For example, you can use a group to define the **timeout**, **hooks**, and **may be tags** for all tests.

Once you start nesting groups, it becomes harder to track which layer is adding properties to the tests and in which order the properties are applied.

ON THE SAME, Kent C. Dodds has written a [great in-depth article](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing). I highly recommend you to give it a read. 

### But, I use groups as a way to organize my tests.

I can share a personal strategy I use to structure my tests. Instead of relying on nested groups to create a structure, you can opt for nested sub-directories.

:::caption{for="error"}
Instead of using groups
:::

```ts
test.group('Products service', () => {
  test.group('Add new product', () => {
    test('save product as a draft', () => {
    })
  })
})
```

:::caption{for="success"}
You can make use of sub-directories
:::

```
├── tests
│   └── products
│       └── add.spec.js
```
