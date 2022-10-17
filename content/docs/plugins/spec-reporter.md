---
title: Spec reporter
description: View detailed progress of tests in the terminal.
---

# Spec reporter

Reporters in Japa are responsible for displaying/saving the progress of tests. The spec reporter displays a detailed report of all the tests in the terminal.

![](spec-reporter-output.png)

## Installation and setup
Install the package from the npm registry as follows.

```sh
npm i -D @japa/spec-reporter
```

And register it as a reporter within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { specReporter } from '@japa/spec-reporter'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    reporters: [specReporter()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { specReporter } = require('@japa/spec-reporter')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    reporters: [specReporter()]
    // highlight-end
  }
})
```

:::
