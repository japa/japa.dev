# Upgrading from 2.x to Japa 3

v3 is the newer version of Japa. It comes with a handful of breaking changes along with migration to ESM.

Before upgrading any other plugins, you must upgrade the `@japa/runner` to the latest major release.

```sh
npm i @japa/runner@latest
```

Upgrade any of the following plugins you are using in your project. All Japa plugins have zero breaking changes during this release.

```sh
# If using the assert plugin
npm i @japa/assert@latest

# If using the expect plugin
npm i @japa/expect@latest

# If using the expect-type plugin
npm i @japa/expect-type@latest

# If using the api-client plugin
npm i @japa/api-client@latest

# If using the browser-client plugin
npm i @japa/browser-client@latest

# If using the snapshot plugin
npm i @japa/snapshot@latest

# If using the file-system plugin
npm i @japa/file-system@latest
```

Finally, please remove the following packages from your project since they have been deprecated. [Learn more](#package-removed).

```sh
npm uninstall\
  @japa/spec-reporter\
  @japa/dot-reporter\
  @japa/run-failed-tests\
  @japa/base-reporter
```

## Breaking changes
Following is the list of breaking changes when migrating to Japa v3.

### ESM only
Japa now only works with ESM projects. If your projects are not using ES modules (including AdonisJS v5 apps), you should stick with Japa v2. [Link to v2 docs](v2.japa.dev)

### Changes to the `processCliArgs` method

The behavior of the `processCliArgs` method has been changed completely.

- The method has been renamed from `processCliArgs` to `processCLIArgs`.
- Earlier, this method was used to convert CLI arguments into a config object. However, with v3, this method returns `undefined`, and Japa internally mutates the config based on the parsed CLI arguments.

You must make the following changes to the Japa entry point file, i.e., `bin/test.js`.

```ts
import {
  configure,
  // delete-start
  processCliArgs
  // delete-end
  // insert-start
  processCLIArgs
  // insert-end
} from '@japa/runner'

// insert-start
processCLIArgs(process.argv.splice(2))
// insert-end
configure({
  // delete-start
  ...processCliArgs(process.argv.splice(2)),
  {
    // Rest of the config
  }
  // delete-end
})
```

### Changes to the `reporters` property

The `reporters` property inside the configuration block has been converted from an Array to an Object. The new `reporters` object contains a list of registered reporters and a list of activated reporters.

After this change, you can register multiple reporters but only activate a few. Or activate them using the CLI flag `--reporters` when running the tests. 

Following is the list of changes you must make to the Japa entry point file.

```ts
// delete-start
import { specReporter } from '@japa/spec-reporter'
// delete-end
// insert-start
import { spec } from '@japa/runner/reporters'
// insert-end

configure({
  // delete-start
  reporters: [specReporter()]
  // delete-end
  // insert-start
  reporters: {
    activated: ['spec'],
    list: [spec()]
  }
  // insert-end
})
```

Also, Japa v3 registers all the first-party reporters by default. Therefore, you can remove the `reporters` property from the config block, and everything will work as expected.

```ts
configure({
  // delete-start
  /**
   * The spec reporter is registered by default hence there
   * is not need to register it manually.
   */
  reporters: {
    activated: ['spec'],
    list: [spec()]
  }
  // delete-end
})
```

### Changes to plugin function arguments
Earlier, a plugin function was used to receive multiple arguments, which have been consolidated into a single options object in Japa v3. 

If you have created plugins for Japa, you must make the following changes.

```ts
// title: In Japa v2
export function myCustomPlugin(
  config: Required<Config>,
  runner: Runner,
  classes: {
    Test: typeof Test,
    TestContext: typeof TestContext,
    Group: typeof Group
  }
) {
  // plugin implementation
}
```

```ts
// title: In Japa v3
export function myCustomPlugin(
  options: {
    config: Required<Config>
    cliArgs: CLIArgs
    runner: Runner
    emitter: Emitter
  }
) {}
```

Also, we no longer pass the `Test`, `TestContext`, and `Group` classes to a plugin. You can import them directly from the `@japa/runner/core` module.

```ts
import { Test, TestContext, Group } from '@japa/runner/core'
```

### Other breaking changes

- All types are exported from the `@japa/runner/types` submodule.

- The `config.importer` method now receives an instance of the `URL` class. Earlier, it used to be an absolute file path. Ideally, you can remove the `importer` implementation from your config file since it converts the file path to a URL.

- Removed the `--ignore-tags` CLI flags. Instead, you can negate the tags using the tilde `~` symbol

- Use tilde `~` symbol for negating tags. The character was `!` earlier, but you had to escape `!` inside a terminal, whereas `~` needs no escaping.

## Package removed
We have moved a lot of stuff within the `@japa/runner` codebase; hence, the following packages have been removed during the v3 release. These packages are not compatible with `@japa/runner@3`.

* **@japa/spec-reporter** : Uninstall the package and remove its usage from the config file. Japa registers the `spec` reporter by default.

* **@japa/dot-reporter**: Uninstall the package and remove its usage from the config file. Japa registers the `dot` reporter by default.

* **@japa/run-failed-tests**: The plugin has been removed. Instead, you must run failed tests 
using the new `--failed` flag.

* **@japa/base-reporter**: The base reporter was used to create custom reporters by extending the `BaseReporter` class. This class has been moved within the Runner codebase, and you can import it as follows.

  ```ts
  import { BaseReporter } from '@japa/runner/core'
  export class MyReporter extends BaseReporter {}
  ```

* **@japa/synthetic-events** : The package was used to emit fake events that can be used to create a custom reporter. You do not need this package anymore. Instead, use the `runner` factory to test reporters.

## New features

- Introduce the `--failed` flag to run tests that failed from the previous run. No config changes are needed for this. Just use the CLI flag.

- Introduce the `—-retries` flag to define the number of times a test should be retried after failure. The flag applies to all the tests that do not set an explicit `retries` count.

- Add `ndjson` reporter. It is created specially for our VSCode extension.

- Introduce `SummaryBuilder` that reporters and plugins can access from the `runner` object. The summary builder allows registering functions that can return a key-value pair to display inside the test summary output.

  ```ts
  runner.summaryBuilder.use(() => {
    return [
      {
        key: 'Node.js version',
        value: process.version
      }
    ]
  })
  ```

- Add the `test.throws` method to write high-order assertions. [Learn more](./guides/exceptions.md#high-order-assertion)

## Handling uncaught errors differently

Earlier, Japa used to try and associate `uncaughtExceptions` with the test that might have triggered it. This behavior was tricky and usually produced many false positives.

Also, we collected all the `uncaughtExceptions` until the process exits and displayed their count inside the tests runner summary output.

In Japa v3, the above-defined behaviors have been removed with a simple implementation. Now, Japa listens for `uncaughtExceptions` and `uncaughtRejections` globally and reports them as they occur. They are not aggregated in the output summary.

**This change has no impact on the way you write tests.**

## Better errors output
Inspired by Vitest, we now display red borders around individual errors with a paging counter. The border makes it easy to scan errors when you have a massive list of them. You can easily see where an error starts and ends.

### Old output
![japa_errors_old_output_min](https://github-production-user-asset-6210df.s3.amazonaws.com/1706381/249112962-f31a33d2-784d-438f-9320-af0c04857569.png)

### New Output
![japa_errors_new_output_min](https://github-production-user-asset-6210df.s3.amazonaws.com/1706381/249112762-cfec331f-6e01-4b82-9c81-92a22d9588d0.png)
