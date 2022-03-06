---
title: March 2022 release
description: This release introduces test suites, dynamic test titles, and a lot more
ogImage: version-5.jpeg
---

# Release - March 2022
Welcome to the March 2022 release of Japa. This release introduces **test suites**, **dynamic test titles**, along with some **minor improvements and a breaking change**.

You must update all of the Japa packages to their latest versions. You can use the [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) package for convenience.

```sh
npx npm-check-updates
```

![](npm-check-updates.png)

## Test suites
Test suites allow you to organize your tests by their type. For example, you can create separate suites for **unit tests** and **functional tests**.

Following are some of the reasons for using test suites.

- Each test suite can define its own set of test files.
- You can register lifecycle hooks around a suite.
- You can configure groups and tests within a suite from the suite instance directly.

:a[Learn more about test suites]{href="/test-suites" class="cta"}

## Dynamic test titles
Tests using datasets can now reference values of the current iteration within the test title.

In the following example, we access the `email` property by wrapping it inside the single curly braces.

```ts
test('validate email - {email}')
  .with([
    {
      email: 'some+user@gmail.com',
    },
    {
      email: 'email@example.com (Joe Smith)'
    }
  ])
  .run(({ assert }, { email }) => {
  })
```

:a[Learn more about dynamic test titles]{href="/datasets#dynamic-title-for-each-test" class="cta"}

## Small improvements and breaking changes

- Skip test when calling ".skip()" without parameter. The improvement is contributed by `@marcuspoehls`. [PR#53](https://github.com/japa/core/pull/53)
- **BREAKING** - Remove TestContext generic from the `Test`, `Group`, `Suite` and the `Runner` classes. Since TestContext cannot be customized, there is no advantage in accepting it as a generic. [f6f19723](https://github.com/japa/runner/commit/f6f19723dcc32604d5808f67eabf0fddec3e3ef9)
