---
title: Installation and usage
description: Learn how to configure Japa inside an existing JavaScript, TypeScript or an ES modules project.
ogImage: introduction.jpeg
---

# Installation and usage
You can configure Japa within an existing Node.js project by running the following command.

:::note
Japa will use the `process.cwd()` (current working directory) path to create the configuration files and a sample test file.
:::

```sh
npm init japa@latest

# CREATE: bin/test.js
# CREATE: tests/maths.spec.js (Optional)
```

The installation process prompts you to configure the test runner with the following options.

- **Tests reporter** - Select the reporter to display/store the tests progress.
- **Assertion library** - Select between [@japa/assert](./plugins/assert.md) or [@japa/expect](./plugins/expect.md).
- **Additional plugins** - Select additional plugins you want to configure. You can learn about them in the [plugins section](./plugins/run-failed-tests.md) of the docs.
- **Project type** - Select the project type for which you want to generate the configuration files.

## Writing tests
By default, the test files are stored inside the `tests` directory and must end with `.spec.(js|ts)`.

There should be a sample test file inside this directory. If not, run the following commands to create one.

```sh
mkdir tests
touch tests/maths.spec.js
```

Open the newly created file and paste the following code inside it.

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

- A test is created using the `test` function imported from the `@japa/runner` module.
- The function accepts the test title as the first argument and its implementation as the second argument.
- The implementation function can be async or return a promise. Learn more about [testing asynchronous code](./testing-async-code.md).

## Running tests
You can execute tests by running the following command.

```sh
node bin/test.js
```

Japa does not have any CLI to run tests. Instead, you use the `node` command to load the `bin/test.js` file and execute tests.

Following is the breakdown of how Japa runs tests.

1. The `configure` method inside the `bin/test.js` file configures the test runner with your configuration. [Config reference](./runner-config.md).
2. The `run` method executes tests based on the configuration.

Since the execution of tests is not abstracted behind a CLI. You can open the `bin/test.js` file and make any customizations you want before calling the `run` method.
