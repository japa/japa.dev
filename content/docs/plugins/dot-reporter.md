---
title: Dot reporter
description: Minimalist reporter for Japa
---

# Dot reporter

Reporters in Japa are responsible for displaying/saving the progress of tests. The dot reporter is a minimalist reporter that displays a dot for each passing test and an cross for each failing test.

![](https://user-images.githubusercontent.com/8337858/188954371-959f6171-22c8-4a15-a76f-b9d9c2576ab6.png)

## Installation and setup
Install the package from the npm registry as follows.

```sh
npm i -D @japa/dot-reporter
```

And register it as a reporter within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { dotReporter } from '@japa/spec-reporter'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    reporters: [dotReporter()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { dotRepoter } = require('@japa/spec-reporter')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js']
    // highlight-start
    reporters: [dotRepoter()]
    // highlight-end
  }
})
```

:::
