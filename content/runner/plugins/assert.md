---
title: Assert
description: Assertion plugin built on top of Chai.js assert package.
ogImage: assert-plugin.jpeg
---

# Assert

The Assert plugin of Japa is built on top of [Chai.js assert](https://www.chaijs.com/api/assert/) package. However, it is not an exact copy of chai, and therefore we recommend you to consult the API documented in this guide.

Suppose you have not configured the plugin during the initial setup. Then, you can install it from the npm registry as follows.

```sh
npm i -D @japa/assert
```

And register it as a plugin within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { assert } from '@japa/assert'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [assert()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { assert } = require('@japa/assert')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [assert()]
    // highlight-end
  }
})
```
:::

Once done. You can access the `assert` property from the [Test context](../test-context.md) as follows.

```ts
test('add two numbers', ({ assert }) => {
  assert.equal(2 + 2, 4)
})
```

## Open API testing
Using this plugin, you can test HTTP responses against one or more open API schemas. Just make sure to register the path to schema files when using the plugin.

```ts
const config = {
  openApi: {
    schema: [join(__dirname, '..', './api-schema.json')]
  }
}

configure({
  plugins: [
    assert(config) // 👈 register config
  ]
})
```

Once done, you can test response objects from `axios`, `superagent`, `supertest`, `request`, and `light-my-request` libraries using the following method.

```ts
test('get /users', async ({ assert }) => {
  const response = await supertest(baseUrl).get('/')
  assert.isValidApiResponse(response)
})
```

The response is validated as follows:

- An error is raised if the request path is not documented in the API schema file.
- An error is raised if the response status code is not documented in the API schema file.
- An error is raised if the body properties are not the same as expected by the schema. Use the `required` array to validate required response properties.
- The response status code is used to find the body schema for validation.
- Response headers are also validated against the expected headers mentioned inside the API schema file.

## assert

Assert an expression to be truthy. Then, optionally define the error message.

```ts
assert(isTrue(foo))
assert(foo === 'bar')
assert(age > 18, 'Not allowed to enter the club')
```

## equal

Assert two values are equal but not strictly. The comparison is the same as `foo == bar`.

- See [strictEqual](#strictequal) for strict equality.
- See [deepEqual](#deepequal) for comparing objects and arrays.

```ts
assert.equal(3, 3) // passes
assert.equal(3, '3') // passes
assert.equal(Symbol.for('foo'), Symbol.for('foo')) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |

## notEqual
Assert two values are not equal. The comparison is the same as `foo != bar`.

