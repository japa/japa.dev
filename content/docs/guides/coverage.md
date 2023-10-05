# Code Coverage

You may use pre-exiting industry standard tools like [nyc](https://www.npmjs.com/package/nyc) and [c8](https://github.com/bcoe/c8) to collect the code coverage metrics from your tests.

Following are the examples of using both `c8` and `nyc` with Japa. Also, make sure to consult the documentation of respective tools for advanced usage.


:::caption{for="info"}
**Using c8**
:::

```sh
npm i -D c8
```

```json
{
  "scripts": {
    "test": "c8 node bin/test.js"
  }
}
```

```sh
npm test
```

:::caption{for="info"}
**Using nyc**
:::

```sh
npm i -D nyc
```

```json
{
  "scripts": {
    "test": "nyc node bin/test.js"
  }
}
```

```sh
npm test
```