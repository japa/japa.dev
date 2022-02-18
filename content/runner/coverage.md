---
title: Coverage
description: Use existing tools like nyc and c8 to collect coverage metrics for Japa tests.
ogImage: coverage.jpeg
---

# Coverage

Japa does not need any special treatment to collect the code coverage metrics. You can rely on the existing tools like [nyc](https://www.npmjs.com/package/nyc) and [c8](https://github.com/bcoe/c8) for the same.

:::note
Please consult the documentation of the respective tools to view all the available options.
:::

## Using c8
Install the `c8` package from the npm registry and update the test script to use `c8` when running tests.

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

## Using nyc
Install the `nyc` package from the npm registry and update the test script to use `nyc` when running tests.

```json
{
  "scripts": {
    "test": "nyc node bin/test.js"
  }
}
```
