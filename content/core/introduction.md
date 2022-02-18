---
title: Introduction
description: You can use Japa core low level APIs to create your own tests runner.
---

# Introduction

This section of the documentation focuses on the Core of Japa bundled into `@japa/core` package.

The Japa core exposes low level APIs to create tests, groups, suites and manage their lifecycle. You can use these APIs to create your own tests runner similar to `@japa/runner`.

I recently did a live stream showcasing how to approach building a tests runner using Japa core.

::youtube{url="https://www.youtube.com/watch?v=rViksoY9THI&t=47s"}

:::note
This section of documentation is only relevant if you are planning to create your own tests runner.
:::

## Classes overview

Let's start with a brief overview of all the classes and the API exposed by `@japa/core`. Later, we will dig into specific classes and cover them in-depth.

- [Test](./test.md) class is used to instantiate a test. Calling the `exec` method on this class executes the user-defined test function.

- [Group](./group.md) class is used to instantiate a new group. You can add tests inside a group to bulk configure them.

- [Suite](./suite.md) class is used to instantiate a suite of tests. You can add tests and test groups inside a suite and run them together by calling the `suite.exec` method.

- [Runner](./runner.md) Runner class is the topmost layer to run all suites of tests together. You will always be running tests using the Runner class.

- [TestContext](./test-context.md): An instance of Test Context class is shared with all the tests. As the test runner creator, you can add custom properties to the Test context. Later, we will see how to add the `@japa/assert` and `@japa/expect` modules to Context.

- [Refiner](./refiner.md) class is used to cherry-pick and run specific tests. You can cherry-pick tests by their tags title or by calling the `pin` method on the test instance.

- [Emitter](./emitter.md) class is used to communicate with tests reporters. The test reporters can listen to specific events and display the progress of tests inside the terminal or write it to a file.
