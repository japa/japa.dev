# Creating Japa plugins
Japa plugins are vanilla JavaScript functions executed as the first thing when running tests. A plugin can modify configuration, mutate CLI flags, register lifecycle hooks, and extend classes.

```ts
function myCustomPlugin() {
  return function ({ emitter, runner, cliArgs, config }) {
    console.log('hello world from myCustomPlugin')
  }
}

configure({
  plugins: [
    assert(),
    myCustomPlugin()
  ],
})
```

<dl>

<dt>

emitter

</dt>

<dd>

Reference to the [Emitter class](https://github.com/japa/core/blob/develop/src/emitter.ts#L16). The emitter is responsible for emitting events reporting the progress of tests.

Here's the [complete list](https://github.com/japa/core/blob/develop/src/types.ts#L243) of emitted events.

</dd>

<dt>

runner

</dt>

<dd>

Reference to an instance of the [Runner class](https://github.com/japa/core/blob/develop/src/runner.ts#L32). The Runner class is responsible for executing the tests and also exposes API to register suites, reporters, and get the tests summary. 

</dd>

<dt>

cliArgs

</dt>

<dd>

Reference to the command line arguments parsed by Japa as an object. You might want to read certain CLI flags and change the behavior of your plugin.

For example, the [browser client](../plugins/browser_client.md) relies on certain CLI flags to switch between browsers, or run browser in headed mode.

</dd>

<dt>

config

</dt>

<dd>

Reference to the [runner config](./runner_config.md). Feel free to mutate the config properties and the changes will be applied accordingly.

</dd>

</dl>
