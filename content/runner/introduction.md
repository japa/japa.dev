# Introduction

Japa is an API first testing framework. It focuses only on testing Node.js (backend) applications, thus resulting in a fast, small, and a simple tests runner.

In this guide, we will go through the Japa features and also learn about the rationale behind the project.

## Features
Despite being a small and a simple tests runner. Japa has a ton of features you expect from a testing framework. It includes:

- Support for [test groups](./grouping-tests.md), timeout, todo and [regression tests](./underlying-test-class.md#fails).
- Support for [Datasets](./datasets.md).
- Support for test suites.
- Assertion libraries with support for [assertion planning](./assertion-planning.md).
- Ability to [filter](./filtering-tests.md) and run specific or only failing tests.
- Re-imagined [lifecycle hooks](./lifecycle-hooks.md).
- Multiple [reporters](./plugins/spec-reporter.md) to display tests progress.
- Great CLI experience with pretty diffs and formatted error stacks.
- Works with **ESM** and [TypeScript](./usage-with-typescript.md) both with zero additional setup.

## Why Japa?
There are many testing frameworks available in the JavaScript ecosystem. However, a majority of them are heavily influenced by the frontend ecosystem or we can say they are frontend first.

On the other hand Japa is only meant to work with Node.js to test backend applications like a web app or a CLI tool. 

This laser focus today allows to produce a relatively simpler codebase and also **grow the ecosystem around the needs of backend testing**.

> If you want to test your Node.js backend application, then give Japa a try. You will ❤️ it.

## Installation

You can configure Japa within an existing Node.js project using the following command.

```sh
npm init japa
```

The installation process prompts you to configure the tests runner with additional packages.

- **Assertion library** - Select between [@japa/assert]() or [@japa/expect]().
- **Tests reporter** - Select the reporter to display/store the tests progress.

## Writing the first test

Let's create a new test file and paste the following code inside it.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'

function sum(a, b) {
  return a + b
}

test('add two numbers', ({ assert }) => {
  assert.equal(sum(2, 2), 4)
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')

function sum(a, b) {
  return a + b
}

test('add two numbers', ({ assert }) => {
  assert.equal(sum(2, 2), 4)
})
```
:::

## Running tests

Finally, let's run the tests by executing the following command.

```sh
node bin/test.js
```

**Wait! Did you notice something?**\
Japa does not have any CLI to run tests. Instead, you use the Node.js command line and load the `bin/test.js` to execute the tests.

This is how it works under the hood.

1. You run `node bin/test.js`.
2. First, the `configure` method is called to configure the tests runner.
3. Then the `run` method is called, which uses the configuration options and runs all the tests accordingly.

Since, the execution of tests is not abstracted behind a CLI. You can simply open the `bin/test.js` file and make any customizations you want.
