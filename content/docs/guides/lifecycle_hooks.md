# Lifecycle Hooks

Lifecycle hooks are the actions you can run before/after a test or a group. Hooks in Japa are registered using the `setup` and the `teardown` methods.

- The `setup` hooks are called before the action.
- The `teardown` hooks are called after the action.

```ts
import { test } from '@japa/runner'

test('add two numbers', () => {
  console.log('executed in the test')
})
// highlight-start
.setup(() => {
  console.log('executed before the test')
})
.teardown(() => {
  console.log('executed after the test')
})
// highlight-end
```

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

For example, if you create database tables inside the `setup` hook, you can use the cleanup function to delete those tables.

```ts
import { test } from '@japa/runner'

test.group('Users.create', (group) => {
  group.each.setup(async () => {
    await createTables()
    // 👇 Cleanup function
    return async () => await dropTables()
  })

  test('create a new user', () => {
  })
})
```

### Wait, shouldn't I use the `teardown` hook to drop tables?
Teardown hooks in Japa are meant to run standalone functions after a test. Whereas the `cleanup` functions are intended to clean up the state created by the setup function.

In the following example, the first hook raises an exception, and as a result, the second hook is never executed.

Since there is no way for Japa to know which teardown hook belongs to which setup hook, it will run all of them, and also, the teardown will fail because we are trying to call the `close` method on **undefined variable `browser`**.

```ts
test.group('Users.create', (group) => {
  let browser = null

  group.each.setup(async () => {
    throw new Error('This hook failed due to some reason')
  })

  group.each.setup(async () => {
    browser = await chromium.launch()
  })

  group.each.teardown(async () => {
    browser.close()
  })

  test('create a new user', () => {
  })
})
```

Now, let's rewrite the same code using the cleanup function. In the following example, the first setup hook throws an exception. As a result, the second setup hook is never executed; therefore, its cleanup function will also not be executed.

```ts
test.group('Users.create', (group) => {
  let browser = null

  group.each.setup(async () => {
    throw new Error('This hook failed due to some reason')
  })

  group.each.setup(async () => {
    browser = await chromium.launch()
    return () => browser.close()
  })

  test('create a new user', () => {
  })
})
```

As a general principle, you should always use cleanup functions when destroying the state created by the setup hook.

## Test hooks parameters
The test lifecycle hooks receive an instance of the [Test class](https://github.com/japa/core/blob/develop/src/test/main.ts) as the only argument.

```ts
test.group((group) => {
  // highlight-start
  group.each.setup((test) => {
  // highlight-end
  })

  // highlight-start
  group.each.teardown((test) => {
  // highlight-end
  })
})
```

The cleanup functions receive a total of two arguments. The first is a boolean to know if the underlying test has failed, and the second is an instance of the test class.

```ts
test.group((group) => {
  group.each.setup(() => {
    // highlight-start
    return (hasError, test) => {
    }
    // highlight-end
  })
})
```

## Group hooks parameters
The group lifecycle hooks receive an instance of the [Group class](https://github.com/japa/core/blob/develop/src/group/main.ts) as the only argument.

```ts
test.group((group) => {
  group.setup((self) => {
    console.log(self === group)
  })

  group.teardown((self) => {
    console.log(self === group)
  })
})
```

The cleanup functions receive a total of two arguments. The first is a boolean to know if the underlying group has failed, and the second is an instance of the group class.

```ts
test.group((group) => {
  group.setup(() => {
    // highlight-start
    return (hasError, self) => {
    }
    // highlight-end
  })
})
```

## Test flow with hooks

<div class="media_box">

![](./test-flow.png)

</div>


## Group flow with hooks

<div class="media_box">

![](./group-flow.png)

</div>
