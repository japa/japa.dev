---
title: Expect types
description: The expect types plugin allows you to write assertions for the static TypeScript types. Think of them as additional guards to ensure that you are not messing up with the types a method returns or accepts during refactoring.
---

# Expect types

The `@japa/expect-types` plugin allows you to write assertions for TypeScript types. The plugin does not have any runtime behavior; instead, it reports errors when you either compile your TypeScript code or perform type-checking.

## Installation 

You can install the package from the npm registry as follows.

```sh
npm i -D @japa/expect-type
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
// highlight-start
import { expectTypeOf } from '@japa/expect-type'
// highlight-end
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  // highlight-start
  plugins: [expectTypeOf()]
  // highlight-end
})
```

Once done. You can access the `expectTypeOf` property from the [Test context](../reference/test_context.md) as follows.

```ts
test('add two numbers', ({ expectTypeOf }) => {
  expectTypeOf({ foo: 'bar' }).toEqualTypeOf<{ foo: string }>()
})
```

The `expectTypeOf` method accepts either an argument or a generic type. For example:

```ts
type User = { username: string, email: string, password?: string }
const user = { username: 'virk', email: 'virk@example.com' }

// Assert with value
expectTypeOf(user).toMatchTypeOf<User>()
```

```ts
type User = { username: string, email: string, password?: string }
const user = { username: 'virk', email: 'virk@example.com' }

// Assert with generic
expectTypeOf<typeof user>().toMatchTypeOf<User>()
```

