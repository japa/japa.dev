# Creating reporters

Reporters are used to displaying/saving the progress of tests as they are executed. For example, the [@japa/spec-reporter](https://github.com/japa/spec-reporter) shows the progress of tests in the terminal.

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
The reporter implementation is a JavaScript function that receives the [runner instance]() as the first argument and the [emitter instance]() as the second argument.

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
Make sure to consult the [event emitter]() documentation to view all the available events and their data.
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
