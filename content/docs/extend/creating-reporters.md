---
title: Creating reporters
description: Create a reporter to observe tests progress and display it on the terminal or write it to a file.
ogImage: creating-reporters.jpeg
---

# Creating reporters

Reporters are used to display/save the progress of tests as they are executed. For example, the [`@japa/spec-reporter`](https://github.com/japa/spec-reporter) shows the progress of tests in the terminal.

In this guide, we will learn how to create and use custom reporters with Japa.

## Defining reporters
The reporters are defined as an array within the config object.

:::languageSwitcher
```ts
// title: ESM
import { specReporter } from '@japa/spec-reporter'
import { configure } from '@japa/runner'

configure({
  reporters: [
    specReporter(),
    myCustomReporter()
  ]
})
```

```ts
// title: CommonJS
const { specReporter } = require('@japa/spec-reporter')
const { configure } = require('@japa/runner')

configure({
  reporters: [
    specReporter(),
    myCustomReporter()
  ]
})
```
:::

## Creating a reporter
The reporter implementation is a JavaScript function that receives the [runner instance](https://github.com/japa/core/blob/develop/src/Runner/index.ts) as the first argument and the [emitter instance](https://github.com/japa/core/blob/develop/src/Emitter/index.ts) as the second argument.

You can listen for specific events to monitor the test's progress and process them as required.

Let's create a custom reporter that logs the test's progress in the terminal.

### Step 1. Create and register the reporter
The first step is to define the reporter function and add it to the `reporters` array.

:::note
You can write the reporter implementation within the `bin/test.js` file or create a new file and import it inside the `bin/test.js` file.
:::

```ts
function logReporter() {
  return function (runner, emitter) {
  }
}

configure({
  reporters: [logReporter()]
})
```

### Step 2. Listening for events
Let's continue with the `logReporter` implementation and listen for the events to display the test's progress.

:::note
Make sure to consult the [event emitter](https://github.com/japa/core/blob/develop/src/Emitter/index.ts) documentation to view all the available events and their data.
:::

```ts
function logReporter() {
  return function (runner, emitter) {
    // highlight-start
    let indentation = 2
    function getSpaces() {
      return new Array(indentation + 1).join(' ')
    }

    emitter.on('runner:start', () => {
      console.log(`START`)
    })

    emitter.on('runner:end', () => {
      console.log(`FINISH: completed in "${runner.getSummary().duration}ms"`)
    })

    emitter.on('suite:start', (payload) => {
      console.log(`${getSpaces()}SUITE: "${payload.name}"`)
      indentation += 2
    })

    emitter.on('suite:end', (payload) => {
      indentation -= 2
      console.log(`${getSpaces()}SUITE: "${payload.name}"`)
    })

    emitter.on('group:start', (payload) => {
      console.log(`${getSpaces()}GROUP: "${payload.title}"`)
      indentation += 2
    })

    emitter.on('group:end', (payload) => {
      indentation -= 2
      console.log(`${getSpaces()}GROUP: "${payload.title}"`)
    })

    emitter.on('test:end', (payload) => {
      console.log(`${getSpaces()}TEST: "${payload.title}" completed in "${payload.duration}ms"`)
    })
    // highlight-end
  }
}
```

## Running async operations
If your reporters want to perform async operations like reading/writing to a file or a TCP connection, then make sure to put that logic within the `runner:start` and `runner:end` events.

Japa waits for these event listeners to finish before starting or ending the tests suite. Also, it is a good practice to collect all the metrics in memory first and then flush them to disk.

```ts
import lockfile from 'proper-lockfile'

let release

emitter.on('runner:start', async () => {
  release = await lockfile('somefile.json')
})

emitter.on('runner:end', async () => {
  await fs.write('somefile.json', contents)
  await release()
})
```

## Base Reporter
To make it easier for you to write custom reporters, we also provide [`@japa/base-reporter`](https://github.com/japa/base-reporter) which abstracts the repetitive parts of creating test reporters.

First, you need to install the package from npm registry as follows:

```sh
npm i @japa/base-reporter
```

Then you have create your reporter as follows:

```ts
import { BaseReporter } from '@japa/base-reporter'

class MyReporter extends BaseReporter {}

export const reporterFn = (myReporterOptions = {}) => {
  const myReporter = new MyReporter(myReporterOptions)
  return myReporter.boot.bind(reporter)
}
```

### Handlers

The Base reporter invokes following methods as it receives the events from the runner. You can implement these methods to display the tests progress :

```ts
import { BaseReporter } from '@japa/base-reporter'

class MyReporter extends BaseReporter {
  protected onTestStart(payload: TestStartNode) {
    console.log('test started')
  }
  protected onTestEnd(payload: TestEndNode) {
    console.log('test endeded')
  }

  protected onGroupStart(payload: GroupStartNode) {
    console.log('group started')
  }
  protected onGroupEnd(payload: GroupEndNode) {
    console.log('group ended')
  }

  protected onSuiteStart(payload: SuiteStartNode) {
    console.log('suite started')
  }
  protected onSuiteEnd(payload: SuiteEndNode) {
    console.log('suite ended')
  }

  protected async start(payload: RunnerStartNode) {
    console.log('test runner started. You can run async operations here')
  }
  protected async end(payload: RunnerEndNode) {
    console.log('test runner ended. You can run async operations here')
  }
}
```

### Inherited properties
The following properties are available on the BaseReporter. These properties are available only after the boot method is called.

#### runner
Reference to underlying tests runner instance.

```ts
this.runner
```

#### currentFileName
Reference to the file name for which tests are getting executed. The filename is only available inside the test or group handlers.

```ts
this.currentFileName
```

#### currentSuiteName
Reference to the suite name for which tests are getting executed. The suite name is only available after the `onSuiteStart` handler call.

```ts
this.currentSuiteName
```

#### uncaughtExceptions
Uncaught exceptions collected while tests are running. We rely on `process.on('uncaughtException')` event to collect uncaught exceptions and display them with their stack trace at the end.

### Printing tests summary
After all the tests have been finished, you can call the `printSummary` method to print a detailed summary of all tests alongside pretty diffs and pretty error stack trace.

You should call the `printSummary` method from the `end` handler.

```ts
class SpecReporter extends BaseReporter {
  protected async end() {
    const summary = await this.runner.getSummary()
    await this.printSummary(summary)
  }
}
```
