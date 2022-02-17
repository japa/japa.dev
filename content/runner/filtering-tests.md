# Filtering tests

You can apply different layers of filters to run only specific tests. Japa supports **pinning tests**, filtering by the **test title**, **group title**, **file names**, and **test tags**.

Before diving into the filtering layers, let's make sure that your test config file uses the `processCliArgs` to convert command line arguments into configuration options.

:::languageSwitcher
```ts
// title: ESM
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
  }
})
```

```ts
// title: CommonJS
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
  }
})
```
:::

You can also apply the same filters manually. But for most use cases using the command line flag is more convenient.

```ts
configure({
  filters: {
    tags: ['@github'],
    groups: ['Group title'],
    tests: ['Test title'],
    files: ['maths.spec.js']
  }
})
```


## Pinning tests

You can pin tests by calling the `pin` method on the test instance. When there are one or more pinned tests, Japa will only run them.

In the following example, only the pinned test will run.

:::languageSwitcher
```ts
// title: ESM
import { test } from '@japa/runner'

test.group('Maths.add', (group) => {  
  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })
  .pin() // 👈 pinned test

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

```ts
// title: CommonJS
const { test } = require('@japa/runner')

test.group('Maths.add', (group) => {  
  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })
  .pin() // 👈 pinned test

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```
:::

You can also pin all the tests inside a group using the `group.tap` method. 

```ts
test.group('Maths.add', (group) => {  
  // 👇 all tests are now pinned
  group.tap((test) => test.pin())

  test('add two numbers', () => {
    console.log('TEST 1 - executed in the test')
  })

  test('add two or more numbers', () => {
    console.log('TEST 2 - executed in the test')
  })
})
```

## Test tags

Tagging tests are another to filter and run tests that have one or more matching tags. 

Usually, you will have to identify the tags early in the process of writing tests. For example, you can tag all the tests that request third-party services with the service name and later only run/ignore those tags.

```ts
test.group('Github repos', () => {
  test('get list of user repos', () => {
  })
  .tags(['@github', '@network'])

  test('get list of user organization repos', () => {
  })
  .tags(['@github', '@network'])
})
```

Or, you can tag all the tests within the group using the `group.tap` method.

```ts
test.group('Github repos', (group) => {
  group.tap((test) => test.tags(['@github', '@network']))

  test('get list of user repos', () => {
  })

  test('get list of user organization repos', () => {  
  })
})
```

You can pass tags using the `--tags` command line flag when running the tests.

Only the tests with the `@github` tag will run in the following example.

```sh
node bin/test.js --tags="@github"
```

You can also ignore tests by tag either using the `--ignore-tags` flag or negating the tag name with `!`.

The tests with the `@github` tag will not run in the following example.

```sh
node bin/test.js --ignore-tags="@github"

# negating @github with !
node bin/test.js --tags="\!@github"
```

You can also combine negating and regular tags. For example: Run all the tests with the `@network` tag, but ignore the ones using the `@orgs` tag.

```sh
node bin/test.js --tags="@network" --ignore-tags="@orgs"
```

## Filter by group title

You can also filter tests using the group title.

```ts
test.group('Maths.add', () => {
})

test.group('Maths.subtract', () => {
})
```

In the following example, the tests will run only for the `Maths.add` group.

```sh
node bin/test.js --groups="Maths.add"
```

In case both `--tags` and `--groups` are provided. First, the group's filter will be applied, followed by the tags filter.

## Filter by test title

You can also filter tests using the test title. In case both `--tags` and `--tests` are provided. The test title will have priority over tags.

```ts
test('get list of user repos', () => {
})

test('get list of user organization repos', () => {  
})
```

```sh
node bin/test.js --tests="get list of user repos"
```

Manually providing the exact test title is not convenient. Therefore, we recommend pinning tests or using the test tags.

## Run tests from selected files

You can also run tests for one or more specific files using the `--files` CLI flag. The filename can be with or without the file extension.

```sh
node bin/test.js --files="example.spec.js" 
```

## Run failed tests
You can make use of the `@japa/run-failed-tests` plugin to run only the failed tests on subsequent runs.

Here's how it works under the hood.

- You ran the tests suite, and a couple of tests failed.
- On the next run, only the failed test will run.
- If all tests are green, the next run will execute all the tests.

```sh
npm i @japa/run-failed-tests 
```

:::languageSwitcher

```ts
// title: ESM
import { runFailedTests } from '@japa/run-failed-tests'

configure({
  plugins: [runFailedTests()]
})
```

```ts
// title: CommonJS
const { runFailedTests } = require('@japa/run-failed-tests')

configure({
  plugins: [runFailedTests()]
})
```

:::

You can also apply the plugin conditionally. For example, disable it during CI/CD workflow.

```ts
const developmentPlugins = []
if (!process.env.CI) {
  developmentPlugins.push(runFailedTests())
}

configure({
  plugins: [].concat(developmentPlugins)
})
```
