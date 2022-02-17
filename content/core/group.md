# Group class

The [Group class](https://github.com/japa/core/blob/develop/src/Group/index.ts) exposes the API to create a group of tests and bulk configure them.

You can create a new instance of the group class as follows.

```ts
import { Group, Emitter, Refiner } from '@japa/core'

const emitter = new Emitter()
const refiner = new Refiner({})  

const group = new Group('Math.add', emitter, refiner)
```

A group needs the following constructor arguments.

- `title`: The title for the group. The developer writing the tests will usually supply the group title.
- `emitter`: A global instance of the Emitter. Make sure you use only one emitter instance throughout the complete cycle of running tests.
- `refiner`: A global instance of the Refiner class. The refiner is used to cherry-pick tests and groups to run specific tests only.

## add

The `add` method allows you to add a test to the group.

```ts
const test = new Test(title, getContext, emitter, refiner)

group.add(test)
```

## tap

The `tap` method allows you to access tests added to the group. The `tap` method must be called before calling the `add` method.

All tests will have the `@slow` tag in the following example.

```ts
group.tap((test) => {
  test.tags(['@slow'])
})

group.add(test)
```

## setup

Define the setup hook for the group.

```ts
group.setup(() => {
  // called before all the tests inside the group
})
```

## teardown

Define the teardown hook for the group.

```ts
group.teardown(() => {
  // called after all the tests inside the group
})
```

## exec

Execute all the tests inside the group. Ideally, you will not call this method manually, as the tests runner class invokes it.

```ts
await group.exec()
```

## each.setup

Define the setup hook for all the tests inside the group. Remember to call this method before adding the tests to the group.

```ts
group.each.setup(async () => {
 // called before each test
})

group.add(test)
```

## each.teardown

Define the teardown hook for all the tests inside the group. Remember to call this method before adding the tests to the group.

```ts
group.each.teardown(async () => {
 // called after each test
})

group.add(test)
```

## each.timeout

Define the timeout for all the tests inside the group. Consider this method as a shorthand for using the `tap` method.

```ts
group.each.timeout(0)

group.add(test)
```

## each.disableTimeout

Disable timeouts for all the tests inside the group. Consider this method as a shorthand for using the `tap` method.

```ts
group.each.disableTimeout()

group.add(test)
```


## each.retry

Define the retries for all the tests inside the group. Consider this method as a shorthand for using the `tap` method.

```ts
group.each.retry(3)

group.add(test)
```

## tests

A reference to the array of tests added to the group.

```ts
console.log(group.tests)
```
