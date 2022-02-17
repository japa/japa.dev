# Emitter

The [Emitter class](https://github.com/japa/core/blob/develop/src/Emitter/index.ts) exposes the API to listen for specific events and monitor the test's progress. 

Most of the time, the emitter is used by the tests reporters. So, for example, you can create a new instance of emitter as follows.

```ts
import { Emitter } from '@japa/core'

const emitter = new Emitter()
```

Since the emitter is typed, you can leverage the TypeScript IntelliSense to view the available events and their data.

## test\:start

It is emitted when a test is executed. The event is emitted even when the test is skipped or is a to-do.

```ts
emitter.on('test:start', (data) => {
  console.log(data)
  
  // prints
  {
    title: string
    tags: string[]
    timeout: number
    waitsForDone?: boolean
    executor?: Function
    isTodo?: boolean
    isSkipped?: boolean
    isFailing?: boolean
    skipReason?: string
    failReason?: string
    retries?: number
    dataset?: {
      size: number
      index: number
      row: any
    }
  }
})
```

## test\:end

It is emitted when the test has finished.

```ts
emitter.on('test:end', (data) => {
  console.log(data)
  
  // prints
  {
    title: string
    tags: string[]
    timeout: number
    waitsForDone?: boolean
    executor?: Function
    isTodo?: boolean
    isSkipped?: boolean
    isFailing?: boolean
    skipReason?: string
    failReason?: string
    retries?: number
    dataset?: {
      size: number
      index: number
      row: any
    },
    duration: number
    hasError: boolean
    errors: {
      phase: string
      error: Error
    }[]
    retryAttempt?: number
  }
})
```

## group\:start

It is emitted when a group begins executing tests.

```ts
emitter.on('group:start', (data) => {
  console.log(data)
  
  // prints
  {
    title: string
  }
})
```

## group\:end

It is emitted when all the tests inside the group have been executed.

```ts
emitter.on('group:end', (data) => {
  console.log(data)
  
  // prints
  {
    title: string
    hasError: boolean
    errors: {
      phase: string
      error: Error
    }[]
  }
})
```

## suite\:start

It is emitted when a suite begins executing tests.

```ts
emitter.on('suite:start', (data) => {
  console.log(data)
  
  // prints
  {
    name: string
  }
})
```

## suite\:end

It is emitted when all the tests inside the suite have been executed.

```ts
emitter.on('suite:end', (data) => {
  console.log(data)
  
  // prints
  {
    name: string
    hasError: boolean
    errors: {
      phase: string
      error: Error
    }[]
  }
})
```

## runner\:start

It is emitted when a runner begins executing tests. No data is available for the `runner:start` event.

```ts
emitter.on('runner:start', () => {
})
```

## runner\:end

It is emitted when all the tests inside the runner have been executed.

```ts
emitter.on('runner:end', (data) => {
  console.log(data)
  
  // prints
  {
    hasError: boolean
    errors: {
      phase: string
      error: Error
    }[]
  }
})
```

## uncaught\:exception

Emitted when a `manageUnHandledExceptions` is enabled on the runner and an `uncaughtException` event is raised by Node.js.

```ts
emitter.on('uncaught:exception', (error) => {
  console.log(error)
})
```
