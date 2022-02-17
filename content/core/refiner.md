# Refiner

The [Refiner class](https://github.com/japa/core/blob/develop/src/Refiner/index.ts) exposes the API to filter tests by the **test title**, **group title**, **tags**, or **pinning the tests**.

You can create an instance of the Refiner as follows.

```ts
import {
 Refiner,
} from '@japa/core'

const refiner = new Refiner({})
```

The refiner class instance accepts the filters config as the only argument.

```ts
new Refiner({
  tags?: string[]
  groups?: string[]
  tests?: string[]
}) 
```

- `tags`: Define an array of tags to run tests with the mentioned tags.
- `groups`: Define an array of group titles to run tests within the mentioned groups. The group title will win over the tags when groups and tags are defined.
- `tests`: An array of test titles to run specific tests. The test title will win over the tags when tests and tags are defined.


## Refiner filtering layers

The following filtering layers are applied to the groups and the tests.

### Filtering groups

Groups are filtered only using the group title. So, for example, only the tests for the **group 1** will run in the following example.

```ts
new Group('group 1', ...otherArgs)
new Group('group 2', ...otherArgs)
```

```ts
{
  groups: ['group 1']
}
```

### Filtering tests

The tests can be filtered by the **test title**, **test tags**, or by **pinning tests**.

The filters are applied in the following order.

1. First, the tests are filtered by the test title (topmost priority).
2. The tags filter is applied to the output from the first layer.
3. Finally, the pinned tests within the filtered subset are executed.

## pinTest

Pin a test by passing the test instance. The test class invokes the method internally when the `test.pin()` method is called.

```ts
refiner.pinTest(test)
```

## add

Add a filter for a given layer. The layer can be either `test`, `group`, or `tags`.

```ts
refiner.add('tests', ['test 1'])
refiner.add('tags', ['@slow', '@io'])
refiner.add('groups', ['group 1', 'group 2'])
```

## allows

Find if a test or a group should be executed considering the applied filters.

The `group` and `test` classes internally use the `refiner.allows` method to find if the test or group should be executed.

```ts
if (refiner.allows(test)) {
  // execute test
}

if (refiner.allows(group)) {
  // execute group
} 
```
