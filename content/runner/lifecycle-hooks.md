---
title: Lifecycle hooks
description: Use lifecycle hooks
ogImage: lifecycle-hooks.jpeg
---

# Lifecycle Hooks

Lifecycle hooks are the actions you can run before/after a test or a group. Hooks in Japa are registered using the `setup` and the `teardown` methods.

- The `setup` hooks are called before the action.
- The `teardown` hooks are called after the action.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'

test('add two numbers', () => {
  console.log('executed in the test')
})
.setup(() => {
  console.log('executed before the test')
})
.teardown(() => {
  console.log('executed after the test')
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')

test('add two numbers', () => {
  console.log('executed in the test')
})
.setup(() => {
  console.log('executed before the test')
})
.teardown(() => {
  console.log('executed after the test')
})
```
:::

If you run the above test, you will see the following output in the console.

```
executed before the test
executed in the test
executed after the test
```

## Using groups

Defining hooks on every single test is not practical. Therefore, you can wrap your tests inside a group and use the `group.each.setup` and `group.each.teardown` methods.

In the following example, the hooks will be defined on all the tests inside the group.

```ts
test.group('Maths.add', (group) => {
  group.each.setup(() => {
    console.log('executed before the test')
  })

  group.each.teardown(() => {
    console.log('executed after the test')
  })

  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

### Group lifecycle hooks
Similar to tests, groups can also have lifecycle hooks. The hooks defined on a group will run **before and after all the tests**.

```ts
test.group('Maths.add', (group) => {
  group.setup(() => {
    console.log('executed before all the test')
  })

  group.teardown(() => {
    console.log('executed after all the test')
  })
  
  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

If you run the above group tests, you will see the following output in the console.

```
executed before all the test

TEST 1 - executed in the test
TEST 2 - executed in the test

executed after all the test
```

## Cleanup functions

Japa allows you to return cleanup functions from your hooks. The sole purpose of a cleanup function is to clear the state created by the hook.

In the following example, we use the `setup` hook to create a browser instance and assign it to the test context.

Also, we return a cleanup function that Japa will call after the test to close the browser.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'
import { chromium } from 'playwright'

test.group('Maths.add', (group) => {
  group.each.setup(async (t) => {
    t.context.browser = await chromium.launch()

    //👇 Cleanup function
    return async () => {
      await t.context.browser.close()
    } 
  })

  test('visit google.com', ({ browser }) => {
    // use browser
  })
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')
const { chromium } = require('playwright')

test.group('Maths.add', (group) => {
  group.each.setup(async (t) => {
    t.context.browser = await chromium.launch()

    //👇 Cleanup function
    return async () => {
      await t.context.browser.close()
    } 
  })

  test('visit google.com', ({ browser }) => {
    // use browser
  })
})
```
:::

**Wait, shouldn't I be using the teardown hook to close the browser?**

Allow me to answer this question in the following screencast by making a small comparison between Jest and Japa lifecycle hooks.

## Test flow with hooks

:img{src="https://res.cloudinary.com/adonis-js/image/upload/v1644228251/japa/Japa-Flow_zmnvyk.png" boxed="true"}


## Group flow with hooks

:img{src="https://res.cloudinary.com/adonis-js/image/upload/v1644228251/japa/Japa-Flow_Group_elt0rd.png" boxed="true"}
