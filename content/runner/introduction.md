---
title: Japa - A feature rich testing framework for Node.js
description: Japa is an API first testing framework. It focuses only on testing Node.js (backend) applications, thus resulting in a fast, small, and a simple tests runner.
ogImage: introduction.jpeg
---

# Introduction

Japa is an API-first testing framework. It focuses only on testing Node.js (backend) applications, thus resulting in a fast, small, and simple tests runner.

In this guide, we will go through the Japa features and learn about the rationale behind the project.

## Features
Despite being a small and a simple tests runner, Japa has a ton of features you expect from a great testing framework. It includes:

- Support for [test groups](./grouping-tests.md), timeout, todo tests and [regression tests](./underlying-test-class.md#fails).
- Support for [Datasets](./datasets.md).
- Test [suites](./test-suites.md) to organize tests by their type.
- Assertion libraries with support for [assertion planning](./assertion-planning.md).
- Ability to [filter](./filtering-tests.md) and run specific or only failing tests.
- Re-imagined [lifecycle hooks](./lifecycle-hooks.md).
- Multiple [reporters](./plugins/spec-reporter.md) to display tests progress.
- Great CLI experience with pretty diffs and formatted error stacks.
- Works with **ESM** and [TypeScript](./usage-with-typescript.md) both with zero additional setup.

## Why Japa?
There are many testing frameworks available in the JavaScript ecosystem. So let's explore what makes Japa different.

### Node only
Most mainstream testing frameworks in JavaScript are heavily influenced by the frontend ecosystem, or we can say they are frontend first.

Even though JavaScript can run almost everywhere, the needs and approaches of different ecosystems do vary. For example:

- Jest, process all of your source files through the `@jest/transform` package, which uses `babel-jest` internally by default. Also, you can register additional transformers for TypeScript, Vue, and so on.
- Similarly, Vitest uses Vite under the hood for code transformation.

The code transformation layer is not at all required when writing backend applications for Node.js. **So why pay the penalty of doing so?**

Also, much community effort goes into creating plugins/extensions required by frontend applications. Whereas with Japa, we focus on **growing the ecosystem around the needs of backend testing**.

To conclude, I am not saying Jest or Vitest are technically inferior. It's just Node.js deserves its own first-class testing experience.

### Extensible
Japa is extensible to its core. Not only you can create **plugins** and **reporters** for Japa, you can also extend the [Test](./underlying-test-class.md#extending-test-class), [TestContext](./test-context.md#adding-custom-properties-to-the-context), and [Group](./grouping-tests.md) classes to add additional behavior.

## Installation

You can configure Japa within an existing Node.js project using the following command.

```sh
npm init japa
```

The installation process prompts you to configure the tests runner with additional packages.

- **Assertion library** - Select between [@japa/assert](./plugins/assert.md) or [@japa/expect](./plugins/expect.md).
- **Tests reporter** - Select the reporter to display/store the tests progress.
- **Additional plugins** - Select additional plugins you want to configure. You can learn about them in the [plugins section](./plugins/run-failed-tests.md) of the docs.

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

Since the execution of tests is not abstracted behind a CLI. You can open the `bin/test.js` file and make any customizations you want before running the tests.
