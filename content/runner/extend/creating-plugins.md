---
title: Creating plugins
description: Japa plugins can mutate config, extend the test class, add context properties, define hooks, and does a lot more.
ogImage: creating-plugins.jpeg
---

# Creating plugins

Plugins in Japa are meant to extend the tests runner. You can use plugins to **mutate config**, **extend the test class**, **add context properties**, **define hooks** and a lot more.

In this guide, we will learn how to create and use custom plugins with Japa.

## Defining plugins

The plugins are defined as an array within the config object.

:::languageSwitcher
```ts
// title: ESM
import { assert } from '@japa/assert'
import { configure } from '@japa/runner'

configure({
  plugins: [
    assert()
  ]
})
```

```ts
// title: CommonJS
const { assert } = require('@japa/assert')
const { configure } = require('@japa/runner')

configure({
  plugins: [
    assert()
  ]
})
```
:::

## Creating a plugin
Plugins are executed very early in the lifecycle of running the tests. They receive the user-defined config, the [runner]() instance, and an object of extensible classes.

Also, plugins are executed in the same order they are defined.

```ts
function myCustomPlugin() {
  return async function (config, runner, { Test, TestContext, Group }) {
  }
}

configure({
  plugins: [
    myCustomPlugin(),
  ]
})
```

## Mutating config
You can mutate the config within a plugin callback, and the following plugin will receive the mutated config.

```ts
function myCustomPlugin() {
  return async function (config, runner, { Test, TestContext, Group }) {
    config.files = await getListOfFiles()
  }
}
```

## Defining hooks
You can tap into the suites, groups, and tests directly from a plugin and define the lifecycle hooks. For example, The playwright plugin can define hooks to start and close the browser after every test.

```ts
function myCustomPlugin() {
  return async function (config, runner, { Test, TestContext, Group }) {
    runner.onSuite((suite) => {
      // Here you have access to the suite

      suite.onGroup((group) => {
        // Here you have access to the group

        group.each.setup(async (test) => {
          test.context.browser = await chromium.launch()
          return async () => {
            await test.context.browser.close()
          }
        })
      })
    })
  }
}
```

Hooks is just one example. As you can notice, you can drill down the layers of the tests runner and modify any object in the process.

Since the plugins are executed first, the test can still overwrite the properties configured by a plugin. For example, A test can overwrite the timeout defined by a plugin.

```ts
runner.onSuite((suite) => {
  suite.onGroup((group) => {
    group.each.timeout(6000)
  })
})

test('visit google.com', () => {
}).timeout(2000) // 👈 Wins over plugin
```

## Extending classes
The plugin receives an object of the classes meant to be extended as the third argument. You can use the **Macros** and **Getters** to add custom properties.

```ts
function myCustomPlugin() {
  return async function (config, runner, { Test, TestContext, Group }) {
    Test.macro('visit', function () {
    })

    TestContext.getter('assert', function () {
    }, true)

    Group.macro('tags', function (tags) {
      this.each.tags(tags)
    })
  }
}
```

Please reference the [Test context]() and [Test]() documentation to learn more about Macros and Getters.
