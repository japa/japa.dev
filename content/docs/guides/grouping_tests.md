# Grouping tests

You may group a collection of tests using the `test.group` method. 

The `test.group` method accepts the group title as the first parameter and a callback function as the second parameter. The callback function receives an instance of the [TestGroup](https://github.com/japa/core/blob/develop/src/group/main.ts) class.

```ts
import { test } from '@japa/runner'

test.group('Maths.add', (group) => {
  test('add two numbers', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
```

You may use the `group` object to bulk configure tests that are part of the surrounded group. In the following example, we define the `timeout`, after which a test will be marked as failed if not completed.

```ts
import { test } from '@japa/runner'

test.group('register user', (group) => {
  // highlight-start
  group.each.timeout(1000 * 60)
  // highlight-end

  test('create a new user', async ({ assert }) => {
  })
})
``` 

## Defining lifecycle hooks

You may define lifecycle hooks for individual or all the tests using the `group` object. 

In the following example, we define a lifecycle hook using the `each.setup` method to create database tables before every test and remove them afterward.

See also: [Lifecycle hooks](./lifecycle_hooks.md)

```ts
import { test } from '@japa/runner'

test.group('register user', (group) => {
  // highlight-start
  group.each.setup(async () => {
    await createTables()
    return () => dropTables()
  })
  // highlight-end

  test('create a new user', async ({ assert }) => {
  })
})
```

## Tapping into tests

You may use the `test.tap` method to access the underlying test object for each test defined within the group. 

This method opens possibilities for bulk/conditionally configuring tests. For example, prefixing the test titles with the `it` keyword.

```ts
import { test } from '@japa/runner'

test.group('polls list', (group) => {
  // highlight-start
  group.tap((t) => {
    t.options.title = `it ${t.options.title}`
  })
  // highlight-end

  test('shows list of public polls', () => {
  })

  test('shows list of participating polls', () => {
  })

  test('shows list of authored polls', () => {
  })
})
```

```sh
node bin/test.js
```

```
// title: Output
functional / polls list (tests/functional/polls/list/logged_in.spec.js)
  ✔ it shows list of public polls (0.53ms)
  ✔ it shows list of participating polls (0.04ms)
  ✔ it shows list of authored polls (0.04ms)
```

## Can I write nested groups?

Japa does not allow the creating nested groups. We made this opinionated design choice when creating Japa, and let us share that with you.

### Use folders over groups for organization 

A common use case for nested groups is organization of tests. For example:

- You might want to create a top-level group for **users** tests.
    - A nested group to **list all users**.
    - A nested group to **create a new user**
        - Another level of nesting to **create a new user as admin**
        - A sibling group to **create a new user via registration form**

The same level of organization can be achieved through nested files and folders. In fact, creating nested folders [offers better filtering capabilities](./filtering_tests.md#organize-using-folders) and makes it easy to visualize the depth of your tests by looking at the folder structure. 

### Prefer duplication over wrong abstractions 

Another use-case for nested groups is to use layers of lifecycle hooks and avoid duplication at all costs. For example, creating some state in a top-level group so that you do not have to redefine it in every group.

```ts
let user

test.group('A top level group', (group) => {
  group.setup(() => {
    user = await getUserForTesting()
  })
  
  test.group('a nested group', () => {
    test.group('another level of testing', () => {
      test('use the user in the test', () => {
        console.log(user)
      })
    })
  })
})
```

While writing the code to get the user in just one place sounds good in theory, it can be problematic when you have long test files and want to track every usage of the `user` variable to ensure that you are not overwriting it somewhere in between.

Kent C. Dodds has written a great article titled ["Avoid Nesting when you're Testing"](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing), touching on the topic of nested test groups. We recommend reading it through.
