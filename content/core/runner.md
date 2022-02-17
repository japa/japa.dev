# Runner class

The [Runner class](https://github.com/japa/core/blob/develop/src/Runner/index.ts) exposes the API to run all the tests and register the test reporters.

You can create a new instance of the runner class as follows.

```ts
import { Runner, Emitter } from '@japa/core'

const emitter = new Emitter()

const runner = new Runner(emitter)
```

A runner needs the following constructor arguments.

- `emitter`: A global instance of the Emitter. Make sure you use only one emitter instance throughout the complete cycle of running tests.

## add

Add suites to the runner. 

```ts
const unitTests = new Suite('unit', emitter)
const functionalTests = new Suite('functional', emitter)

runner.add(unitTests)
runner.add(functionalTests)
```

## onSuite
Tap into the suites as they are added to the runner.

```ts
runner.onSuite((suite) => {
  suite.onGroup((group) => {
    group.tap((test) => {
      // configure all tests inside groups      
    })
  })

  suite.onTest((test) => {
    // configure all top level suite tests
  })
})
```

## registerReporter

Register a test reporter. You can call this function multiple times to register different reporters.

```ts
runner.registerReporter((runner, emitter) => {
})
```

## setup

Define the setup hook for the runner.

```ts
runner.setup(() => {
  // called before all the suites
})
```

## teardown

Define the teardown hook for the runner.

```ts
runner.teardown(() => {
  // called after all the suites
})
```

## manageUnHandledExceptions

The `manageUnHandledExceptions` method will set up an `uncaughtException` handler and emit the `uncaught:exception` on the emitter.

```ts
runner.manageUnHandledExceptions()
```

## getSummary

Get the summary of the tests. You must call the `getSummary` method after calling the `exec` method.

```ts
await runner.exec()

const summary = runner.getSummary()

// returns
{
  total: number
  failed: number
  passed: number
  regression: number
  skipped: number
  todo: number
  hasError: boolean
  runnerErrors: RunnerEndNode['errors']
  duration: number
  failureTree: FailureTreeSuiteNode[]
  failedTestsTitles: string[]
}
```

- `total`: Total number of executed tests. 
- `failed`: Total number of failed tests.
- `passed`: Total number of passed tests.
- `regression`: Total number of regression tests.
- `skipped`: Total number of skipped tests.
- `todo`: Total number of todo tests. Tests without the implementation function are considered as todo.
- `hasError`: A boolean to indicate if one or more tests/hooks have failed.
- `runnerErrors`: An array of errors on the `runner` instance. It will usually be the errors reporter the runner hooks.
- `duration`: Total time spent in running the tests.
- `failureTree`: A nested tree with all the failed suites, groups, and tests. 
- `failedTestsTitles`: An array of failed test titles. Later, you can use these titles to run only the failed tests.

## start
Calling the `start` method emits the `runner:start` event. You must call this method before calling the `exec` method.

```ts
await runner.start()
```

## exec
Execute all the suites, groups, and tests.

```ts
await runner.start()
// highlight-start
await runner.exec()
// highlight-end
```

## end
Calling the `end` method emits the `runner:end` event. You must call this method after calling the `exec` method.

```ts
await runner.start()
await runner.exec()
// highlight-start
await runner.end()
// highlight-end
```

## reporters

A `Set` of registered reporters. 

```ts
console.log(runner.reporters)
```

## suites

A reference to the array of suites added to the runner.

```ts
console.log(runner.suites)
```
