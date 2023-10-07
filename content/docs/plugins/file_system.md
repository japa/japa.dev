---
title: File system
description: The file system plugin can be used to write assertions for the files and directories on the filesystem
---

# File System

The file system plugin allows you to easily manage files and directories during tests and write assertions against them. You can install the plugin from the npm packages registry as follows.

```sh
npm i -D @japa/file-system@1.1.0
```

The next step is registering the plugin inside the `plugins` array.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { fileSystem } from '@japa/file-system'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [fileSystem()]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { fileSystem } = require('@japa/file-system')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [fileSystem()]
    // highlight-end
  }
})
```

:::

## Basic usage
Once the plugin has been registered, you can access the `fs` property from the [test context](../test-context.md). The `fs` property exposes the helper functions to **read** and **write** files. For example:

```ts
test('read rc file', async ({ fs }) => {
  await fs.write('rc.json', JSON.stringify({
    foo: 'bar'
  }))

  await runMethodThatNeedsRcFile()
})
```

A few things are happening here.

- First, you do not have to construct absolute paths to `write` the file. The file system plugin writes the files inside your operating system's `tmp` directory.
- You do not have to clean up any files or directories. The filesystem plugin will automatically perform the clean up after the test finishes.

You can specify a custom base directory or turn off the auto cleaning of files using the following configuration options.

```ts
{
  plugins: [
    fileSystem({
      basePath: join(__dirname, './tmp'),
      autoClean: false,
    })
  ]
}
```

## Assertions
The filesystem plugin extends the [assert](./assert.md) module and adds the following assertion methods to test file system operations quickly. All file system assertion methods are asynchronous.

### fileExists/dirExists
Assert a file or a directory exists at a given location.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users')
  await assert.fileExists('controllers/users_controller.ts')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### fileNotExists/dirNotExists
Assert a file or a directory should not exist at a given location.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users', { dryRun: true }) 
 
  await assert.fileNotExists('controllers/users_controller.ts')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### fileEquals
Assert the contents of the file against a string value.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users') 
 
  await assert.fileEquals('controllers/users_controller.ts', `
    export default class UsersController {}
  `)
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `contents` | `String` |

### fileContains
Assert the file contents to contain a substring or match a regular expression.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users') 
 
  await assert.fileContains(
    'controllers/users_controller.ts',
    'class UsersController'
  )

  await assert.fileContains(
    'controllers/users_controller.ts',
    /class UsersController/
  )
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `substring` | `String` \| `Regexp` |

### fileSameAs
Assert the contents of the file matches the contents of another file.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users')
 
  await assert.fileSameAs(
    'controllers/users_controller.ts',
    'stubs/controller/make'
  )
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `otherFilePath` | `String` |

### fileIsEmpty
Assert the file exists and is empty or has only whitespaces.

```ts
test('make preload file', ({ assert, fs }) => {
  await makePreloadFile(fs.basePath, 'routes')
  await assert.fileIsEmpty('start/routes.ts')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### fileIsNotEmpty
Assert the file exists and is not empty.

```ts
test('make routes file', ({ assert, fs }) => {
  await makeRoutesFile(fs.basePath)
  await assert.fileIsNotEmpty('start/routes.ts')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### hasFiles
Assert the root of the filesystem has all the mentioned files.

```ts
test('copy stubs', ({ assert, fs }) => {
  await copyStubs(fs.basePath)

  await assert.hasFiles([
    'make/controller/main.stub',
    'make/event/main.stub',
    'make/listener/main.stub',
    'make/command/main.stub',
  ])
})
```

| Argument | Type |
|---------|---------|
| `files` | `String[]` |

### doesNotHaveFiles
Assert the filesystem's root does not have any of the mentioned files.

```ts
test('copy stubs', ({ assert, fs }) => {
  await copyStubs(fs.basePath, { dryRun: true })

  await assert.doesNotHaveFiles([
    'make/controller/main.stub',
    'make/event/main.stub',
    'make/listener/main.stub',
    'make/command/main.stub',
  ])
})
```

| Argument | Type |
|---------|---------|
| `files` | `String[]` |

### dirIsEmpty
Assert a given directory is empty.

```ts
test('copy stubs', ({ assert, fs }) => {
  await copyStubs(fs.basePath, { dryRun: true })
  await assert.dirIsEmpty('make')
})
```

| Argument | Type |
|---------|---------|
| `dirPath` | `String?` |

### dirIsNotEmpty
Assert a given directory is not empty.

```ts
test('copy stubs', ({ assert, fs }) => {
  await copyStubs(fs.basePath)
  await assert.dirIsNotEmpty('make')
})
```

| Argument | Type |
|---------|---------|
| `dirPath` | `String?` |

## File system API
Following is the list of methods available on the `ctx.fs` property. All methods accept relative paths.

### cleanup
Remove the file system root directory. If you have turned off `autoClean`, you might want to use this method as a hook to clean up files after each test.

```ts
test.group('Make files', (group) => {
  group.each.setup(({ context }) => {
    return () => context.fs.cleanup()
  })
})
```

### create
Create a file at a given location. The missing directories will be created automatically.

```ts
test('write rc file', async ({ fs }) => {
  await fs.write('rc.json', JSON.stringify({
    foo: 'bar'
  }))
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `contents` | `String` |
| `options` | `WriteFileOptions` |

### createJson
Same as `create`, but writes the contents as JSON.

```ts
test('read rc file', async ({ fs }) => {
  await fs.createJson('rc.json', {
    foo: 'bar'
  })
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `contents` | `Object` |
| `options` | `JsonOutputOptions` |

### remove
Remove a file or a directory by its location.

```ts
test('delete rc file', async ({ fs }) => {
  await fs.remove('rc.json')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### rootExists
Check if the root directory of the file system exists. The method returns a boolean value.

```ts
test.group('Make files', (group) => {
  group.each.setup(({ context }) => {
    return async () => {
      // highlight-start
      if (await context.fs.rootExists()) {
        await context.fs.cleanup()
      }
      // highlight-end
    }
  })
})
```

### exists
Check if a directory exists. The method returns a boolean value.

```ts
test('do not update rc file', async ({ fs }) => {
  if (await fs.exists('rc.json')) {
    await fs.create('rc.json', contents)
  }
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### contents
Returns the contents of a file as a string

```ts
test('read rc file', async ({ fs }) => {
  const contents = await fs.contents('rc.json')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### contentsJson
Parse the contents of a file as JSON and return it as an object.

```ts
test('read package.json file', async ({ fs }) => {
  const contents = await fs.contentsJson('package.json')

  console.log(contents.devDependencies)
})
```


### stats
Get [`fs.Stats`](https://nodejs.org/api/fs.html#class-fsstats) for a file by its location.

```ts
test('read rc file', async ({ fs }) => {
  const stats = await fs.stats('rc.json')
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### readDir
Get an array of files for a directory. The return value is an array of [EntryInfo]() objects.

```ts
test('copy files', async ({ fs }) => {
  const entries = await fs.readDir('make')

  entries.forEach((entry) => {
    console.log(entry.path)
    console.log(entry.fullPath)
    console.log(entry.basename)
    console.log(entry.stats)
  })
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |

### adapter
The `adapter` property is a reference to the [fs-extra](https://www.npmjs.com/package/fs-extra) package, and you can use it to perform file system operations not covered by the `FileSystem` class.

```ts
test('copy files', async ({ fs }) => {
  await fs.adapter.move(source, destination)
})
```