The plugin is a wrapper on the [expect-type](https://github.com/mmkal/expect-type) npm package. Feel free to consult their README file as well.

## toEqualTypeOf

Expect the actual value to have the same expected type. Having additional or fewer properties will make the assertion fail.

:::caption{for="error"}
**Fails, bar has an additional property**
:::

```ts
class Foo {}
class Bar {
  foo = 1
}

expectTypeOf(new Foo()).toEqualTypeOf<Bar>()
```

:::caption{for="error"}
**Fails, foo has an additional property**
:::

```ts
class Foo {
  foo = 1
}
class Bar {}

expectTypeOf(new Foo()).toEqualTypeOf<Bar>()
```

:::caption{for="success"}
**Passes, both objects are equal**
:::

```ts
class Foo {}
class Bar {}

expectTypeOf(new Foo()).toEqualTypeOf<Bar>()
```

## toMatchTypeOf
The `toMatchTypeOf` method is the same as the `toEqualTypeOf` method but less strict. It allows the actual object to have additional properties.

::caption[Fails, bar has an additional property]{for="error"}

```ts
class Foo {}
class Bar {
  foo = 1
}

expectTypeOf(new Foo()).toMatchTypeOf<Bar>()
```

:::caption{for="success"}
**Passes, the foo is a superset of bar**
:::

```ts
class Foo {
  foo = 1
}
class Bar {}

expectTypeOf(new Foo()).toMatchTypeOf<Bar>()
```

:::caption{for="success"}
**Passes, both are equal**
:::

```ts
class Foo {}
class Bar {}

expectTypeOf(new Foo()).toMatchTypeOf<Bar>()
```

## toBeUnknown
Expect value to be of `unknow` type.

```ts
const { data } = await got.post()
expectTypeOf(data).tobeUnknown()
```

## toBeAny
Expect value to be of `any` type.

```ts
const { data } = await got.post<any>()
expectTypeOf(data).toBeAny()
```

## toBeNever
Expect value to be of the `never` type.

```ts
const someVariable: never
expectTypeof(someVariable).toBeNever()
```

## toBeFunction
Expect value to be of `function` type.

```ts
expectTypeOf(() => {}).toBeFunction()
```

## toBeObject
Expect value to be of `object` type. Objects with any key-value pair are allowed.

```ts
class Foo {}
expectTypeOf(new Foo()).toBeObject()
```

```ts
const foo = {}
expectTypeOf(foo).toBeObject()
```

## toBeArray
Expect the value to be of the `array` type.

```ts
expectTypeOf([1, 2]).toBeArray()
```

## toBeString
Expect the value to be of `string` type.

```ts
expectTypeOf('hello world').toBeString()
```

## toBeNumber
Expect the value to be of the `number` type.

```ts
expectTypeOf(1).toBeNumber()
```

## toBeBoolean
Expect the value to be of the `boolean` type.

```ts
expectTypeOf(true).toBeBoolean()
expectTypeOf(false).toBeBoolean()
```

## toBeSymbol
Expect the value to be of `symbol` type.

```ts
expectTypeOf(Symbol('foo')).toBeSymbol()
expectTypeOf(Symbol.for('foo')).toBeSymbol()
```

## toBeUndefined
Expect the value to be of the `undefined` type.

```ts
expectTypeOf(undefined).toBeUndefined()
```

## toBeNullable
Expect the value to be of the `null` type.

```ts
expectTypeOf(null).toBeNullable()
```

## returns.TYPE
Assert the return value of a function. You can use all the above-documented assertion methods with the `returns` modifier.

```ts
function foo () {}
expectTypeOf(foo).returns.toBeVoid()
```

```ts
function foo () {
  return 'hello world.'
}
expectTypeOf(foo).returns.toBeString()
```

```ts
class Foo {}
function foo () {
  return new Foo()
}

expectTypeOf(foo).returns.toEqualTypeOf<Foo>()
```

## resolves.TYPE
The `resolves` modifier is the same as the `returns` modifier. Instead, it looks at the value of the resolved promise.

```ts
async function foo () {
  return 'hello world.'
}

expectTypeOf(foo()).resolves.toBeString()
expectTypeOf(Promise.resolve(1)).resolves.toBeString()
```

You can also combine the `returns` and `resolves` modifiers to assert the return type value of an async function.

```ts
async function foo () {
  return 'hello world.'
}

expectTypeOf(foo).returns.resolves.toBeString()
```

## parameters.TYPE
Assert the type of function parameters.

```ts
function greetUser(name: string, age: number) {}

expectTypeOf(greetUser).parameters.toEqualTypeOf<[string, number]>()
```

Optionally, you can assert parameters at a specific position as well.

```ts
function greetUser(name: string, age: number) {}

expectTypeOf(greetUser).parameter(0).toBeString()
expectTypeOf(greetUser).parameter(1).toBeNumber()
```

## not.TYPE
You can use the `not` modifier to inverse the assertions.

```ts
expectTypeOf(1).not.toBeString()
expectTypeOf('hello world').not.toBeNumber()
```

You can also combine the `returns` and the `not` modifier to assert the return type of a given function.

```ts
function foo() {
  return 'hello world.'
}
expectTypeOf(foo).returns.not.toBeAny()
```

## exclude
You can use the `exclude` method to narrow down complex unions. In the following example, we want to remove the union with the `email: string` property and assert against the rest of the unions.

:::note

The `exclude` method does not remove properties from an object. Instead, the method is used to narrow down types from a union. 

:::

```ts
type User =
  | { email: string; age: number } 
  | { username: string; age: number }

expectTypeOf<User>()
  .exclude<{ email: string }>()
  .toEqualTypeOf<{ username: string; age: number }>()
```

```ts
type KeyName = string | number | symbol

expectTypeOf<KeyName>()
  .exclude<string>()
  .toEqualTypeOf<number | symbol>()
```

## extract
The `extract` method is the opposite of the `exclude` method. Instead of discarding unions, it will assert against the matched unions.

```ts
type KeyName = string | number | symbol

expectTypeOf<KeyName>()
  .extract<string>()
  .toEqualTypeOf<string>()
```

## constructor parameters
The `constructorParameters` modifier is the same as the [parameters](#parameterstype) modifier but for the class constructor.

```ts
class User {
  constructor (name: string, age: number) {}
}

expectTypeOf(User)
  .constructorParameters
  .toEqualTypeOf<[string, number]>()
```

You can use the `toBeConstructibleWith` method to check if you can construct an instance of the class using specific values.

```ts
class User {
  constructor (name: string, age: number) {}
}

expectTypeOf(User).toBeConstructibleWith('joda', 10)
```

## instance.toHaveProperty
You can use the `instance` modifier to assert whether the class instance has a given property.

```ts
class User {
  constructor(
    private firstName: string,
    private lastName: string
  ) {}

  fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}

expectTypeOf(User).instance.toHaveProperty('fullName')

// FAILS. "firstName" and "lastName" are private
expectTypeOf(User).instance.toHaveProperty('firstName')
expectTypeOf(User).instance.toHaveProperty('lastName')
```

## items.TYPE
You can use the `items` modifier on an array to assert the type of array members.

```ts
expectTypeOf([1, 2, 3]).items.toBeNumber()
expectTypeOf([1, 2, 3]).items.not.toBeString()
```
