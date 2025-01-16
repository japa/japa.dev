# OpenAPI Assertions

This plugin allows you to test HTTP responses against one or more OpenAPI specifications. When using it, make sure to register the path to schema files.

## Setup

Install the package from the npm registry as follows.

```sh
npm i -D @japa/openapi-assertions
```

And register it as a plugin within the `bin/test.js` file.

:::note
The OpenAPI assertions rely on the `@japa/assert` package as a peer dependency. Therefore, install and configure the `@japa/assert` package.
:::

```ts
// title: ESM
import { configure, processCliArgs } from '@japa/runner'
import { assert } from '@japa/assert'
// highlight-start
import { openapi } from '@japa/openapi-assertions'
// highlight-end

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    plugins: [
      // highlight-start
      assert(),
      openapi({
        schemas: [new URL('../api-spec.json', import.meta.url)]
      })
      // highlight-end
    ]
  }
})
```

## Testing API Responses

The following method allows you to test response objects from the `axios`, `superagent`, `superset`, `request`, and `light-my-request` libraries.

```ts
test('get /users', async ({ assert }) => {
  const response = await supertest(baseUrl).get('/')
  assert.isValidApiResponse(response)
})
```

The response is validated as follows:

- An error is raised if the request path is not documented in the API schema file.
- An error is raised if the response status code is not documented in the API schema file.
- An error is raised if the body properties are not the same as expected by the schema. Use the `required` array to validate required response properties.
- The response status code is used to find the body schema for validation.
- Response headers are also validated against the expected headers mentioned inside the API schema file.

## Migrating from `@japa/assert` v3.0.0

To migrate from the OpenAPI testing in `@japa/assert` version 3.0.0, you must install and configure the plugin as above. No other changes should be necessary.
