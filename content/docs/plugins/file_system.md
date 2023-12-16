---
title: File system
description: The file system plugin can be used to write assertions for the files and directories on the filesystem
---

# File System

The file system plugin allows you to work with temporary files and directories during tests and write assertions against them.

The filesystem plugin provides the following conveniences over manually using the `fs` module APIs.

- The temporary files are created inside your operating system's `tmp` folder. You can override the path if needed.
- Files created during a test are auto-removed after the test is completed.
- Assertion methods to assert a file exist, have expected content, and much more.


## Installation

You can install the plugin from the npm packages registry as follows.

```sh
npm i -D @japa/file-system
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
// highlight-start
import { fileSystem } from '@japa/file-system'
// highlight-end
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  // highlight-start
  plugins: [fileSystem()]
  // highlight-end
})
```

## Basic usage

Once the plugin has been registered, you can access the `fs` property from the [test context](../reference/test_context.md). The `fs` property exposes the helper functions to **read** and **write** files. For example:

```ts
test('read rc file', async ({ fs }) => {
  await fs.writeJSON('rc.json', {
    foo: 'bar'
  })

  await runMethodThatNeedsRcFile()
})
```

A few things are happening here.

- First, you do not have to construct absolute paths to `write` the file. The file system plugin writes the files inside your operating system's `tmp` directory.
- You do not have to clean up any files or directories. The filesystem plugin will automatically perform the cleanup after the test finishes.

You can specify a custom base directory or turn off the auto cleaning of files using the following configuration options.

```ts
{
  plugins: [
    fileSystem({
      basePath: new URL('./tmp', import.meta.url),
      autoClean: false,
    })
  ]
}
```

## Assertions
The filesystem plugin extends the [assert](./assert.md) plugin and adds the following assertion methods. All file system assertion methods are asynchronous.

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

You may pass an array of substrings to check if all the mentioned values are part of the file contents.

```ts
test('make controller', ({ assert, fs }) => {
  await makeController(fs.basePath, 'users') 
 
  await assert.fileContains(
    'controllers/users_controller.ts',
    [
      'export default class UsersController {',
      'async index() {', // should have index method
      'async store() {', // should have store method
    ]
  )
})
```

| Argument | Type |
|---------|---------|
| `filePath` | `String` |
| `substring` | `String` \| `String[]` \| `Regexp` |

### fileSameAs
Assert the contents of the file match the contents of another file.

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
test('read rc file', async ({ fs }) => {
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
Get an array of files for a directory. The return value is an array of [EntryInfo](https://github.com/paulmillr/readdirp#entryinfo) objects.

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

### mkdir
Create a directory recursively inside the root of the file system.

```ts
test('copy files', async ({ fs }) => {
  await fs.mkdir('make/controller')
})
```

| Argument | Type |
|---------|---------|
| `dirPath` | `String` |