- See [notStrictEqual](#notstrictequal) for strict inequality.
- See [notDeepEqual](#notdeepequal) for comparing objects and arrays.

```ts
assert.notEqual(3, 2) // passes
assert.notEqual(3, '2') // passes
assert.notEqual(Symbol.for('foo'), Symbol.for('bar')) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |

## strictEqual
Assert two values are strictly equal. The comparison is same as `foo === bar`.

- See [equal](#equal) for non-strict equality.
- See [deepEqual](#deepequal) for comparing objects and arrays.

```ts
assert.strictEqual(3, 3) // passes
assert.strictEqual(3, '3') // fails
assert.strictEqual(Symbol.for('foo'), Symbol.for('foo')) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |

## notStrictEqual
Assert two values are not strictly equal. The comparison is same as `foo !== bar`.

```ts
assert.notStrictEqual(3, 2) // passes
assert.notStrictEqual(3, '2') // fails
assert.notStrictEqual(Symbol.for('foo'), Symbol.for('bar')) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |

## deepEqual

Assert two values are deeply equal. The order of items in an array should be the same for the assertion to pass.

```ts
assert.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // passes
assert.deepEqual({ b: 2, a: 1 }, { a: 1, b: 2 }) // passes
assert.deepEqual([1, 2], [1, 2]) // passes
assert.deepEqual([1, 2], [2, 1]) // fails
assert.deepEqual(/a/, /a/) // passes
assert.deepEqual(
  new Date('2020 01 22'),
  new Date('2020 01 22')
) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` | 
| `message?` | `string` |

## notDeepEqual
Assert two values are not deeply equal.

```ts
assert.notDeepEqual({ a: 1, b: 2 }, { a: 1, b: '2' }) // passes
assert.notDeepEqual([1, 2], [2, 1]) // passes
assert.notDeepEqual(
  new Date('2020 01 22'),
  new Date('2020 01 23')
) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |

## rejects
Assert the function to reject the promise. Optionally, you can assert
the rejection is from a particular class or has a specific message.

```ts
await assert.rejects(() => {
  throw new Error('')
}) // passes

await assert.rejects(() => {
  async () => throw new HttpError('Resource not found')
}, HttpError) // passes

await assert.rejects(() => {
  async () => throw new HttpError('Resource not found')
}, 'Resource not found') // passes
```

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` \| `Promise`<`void`\> |
| `errType` | `RegExp` \| `ErrorConstructor` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` \| `Promise`<`void`\> |
| `constructor` | `ErrorConstructor` |
| `regExp` | `string` \| `RegExp` |
| `message?` | `string` |

## doesNotRejects
Assert the function does not reject the promise. Optionally, you can assert the rejection is not from a specific class or have a particular message.

```ts
await assert.doesNotRejects(async () => {
  throw new Error('foo')
}, HttpError) // passes: Error !== HttpError

await assert.doesNotRejects(
  async () => {
    throw new HttpError('Resource not found')
  }, 
  'Server not available'
) // passes: Resource not found !== Server not available

await assert.doesNotRejects(async () => {
  return 'foo'
}) // passes
```

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` \| `Promise`<`void`\> |
| `errType` | `RegExp` \| `ErrorConstructor` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` \| `Promise`<`void`\> |
| `constructor` | `ErrorConstructor` |
| `regExp` | `string` \| `RegExp` |
| `message?` | `string` |

## throws
Expect the function to throw an exception. Optionally, you can assert
for the exception class or message.

- See [rejects](#rejects) for async function calls.

```ts
function foo() { throw new Error('blow up') }

assert.throws(foo) // passes
assert.throws(foo, Error) // passes
assert.throws(foo, 'blow up') // passes
assert.throws(foo, 'failed') // fails
```

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `errType` | `RegExp` \| `ErrorConstructor` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `constructor` | `ErrorConstructor` |
| `regExp` | `string` \| `RegExp` |
| `message?` | `string` |

## doesNotThrows
Expect the function not to throw an exception. Optionally, you can assert
the exception is not from a particular class or has a specific message.

- See [doesNotRejects](#doesnotrejects) for async function calls.

```ts
function foo() { throw new Error('blow up') }

assert.doesNotThrows(foo) // fails
assert.doesNotThrows(foo, 'failed') // passes
assert.doesNotThrows(() => {}) // passes
```

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `regExp` | `RegExp` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `constructor` | `ErrorConstructor` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `fn` | () => `void` |
| `constructor` | `ErrorConstructor` |
| `regExp` | `string` \| `RegExp` |
| `message?` | `string` |

## lengthOf
Assert the length of an array, map, or set to match the expected value

```ts
assert.lengthOf([1, 2, 3], 3)
assert.lengthOf(new Map([[1],[2]]), 2)
assert.lengthOf('hello world', 11)
```

| Name | Type |
| :------ | :------ |
| `object` | `Array` |
| `length` | `number` |
| `message?` | `string` |

## empty/isEmpty
Assert value to be empty.

```ts
assert.empty([]) // passes
assert.empty('') // passes

assert.isEmpty([]) // passes
assert.isEmpty('') // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## notEmpty/isNotEmpty
Assert value to not be empty.

```ts
assert.notEmpty([1, 2]) // passes
assert.notEmpty({ foo: 'bar' }) // passes
assert.notEmpty('hello') // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## exists
Asserts the value is not `null` or `undefined`.

```ts
assert.exists(false) // passes
assert.exists(0) // passes
assert.exists('') // passes
assert.exists(null) // fails
assert.exists(undefined) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## notExists
Asserts the value is `null` or `undefined`.

```ts
assert.notExists(null) // passes
assert.notExists(undefined) // passes
assert.notExists('') // fails
assert.notExists(false) // fails
assert.notExists(0) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## include
Assert the collection includes an item. Works for strings, arrays, and objects.

- See [deepInclude](#deepinclude) for deep comparsion.

```ts
assert.include(
  { id: 1, name: 'virk' },
  { name: 'virk' }
) // passes

assert.include([1, 2, 3], 2) // passes
assert.include('hello world', 'hello') // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `Partial<haystack>` |
| `message?` | `string` |

## notInclude

Assert the collection NOT to include an item. Works for strings,
arrays and objects.

- See [notDeepInclude](#notdeepinclude) for nested object properties.

```ts
assert.include(
  { id: 1, name: 'virk' },
  { name: 'virk' }
) // passes

assert.include([1, 2, 3], 2) // passes
assert.include('hello world', 'hello') // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `Partial<haystack>` |
| `message?` | `string` |

## deepInclude
Assert the collection includes an item. Works for strings, arrays, and objects.

```ts
assert.deepInclude(
  { foo: { a: 1 }, bar: { b: 2 } },
  { foo: { a: 1 } }
) // passes

assert.deepInclude([1, [2], 3], [2]) // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `Partial<haystack>` |
| `message?` | `string` |

## notDeepInclude
Assert the collection NOT to include an item. Works for strings, arrays, and objects.

```ts
assert.notDeepInclude(
  { foo: { a: 1 }, bar: { b: 2 } },
  { foo: { a: 4 } }
) // passes

assert.deepInclude([1, [2], 3], [20]) // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `Partial<haystack>` |
| `message?` | `string` |

## instanceOf
Assert value to be an instance of the expected class.

```ts
assert.instanceOf(new User(), User) // passes
assert.instanceOf(new User(), Function) // fails

class User extends BaseUser {}
assert.instanceOf(new User(), BaseUser) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `constructor` | `Function` |
| `message?` | `string` |

## notInstanceOf
Assert value NOT to be an instance of the expected class.

```ts
assert.notInstanceOf(new User(), Function) // passes
assert.notInstanceOf(new User(), User) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `constructor` | `Function` |
| `message?` | `string` |

## ok/isOk
Assert the value is truthy.

```ts
assert.ok({ hello: 'world' }) // passes
assert.ok(null) // fails

assert.isOk({ hello: 'world' }) // passes
assert.isOk(null) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## notOk/isNotOk
Assert the value is falsy.

```ts
assert.notOk({ hello: 'world' }) // fails
assert.notOk(null) // passes

assert.isNotOk({ hello: 'world' }) // fails
assert.isNotOk(null) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## properties
Assert the object has all of the expected properties.

```ts
assert.properties(
  { username: 'virk', age: 22, id: 1 },
  ['id', 'age']
) // passes

assert.properties(
  { username: 'virk', id: 1 },
  ['id', 'age']
) // fails: "age" is missing
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `keys` | `string[]` |
| `message?` | `string` |

## notAllProperties
Assert the object not to have all of the mentioned properties.

```ts
assert.notAllProperties(
  { id: 1, name: 'foo' },
  ['id', 'name', 'email']
) // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `keys` | `string[] | Object` |
| `message?` | `string` |

## onlyProperties
Assert the object has only the expected properties. The assertion will fail when the object contains properties not mentioned in the keys array.

```ts
assert.onlyProperties(
  { username: 'virk', age: 22, id: 1 },
  ['id', 'name', 'age']
) // passes

assert.onlyProperties(
  { username: 'virk', age: 22, id: 1 },
  ['id', 'name']
) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `keys` | `string[]` |
| `message?` | `string` |

## notAnyProperties
Assert the object not to have any of the mentioned properties.

```ts
assert.notAnyProperties(
  { id: 1, name: 'foo' },
  ['email', 'age']
) // passes

assert.notAnyProperties(
  { id: 1, name: 'foo' },
  ['email', 'id']
) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `keys` | `string[] | Object` |
| `message?` | `string` |

## property
Assert an object to contain a property.

```ts
assert.property(
  { id: 1, username: 'virk' },
  'id'
) // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `property` | `string` |
| `message?` | `string` |

## notProperty
Assert an object NOT to contain a property.

```ts
assert.notProperty(
  { id: 1, username: 'virk' },
  'email'
) // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `property` | `string` |
| `message?` | `string` |

## propertyVal
Assert an object property to match the expected value.

- Use [deepPropertyVal](#deeppropertyval) for deep comparing the value.

```ts
assert.propertyVal(
  { id: 1, username: 'virk' },
  'id',
  1
) // passes

assert.propertyVal(
  { user: { id: 1 } },
  'user',
  { id: 1 }
) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `property` | `string` |
| `value` | `any` |
| `message?` | `string` |


## notPropertyVal
Assert an object property NOT to match the expected value.

- Use [notDeepPropertyVal](#notdeeppropertyval) for deep comparing the value.

```ts
assert.notPropertyVal(
  { id: 1, username: 'virk' },
  'id',
  22
) // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `property` | `string` |
| `value` | `any` |
| `message?` | `string` |

## deepPropertyVal
Assert an object property to match the expected value deeply.

```ts
assert.deepPropertyVal(
  { user: { id: 1 } },
  'user',
  { id: 1 }
) // passes
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `property` | `string` |
| `value` | `any` |
| `message?` | `string` |

## notDeepPropertyVal

Assert an object property NOT deeply to match the expected value

```ts
assert.notDeepPropertyVal(
  { user: { id: 1 } },
  'user',
  { email: 'foo@bar.com' }
) // passes
```

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `property` | `string` |
| `value` | `any` |
| `message?` | `string` |


## includeMembers
Assert the expected array is a subset of a given collection. The values comparison is the same as the `assert.equal` method.

- Use [includeDeepMembers](#includedeepmembers) for deep comparsion.

```ts
assert.includeMembers([1, 2, 4, 5], [1, 2]) // passes
assert.includeMembers([1, 2, 4, 5], [1, 3]) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## notIncludeMembers

Assert the expected array is NOT a subset of a given collection. The values comparison is the same as the `assert.notEqual` method.

- Use [notIncludeDeepMembers](#notincludedeepmembers) for deep comparsion.

```ts
assert.notIncludeMembers([1, 2, 4, 5], [1, 3]) // passes
assert.notIncludeMembers([1, 2, 4, 5], [1, 2]) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## includeDeepMembers
Assert the expected array is a subset of a given array. The values comparison is the same as the `assert.deepEqual` method.

```ts
assert.includeDeepMembers(
  [{ id: 1 }, { id: 2 }],
  [{ id: 2 }]
) // passes

assert.includeDeepMembers(
  [{ id: 1 }, { id: 2 }],
  [{ id: 3 }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## notIncludeDeepMembers

Assert the expected array is NOT a subset of a given array. The values comparison is the same as the `assert.notDeepEqual` method.

```ts
assert.notIncludeDeepMembers(
  [{ id: 1 }, { id: 2 }],
  [{ id: 3 }]
) // passes

assert.notIncludeDeepMembers(
  [{ id: 1 }, { id: 2 }],
  [{ id: 2 }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## includeOrderedMembers
Assert the expected array is a subset of a given array and in the same order. The values comparison is the same as the `assert.equal` method.

- Use [includeDeepOrderedMembers](#includedeeporderedmembers) for deep comparsion.

```ts
assert.includeOrderedMembers(
  [1, 2, 4, 5],
  [1, 2, 4]
) // passes

assert.includeOrderedMembers(
  [1, 2, 4, 5],
  [1, 4, 2]
) // fails

assert.includeOrderedMembers(
  [1, 2, 4, 5],
  [1, 2, 5]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## notIncludeOrderedMembers

Assert the expected array is either not a subset of a given array or is not in the same order. The values comparison is the same as the `assert.notEqual` method.

- Use [notIncludeDeepOrderedMembers](#notincludedeeporderedmembers) for deep comparsion.

```ts

assert.notIncludeOrderedMembers(
  [1, 2, 4, 5],
  [1, 4, 2]
) // passes

assert.notIncludeOrderedMembers(
  [1, 2, 4, 5],
  [1, 2, 5]
) // passes

assert.notIncludeOrderedMembers(
  [1, 2, 4, 5],
  [1, 2, 4]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## includeDeepOrderedMembers

Assert the expected array is a subset of a given array and in the same order. The values comparison is the same as the `assert.deepEqual` method.

```ts
assert.includeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 2 }]
) // passes

assert.includeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 4 }]
) // fails

assert.includeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 4 }, { id: 2 }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## notIncludeDeepOrderedMembers
Assert the expected array is either not a subset of a given array or is not in the same order. The values comparison is the same as the `assert.notDeepEqual` method.

```ts
assert.notIncludeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 4 }]
) // passes

assert.notIncludeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 4 }, { id: 2 }]
) // passes

assert.notIncludeDeepOrderedMembers(
  [{ id: 1 }, { id: 2 }, { id: 4 }],
  [{ id: 1 }, { id: 2 }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `superset` | `any[]` |
| `subset` | `any[]` |
| `message?` | `string` |

## sameMembers
Assert two arrays to have the same members. The values comparison
is the same as the `assert.equal` method.

- Use [sameDeepMembers](#samedeepmembers) for deep comparison.

```ts
assert.sameMembers(
  [1, 2, 3],
  [1, 2, 3]
) // passes

assert.sameMembers(
  [1, { id: 1 }, 3],
  [1, { id: 1 }, 3]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## notSameMembers
Assert two arrays NOT to have the same members. The values comparison
is the same as the `assert.notEqual` method.

- Use [notSameDeepMembers](#notsamedeepmembers) for deep comparison.

```ts
assert.notSameMembers(
  [1, { id: 1 }, 3],
  [1, { id: 1 }, 3]
) // passes

assert.notSameMembers(
  [1, 2, 3],
  [1, 2, 3]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## sameDeepMembers
Assert two arrays to have the same members.

```ts
assert.sameDeepMembers(
  [1, 2, 3],
  [1, 2, 3]
) // passes

assert.sameDeepMembers(
  [1, { id: 1 }, 3],
  [1, { id: 1 }, 3]
) // passes
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## notSameDeepMembers
Assert two arrays NOT to have the same members.

```ts
assert.notSameDeepMembers(
  [1, { id: 1 }, 3],
  [1, { id: 2 }, 3]
) // passes
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## sameOrderedMembers

Expect two arrays to have the same members and in the same order. The values comparison is the same as the `assert.equal` method.

- Use [sameDeepOrderedMembers](#samedeeporderedmembers) for deep comparison.

```ts
assert.sameOrderedMembers(
  [1, 2, 3],
  [1, 2, 3]
) // passes

assert.sameOrderedMembers(
  [1, 3, 2],
  [1, 2, 3]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## notSameOrderedMembers
Expect two arrays to either have different members or be in a different order. The values comparison is the same as the `assert.notEqual` method.

- Use [notSameDeepOrderedMembers](#notsamedeeporderedmembers) for deep comparison.

```ts
assert.notSameOrderedMembers(
  [1, 2, 3],
  [1, 2, 3]
) // passes

assert.notSameOrderedMembers(
  [1, 3, 2],
  [1, 2, 3]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## sameDeepOrderedMembers
Expect two arrays to have the same members and in the same order. The values comparison is the same as the `assert.deepEqual` method.

```ts
assert.sameDeepOrderedMembers(
  [1, { id: 1 }, { name: 'virk' }],
  [1, { id: 1 }, { name: 'virk' }]
) // passes

assert.sameDeepOrderedMembers(
  [1, { id: 1 }, { name: 'virk' }],
  [1, { name: 'virk' }, { id: 1 }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## notSameDeepOrderedMembers
Expect two arrays to either have different members or be in a different order. The values comparison is the same as the `assert.notDeepEqual` method.

```ts
assert.notSameDeepOrderedMembers(
  [1, { id: 1 }, { name: 'virk' }],
  [1, { name: 'virk' }, { id: 1 }]
) // passes

assert.notSameDeepOrderedMembers(
  [1, { id: 1 }, { name: 'virk' }],
  [1, { id: 1 }, { name: 'virk' }]
) // fails
```

| Name | Type |
| :------ | :------ |
| `set1` | `any[]` |
| `set2` | `any[]` |
| `message?` | `string` |

## containsSubset
Assert an array or an object to contain a subset of the expected value. Useful for testing API responses.

```ts
assert.containsSubset(
  { id: 1, created_at: Date },
  { id: 1 }
) // passes

assert.containsSubset(
  [
    { id: 1, created_at: Date },
    { id: 2, created_at: Date }
  ],
  [{ id: 1 }, { id: 2 }]
) // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `any` |
| `message?` | `string` |

## notContainsSubset
Assert an array or an object not to contain a subset of the expected
value.

```ts
assert.notContainsSubset(
  { id: 1, created_at: Date },
  { email: 'foo@bar.com' }
) // passes
```

| Name | Type |
| :------ | :------ |
| `haystack` | `any` |
| `needle` | `any` |
| `message?` | `string` |

## oneOf
Assert the value is available in the provided list. This method only works with literal values. 

- See [containsSubset](#containssubset) matching objects and arrays.

```ts
assert.oneOf('foo', ['foo', 'bar', 'baz']) // passes
assert.oneOf('foo', ['bar', 'baz']) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `collection` | `any[]` |
| `message?` | `string` |

## sealed/isSealed
Assert the object is sealed.

```ts
assert.sealed(Object.seal({})) // passes
assert.sealed({}) // fails

assert.isSealed(Object.seal({})) // passes
assert.isSealed({}) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## notSealed/isNotSealed
Assert the object is not sealed.

```ts
assert.notSealed({}) // passes
assert.notSealed(Object.seal({})) // fails

assert.isNotSealed({}) // passes
assert.isNotSealed(Object.seal({})) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## isAbove
Assert if the actual value is above the expected value. Supports `numbers`, `dates` and [luxon datetime object](https://moment.github.io/luxon/api-docs/index.html#datetime).

```ts
assert.isAbove(5, 2) // passes
assert.isAbove(new Date('2020 12 20'), new Date('2020 12 18')) // passes
```

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `Date` |
| `valueToBeAbove` | `Date` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `number` |
| `valueToBeAbove` | `number` |
| `message?` | `string` |

## isBelow
Assert if the actual value is below expected value. `numbers`, `dates` and [luxon datetime object](https://moment.github.io/luxon/api-docs/index.html#datetime).

```ts
assert.isBelow(2, 5) // passes
assert.isBelow(new Date('2020 12 20'), new Date('2020 12 24')) // passes
```

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `Date` |
| `valueToBeBelow` | `Date` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `number` |
| `valueToBeBelow` | `number` |
| `message?` | `string` |

## isAtLeast
Assert if the actual value is above or the same as the expected value. Supports `numbers`, `dates` and [luxon datetime object](https://moment.github.io/luxon/api-docs/index.html#datetime).

```ts
assert.isAtLeast(2, 2) // passes
assert.isAtLeast(new Date('2020 12 20'), new Date('2020 12 20')) // passes
```

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `Date` |
| `valueToBeAtLeast` | `Date` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `number` |
| `valueToBeAtLeast` | `number` |
| `message?` | `string` |

## isAtMost
Assert if the actual value is below or the same as the expected value. `numbers`, `dates` and [luxon datetime object](https://moment.github.io/luxon/api-docs/index.html#datetime).

```ts
assert.isAtMost(2, 2) // passes
assert.isAtMost(new Date('2020 12 20'), new Date('2020 12 20')) // passes
```

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `Date` |
| `valueToBeAtMost` | `Date` |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `valueToCheck` | `number` |
| `valueToBeAtMost` | `number` |
| `message?` | `string` |


## match
Assert the value to match the given regular expression.

```ts
assert.match('foobar', /^foo/) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `regexp` | `RegExp` |
| `message?` | `string` |

## notMatch
Assert the value NOT to match the given regular expression.

```ts
assert.notMatch('foobar', /^foo/) // fails
```

| Name | Type |
| :------ | :------ |
| `expected` | `string` |
| `regexp` | `RegExp` |
| `message?` | `string` |

## typeOf
Assert the typeof value that matches the expected type.

```ts
assert.typeOf({ foo: 'bar' }, 'object') // passes
assert.typeOf(['admin'], 'array') // passes
assert.typeOf(new Date(), 'date') // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `type` | `string` |
| `message?` | `string` |

## notTypeOf
Assert the typeof value is not the same as the expected type.

```ts
assert.notTypeOf({ foo: 'bar' }, 'array') // passes
assert.notTypeOf(['admin'], 'string') // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `type` | `string` |
| `message?` | `string` |

## frozen/isFrozen
Assert the object is frozen.

```ts
assert.frozen(Object.freeze({})) // passes
assert.frozen({}) // fails

assert.isFrozen(Object.freeze({})) // passes
assert.isFrozen({}) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## notFrozen/isNotFrozen
Assert the object is not frozen.

```ts
assert.notFrozen({}) // passes
assert.notFrozen(Object.freeze({})) // fails

assert.isNotFrozen({}) // passes
assert.isNotFrozen(Object.freeze({})) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## isArray
Assert the value to be a valid array

```ts
assert.isArray([]) // passes
assert.isArray({}) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotArray

Assert the value not to be an array

```ts
assert.isNotArray([]) // fails
assert.isNotArray({}) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isBoolean

Assert the value is a boolean.

```ts
assert.isBoolean(true) // passes
assert.isBoolean(false) // passes
assert.isBoolean(1) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotBoolean
Assert the value is anything, but not a boolean.

```ts
assert.isNotBoolean(1) // passes
assert.isNotBoolean(false) // fails
assert.isNotBoolean(true) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isDefined
Asserts the value is anything, but not `undefined`.

```ts
assert.isDefined(undefined) // fails
assert.isDefined(0) // passes
assert.isDefined(false) // passes
assert.isDefined('') // passes
assert.isDefined(null) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isUndefined

Asserts the value is explicitly "undefined."

```ts
assert.isUndefined(undefined) // passes
assert.isUndefined(false) // fails
assert.isUndefined(0) // fails
assert.isUndefined('') // fails
assert.isUndefined(null) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isFalse
Assert the value is boolean (false)

```ts
assert.isFalse(false) // passes
assert.isFalse(true) // fails
assert.isFalse(0) // fails
assert.isFalse(null) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotFalse

Assert the value is anything but not false.

```ts
assert.isNotFalse(false) // fails
assert.isNotFalse(true) // passes
assert.isNotFalse(null) // passes
assert.isNotFalse(undefined) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isFinite
Assert the value to be a number and no NaN or Infinity

```ts
assert.isFinite(1) // passes
assert.isFinite(Infinity) // fails
assert.isFinite(NaN) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isFunction
Assert the value is a function.

```ts
assert.isFunction(function foo () {}) // passes
assert.isFunction(() => {}) // passes
assert.isFunction(class Foo {}) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotFunction
Assert the value is not a function

```ts
assert.isNotFunction({}) // passes
assert.isNotFunction(null) // passes
assert.isNotFunction(() => {}) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNaN

Assert the value is NaN

```ts
assert.isNaN(NaN) // passes
assert.isNaN(Number('hello')) // passes
assert.isNaN(true) // fails
assert.isNaN(false) // fails
assert.isNaN(null) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotNaN

Assert the value is anything, but not NaN.

```ts
assert.isNotNaN(NaN) // fails
assert.isNotNaN(Number('hello')) // fails
assert.isNotNaN(true) // passes
assert.isNotNaN(false) // passes
assert.isNotNaN(null) // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNull

Assert the value is null

```ts
assert.isNull(null) // passes
assert.isNull(true) // fails
assert.isNull(false) // fails
assert.isNull('foo') // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotNull
Assert the value is anything but not null

```ts
assert.isNotNull(null) // fails
assert.isNotNull(true) // passes
assert.isNotNull(false) // passes
assert.isNotNull('foo') // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNumber
Assert the value to be a valid number.

```ts
assert.isNumber(1) // passes
assert.isNumber(new Number('1')) // passes
assert.isNumber('1') // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotNumber
Assert the value not to be a valid number.

```ts
assert.isNotNumber('1') // passes
assert.isNotNumber(1) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |


## isObject
Assert the value to a valid object literal.

```ts
assert.isObject({}) // passes
assert.isObject(new SomeClass()) // passes
assert.isObject(null) // fails
assert.isObject([]) // fails
```

| Name | Type |
| :------ | :------ |
| `object` | `any` |
| `message?` | `string` |

## isNotObject
Assert the value not to be an object literal.

```ts
assert.isNotObject(null) // passes
assert.isNotObject([]) // passes
assert.isNotObject({}) // fails
assert.isNotObject(new SomeClass()) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isString
Assert the value to be a literal string.

```ts
assert.isString('') // passes
assert.isString(new String(true)) // passes
assert.isString(1) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isNotString
Assert the value not to be a string literal.

```ts
assert.isNotString(1) // passes
assert.isNotString('') // fails
assert.isNotString(new String(true)) // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |

## isTrue

Assert the value is a boolean (true).

```ts
assert.isTrue(true) // passes
assert.isTrue(false) // fails
assert.isTrue(1) // fails
assert.isTrue('foo') // fails
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |


## isNotTrue
Assert the value is anything, but not true.

```ts
assert.isNotTrue(true) // fails
assert.isNotTrue(false) // passes
assert.isNotTrue(1) // passes
assert.isNotTrue('foo') // passes
```

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `message?` | `string` |


## closeTo
Assert the value is closer to the expected value + delta.

```ts
assert.closeTo(10, 6, 8) // passes
assert.closeTo(10, 6, 4) // passes
assert.closeTo(10, 20, 10) // passes
```

## fail
Throw an error. Optionally accepts `actual` and `expected` values for the default error message.

:::note
The actual and expected values are not compared. However, they are available as properties on the AssertionError.
:::

```ts
assert.fail() // fail
assert.fail('Error message for the failure')
assert.fail(1, 2, 'expected 1 to equal 2')
assert.fail(1, 2, 'expected 1 to be greater than 2', '>')
```

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

| Name | Type |
| :------ | :------ |
| `actual` | `any` |
| `expected` | `any` |
| `message?` | `string` |
| `operator?` | `string` |

## plan
Plan assertions for the test. The test will be marked as failed when the actual assertions count does not match the planned assertions count.

```ts
assert.plan(2)
```

| Name | Type |
| :------ | :------ |
| `assertionsToExpect` | `number` |
