---
title: API client
description: The API client plugin is used to test HTTP endpoints. Optionally, you can also use OpenAPI schema to test JSON endpoints.
---

# API client

The API client plugin of Japa makes it super simple to test your API endpoints over HTTP. You can use it to test any HTTP endpoint that returns JSON, XML, HTML, or plain text.

It has out of the box support for:

- Multiple content types including `application/json`, `application/x-www-form-urlencoded`, and `multipart`.
- Ability to upload files.
- Read and write cookies with the option to register a custom cookies serializer.
- Lifecycle hooks. A great use case of hooks is persisting and loading session data during a request.
- All other common abilities like sending headers, query-string, and following redirects.
- Support for registering custom body serializers and parsers.


:::note

The plugin is built on top of [superagent](https://ladjs.github.io/superagent/). However, it is worth noting that it is not a thin wrapper, so the API is somewhat different.


:::

## Installation

Install the package from the npm registry as follows.

```sh
npm i -D @japa/api-client
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
// highlight-start
import { apiClient } from '@japa/api-client'
// highlight-end
import { configure } from '@japa/runner'

configure({
  files: ['tests/**/*.spec.js'],
  // highlight-start
  plugins: [apiClient('https://localhost:3333')]
  // highlight-end
})
```

Once done. You can access the `client` property from the [Test context](../reference/test_context.md) as follows.

```ts
test('get /users', async ({ client }) => {
  const response = await client.get('/users')

  console.log(response.body())
  console.log(response.status())
})
```

## Making API calls
You can make requests for different HTTP methods as follows. Each method accepts the request endpoint as the only argument.

```ts
test('dummy test', async ({ client }) => {
  await client.get('/users')

  await client.post('/users')

  await client.put('/users')

  await client.patch('/users')

  await client.delete('/users')

  await client.head('/users')

  await client.options('/users')
})
```

You can use the `client.request` method for other HTTP methods.

```ts
test('dummy test', async ({ client }) => {
  await client.request('/users', 'TRACE')
})
```

Executing the request returns an instance of the [Response class](#response-api). An exception is raised only when the response status `>=500`. All other status codes result in resolving the promise.

```ts
const response = await client.get('/users')

console.log(response.status())
console.log(response.body())
console.log(response.method())
console.log(response.headers())
```

## Dump values
Instead of manually logging the response properties to inspect them, you can call the following methods to dump/write them on the console automatically.

```ts
const response = await client.get('/users')
  
response.dumpHeaders()
response.dumpBody()
response.dumpCookies()
response.dumpError()
```

Or call the `dump` method to dump the entire response.

```ts
const response = await client.get('/users')

response.dump()
```

### Dump request

The dump methods are also available on the request class to dump the request body, cookies, and headers.


:::tip

The `dumpBody` does not dump streams or multipart request bodies.


:::

```ts
await client
  .get('/')
  .dumpBody()
  .dumpCookies()
  .dumpHeaders()
```

Or dump everything using the `dump` method.

```ts
await client.get('/').dump()
```

## Form submissions
You can send form data to the server using the `form` method. The content type for the request is automatically set to `application/x-www-form-urlencoded`.

```ts
await client
  .post('/posts')
  .form({
    title: 'Japa 101',
    description: 'Something about the post',
    tags: [1, 2, 4]
  })
```

For submitting raw JSON, you can use the `json` method. This method will set the content type for the request to `application/json`.

```ts
await client
  .post('/posts')
  // highlight-start
  .json({
  // highlight-end
    title: 'Japa 101',
    description: 'Something about the post',
    tags: [1, 2, 4]
  })
```

## File uploads
You can upload files using the `file` method. The method accepts the field name and path to the file as its value. 

This method makes a `multipart/form-data` request to the server.

```ts
await client
  .post('/posts')
  .file('cover_image', join(__dirname, '..', 'cover-image.jpg'))
```

The file content can also be defined as a Buffer or a readable stream. For example:

```ts
await client
  .post('/posts')
  .file('cover_image', createReadStream('./path/to/file'))

// Using buffer
await client
  .post('/posts')
  .file('cover_image', Buffer.from(binaryContents))
```

You cannot use the `form` or `json` methods when making a multipart request. Instead, you must use the `field` or `fields` methods to submit the form data.

```ts
await client
  .post('/posts')
  .file('cover_image', join(__dirname, '..', 'cover-image.jpg'))
  .fields({
    title: 'Japa 101',
    description: 'Something about the post',
    tags: [1, 2, 4]
  })
```

## Cookies
You can use the `cookie/cookies` method to read/write cookies during a request. Since the API client is stateless, the cookies do not persist across requests, providing a clean slate for every request.

```ts
await client
  .post('/posts')
  .cookie('preferred_theme', 'dark')
  .cookie('some_random_key', 'random_value')
```

Or set multiple cookies together using the `cookies` method.

```ts
await client
  .post('/posts')
  .cookies({
    preferred_theme: 'dark',
    some_random_key: 'random_value'
  })
```

Similarly, you can access the cookies sent by the server using the `response.cookies` method.

```ts
const response = await client.post('/posts')

console.log(response.cookies())

// Reading a single cookie
console.log(response.cookie('user_id'))
```

### Cookies serializer
Most of the backend frameworks encrypt or sign cookies to prevent value tampering. You can make use of the cookies serializer to sign/unsign cookies.

You can register the serializer by calling the static `cookiesSerializer` method on the ApiClient class.

:::tip
You can register the cookies serializer inside a separate file and then import it into the `bin/test.js` file or write it directly.
:::

```ts
import { ApiClient } from '@japa/api-client'

ApiClient.cookiesSerializer({
  // Invoked when reading cookies from the response
  process(key, value) {
    return unsignCookie(value)
  },
  
  // Invoked when sending a cookie to the server
  prepare(key, value) {
    return signCookie(value)
  }
})
```

Once the serializer has been registered, all the cookies will be signed/unsigned automatically.

## Assertions
You can validate the API response by directly calling the assertion methods on the response object.

The assertion methods only work when using the `@japa/assert` package as a plugin. Also, the assertions made using the response object count against the planned assertions. For example:

```ts
test('get /users', async ({ client, assert }) => {
  // highlight-start
  assert.plan(2)
  // highlight-end

  const response = await client
    .post('/posts')
    .form({ title: 'Japa 101' })

  // highlight-start
  // 1st assertion
  response.assertStatus(201)

  // 2nd assertion
  response.assertBody({
    title: 'Japa 101'
  })
  // highlight-end
})
```

All the available assertion methods are in the [Assertions API](#assertions-api) section.

## Lifecycle Hooks
Similar to the rest of the testing framework. You can also define lifecycle hooks executed before the request and after getting the response from the server.

You can define the lifecycle hooks globally using the `ApiClient` class or define them for individual requests.

#### Defining hooks globally

```ts
import { ApiClient } from '@japa/api-client'

ApiClient.setup(async (request) => {
  // executed before each request
})

ApiClient.teardown(async (response) => {
  // executed after each request
})
```

#### Defining hooks on request

```ts
test('get /users', async ({ client }) => {
  const response = await client
    .get('/posts')
    .setup(async () => {
      await createDummyPosts(20)
      return () => clearDatabase()
    })

  response.assertStatus(200)
})
```

## Type-safe routes
The API client plugin supports type-safe routes through a routes registry. This allows you to get full type checking for route parameters, request body, query string, and response.

### Defining a routes registry
Define a routes registry object containing your route definitions. Each route has its HTTP methods, URL pattern, and types for params, query, body, and response.

```ts
const routesRegistry = {
  'users.list': {
    methods: ['GET'] as const,
    pattern: '/users',
    types: {} as {
      params: {}
      query: { page?: number; limit?: number }
      body: {}
      response: { users: Array<{ id: number; name: string }> }
    },
  },
  'users.show': {
    methods: ['GET'] as const,
    pattern: '/users/:id',
    types: {} as {
      params: { id: string }
      query: {}
      body: {}
      response: { id: number; name: string }
    },
  }
}
```

Then, augment the `UserRoutesRegistry` interface using `typeof` to enable type checking.

```ts
declare module '@japa/api-client/types' {
  interface UserRoutesRegistry extends typeof routesRegistry {}
}
```

### Configuration
Finally, configure the plugin with the registry and an optional pattern serializer.

```ts
import { apiClient } from '@japa/api-client'

export const plugins: Config['plugins'] = [
  apiClient({
    baseURL: 'http://localhost:3333',
    registry: routesRegistry,
    patternSerializer: (pattern, params) => {
      // Convert pattern like '/users/:id' to '/users/1'
      return pattern.replace(/:(\w+)/g, (_, key) => String(params[key] ?? ''))
    },
  }),
]
```

The `patternSerializer` option allows you to customize how route patterns are converted to URLs. By default, a simple `:param` replacement is used.

### Using visit()
Once your routes are declared, use the `visit` method to make type-safe requests by route name.

```ts
test('list users', async ({ client }) => {
  // TypeScript knows the response type
  const response = await client.visit('users.list')

  // response.body() is typed as { users: Array<{ id: number; name: string }> }
  response.assertBodyContains({ users: [] })
})

test('show user', async ({ client }) => {
  // TypeScript requires the 'id' parameter
  const response = await client
    .visit('users.show', { id: '1' })
  
  response.assertOk()
})

test('create user', async ({ client }) => {
  const response = await client
    .visit('users.store')
    // TypeScript validates the body shape
    .json({ name: 'John', email: 'john@example.com' })
    
  response.assertCreated()
})
```

### Bypassing type checks
Sometimes you need to test invalid payloads to ensure your API properly rejects them. The `unsafeForm`, `unsafeJson`, and `unsafeQs` methods allow you to bypass type checking without using `@ts-ignore`.

```ts
test('rejects invalid payload', async ({ client }) => {
  const response = await client
    .visit('users.store')
    // Send invalid data without TypeScript errors
    .unsafeJson({ invalid: 'payload' })

  response.assertUnprocessableEntity()
})

test('rejects invalid query params', async ({ client }) => {
  const response = await client
    .visit('users.list')
    .unsafeQs({ invalidParam: 'value' })

  response.assertBadRequest()
})
```

## Request API
Following are the available methods on the request class. You can get an instance of the request class by calling the HTTP request methods on the client object. For example:

```ts
const request = client.get('/')
const request = client.post('/')
const request = client.put('/')
const request = client.patch('/')
const request = client.request('/', 'TRACE')
```

### cookie
Set a cookie for the request. The method accepts the cookie name and its value. We will stringify the value unless you have registered a cookie serializer that can handle different data types.

```ts
request.cookie('foo', 'bar')
```

### cookies
Set multiple cookies as a key-value pair.

```ts
request.cookies({
  foo: 'bar',
  bar: 'baz'
})
```

### header
Set request header. The method accepts the header name and the value. The value can either be a string or an array of strings.

```ts
request.header('X-Request-Id', 'value')
```

### headers
Set multiple headers as a key-value pair.

```ts
request.headers({
  'X-Request-Id': 'value'
})
```

### field
Set the form field for the `multipart/form-data` request. The method accepts the field name and its value. One of the following data types is accepted as the value.

- `Blob`
- `Buffer`
- `ReadStream`
- `string`
- `boolean`
- `number`

```ts
request.field('name', 'virk')
request.field('score', 98)
```

### fields
Set multiple fields as a key-value pair.

```ts
request.fields({ name: 'virk', score: 98 })
```

### file
Attach file for the `multipart/form-data` request. The method accepts the field name and its value. You can pass an absolute path to the file or pass `Buffer/ReadableStream`.

```ts
request.file('avatar', join(__dirname, 'storage', 'avatar.jpg'))
request.file('avatar', fs.createReadStream('./avatar.jpg'))
```

You can set the filename and content type as the third argument.

```ts
request.file(
  'avatar',
  join(__dirname, 'storage', 'avatar.jpg'),
  {
    filename: 'profile-pic.jpg',
    contentType: 'image/jpeg'
  }
)
```

### form
Send form data to the server with the `application/x-www-form-urlencoded` content type. The method accepts the form data as an object of a key-value pair.

```ts
request.form({
  title: 'Japa 101',
  description: 'Something about the post',
  tags: [1, 2, 4]
})
```

### unsafeForm
Same as `form`, but bypasses TypeScript type checking. Useful when testing invalid form data to ensure your API properly rejects it.

```ts
request.unsafeForm({
  invalid: 'data'
})
```

### json
The `json` method accepts the same data as the `form` method. However, it sets the request content type to `application/json`.

```ts
request.json({
  title: 'Japa 101',
  description: 'Something about the post',
  tags: [1, 2, 4]
})
```

### unsafeJson
Same as `json`, but bypasses TypeScript type checking. Useful when testing invalid JSON payloads to ensure your API properly rejects them.

```ts
request.unsafeJson({
  invalid: 'payload'
})
```

### qs
Set the query string for the request.

```ts
request.qs({
  order_by: 'id',
  direction: 'desc'
})
```

### unsafeQs
Same as `qs`, but bypasses TypeScript type checking. Useful when testing invalid query parameters to ensure your API properly rejects them.

```ts
request.unsafeQs({
  invalid: 'param'
})
```

### timeout
Set the timeout for the request. The request will be aborted if the server does not respond under the mentioned timeout.

```ts
request.timeout(2000)
```

### type
Set the content type for the request. You can either pass the complete content type or give a shorthand like `json`, which will be converted to `application/json`.

```ts
request.type('json') // Content-type: application/json
```

### accept
Set the `Accept` header for the request. Like the `type` method, you can pass a shorthand for the mime type.

```ts
request.accept('json') // Accept: application/json
```

### redirects
Instruct request to follow server redirects. By default, five redirects are followed. However, you can set the custom count using this method.

```ts
// follow two redirects from the server
request.redirects(2)
```

You can find the redirect links using the `response.redirects()` method.

```ts
const response = await request.redirects(2)
console.log(response.redirects())
```

### basicAuth
Set the basic auth HTTP header from the user credentials.

```ts
// Authorization: Basic dmlyazpzZWNyZXQ=
request.basicAuth('virk', 'secret')
```

### bearerToken
Set the bearer token in the Authorization header. 

```ts
// Authorization: Bearer foo-bar
request.bearerToken('foo-bar')
```

### dump
Dump the request's data to the console. The method is meant to be used for quick debugging only.

```ts
request.dump()
```

The `dump` method logs the entire request to the console. However, you can use the following methods to log specific values.

```ts
request.dumpCookies()
request.dumpHeaders()
request.dumpBody()
```

### trustLocalhost
Trust insecure SSL connections for localhost. You can learn about this method directly from the [superagent docs](https://ladjs.github.io/superagent/#ignoring-brokeninsecure-https-on-localhost)

```ts
request.trustLocalhost()

// disable
request.trustLocalhost(false)
```

### TLS options
The following methods to configure the TLS settings work similarly to [superagent](https://ladjs.github.io/superagent/#tls-options).

- `ca`: Set the CA certificate(s) to trust
- `cert`: Set the client certificate chain(s)
- `privateKey`: Set the client private key(s)
- `pfx`: Set the client PFX or PKCS12 encoded private key and certificate chain
- `disableTLSCerts`: Accepts expired or invalid TLS certs. Sets internally rejectUnauthorized=true. Be warned; this method allows MITM attacks.

## Response API
Following is the list of methods available in the Response class.

### text
Returns the unparsed response body as text. The property is only available when the response content-type type matches `text/`, `/json`, or `x-www-form-urlencoded`.

```ts
response.text()
```

### body
Returns the parsed response body. The body is parsed when the content type matches `application/json`, `application/x-www-form-urlencoded`, and `multipart/form-data`.

```ts
response.body()
```

### cookie
Get value for a given cookie. The cookie value contains the following properties.

- `name`
- `value`
- `path?`
- `domain?`
- `expires?`
- `maxAge?`
- `secure?`
- `httpOnly?`
- `sameSite?`

```ts
const value = response.cookie('cart_value')
```

### cookies
Returns all cookies as an object of the key-value pair.

```ts
response.cookies()
```

### header
Returns the value for a given response header.

```ts
response.header('X-Time')
```

### headers
Returns the response headers as an object.

```ts
response.headers()
```

### status
Returns the response status.

```ts
response.status()
```

### type
Returns the response content type.

```ts
response.type()
```

### redirects
Access the redirects the request followed before getting the response. The method returns an array of URLs.

```ts
response.redirects()
```

### files
Access the files returned by the server. The files are only collected when the response content type is `multipart/form-data`.

```ts
response.files()
```

### hasBody
Find if the response contains a parsed body. The method returns true when the `response.body()` exists.

```ts
if (response.hasBody()) {
  response.body()
}
```

### hasError
Find if the response contains the error or not.

```ts
if (response.hasError()) {
  response.error()
}
```

### hasFatalError
Find if the response contains a fatal error. Response with status code `>= 500`is considered as a fatal error.

```ts
if (response.hasFatalError()) {
  response.error()
}
```

### error
Returns the response error if it exists.

```ts
response.error()

// Response status
response.error().status

// Error text
response.error().text
```

### charset
Returns the response charset. It only exists if the response content type mentions the charset.

```ts
response.charset()
```

### links
Returns an object of links by parsing the response "Link" header.

```ts
// Link: <https://one.example.com>; rel="preconnect", <https://two.example.com>; rel="preload"

{
  preconnect: 'https://one.example.com',
  preload: 'https://two.example.com',
}
```

### statusType
Returns the response status type. The status type is the class in which the status code falls. For example:

```ts
response.status() // 301
response.statusType() // 3

response.status() // 404
response.statusType() // 4

response.status() // 202
response.statusType() // 2
```

## Assertions API
You can validate the API response by directly calling the assertion methods on the response object.

### assertCookie
Assert the given cookie exists. Optionally, you can also assert the cookie value.

```ts
response.assertCookie('foo')

/**
 * Two assertions are executed under the hood
 * when the value is provided
 */
response.assertCookie('foo', 'bar')
```

### assertCookieMissing
Assert the cookie does not exist in the response.

```ts
response.assertCookieMissing('foo')
```

### assertHeader
Assert the given header exists. Optionally, you can also assert the header value.

```ts
response.assertHeader('X-Time')

/**
 * Two assertions are executed under the hood
 * when the value is provided
 */
response.assertHeader('X-Time', '10')
```

### assertHeaderMissing
Assert the header does not exist in the response.

```ts
response.assertHeaderMissing('X-Powered-By')
```

### assertStatus
Assert for the response status

```ts
response.assertStatus(200)
```

### assertBody
Assert the response body matches the expected value. An exact match is performed.

```ts
response.assertBody({
  id: 1,
  name: 'virk',
  password: 'secret'
})
```

### assertBodyContains
Assert the response body contains the subset of the expected value. This method allows you to only match against a subset and not the exact value.

```ts
response.assertBodyContains({
  id: 1,
})
```

### assertBodyNotContains
Assert the response body doesn't contain the subset of the expected value. This method allows you to only match against a subset and not the exact value.

```ts
response.assertBodyNotContains({
  id: 1,
})
```

### assertTextIncludes
Assert the response text includes the expected sub-string. 

```ts
response.assertTextIncludes(`<h1> Hello world </h1>`)
```

### assertAgainstApiSpec
You can validate the response against an Open API schema using the `assertAgainstApiSpec`. This method relies on the `@japa/assert` package, so read the [Open API testing](./assert.md#open-api-testing) section to register your API schemas.

```ts
response.assertAgainstApiSpec()
```

### assertRedirectsTo(pathname)
Assert the current HTTP request has been redirected to a given pathname. The pathname is matched using the strict equality check against the [response.redirects()](#redirects) output.

```ts
response.assertRedirectsTo('/posts/1')
```

### assertOk
Assert that response has an ok (`200`) status

```ts
response.assertOk()
```

### assertCreated
Assert that response has a created (`201`) status

```ts
response.assertCreated()
```

### assertAccepted
Assert that response has an accepted (`202`) status

```ts
response.assertAccepted()
```

### assertNoContent
Assert that response has a no content (`204`) status

```ts
response.assertNoContent()
```

### assertMovedPermanently
Assert that response has a moved permanently (`301`) status

```ts
response.assertMovedPermanently()
```

### assertFound
Assert that response has a found (`302`) status

```ts
response.assertFound()
```

### assertBadRequest
Assert that response has a bad request (`400`) status

```ts
response.assertBadRequest()
```

### assertUnauthorized
Assert that response has an unauthorized (`401`) status

```ts
response.assertUnauthorized()
```

### assertPaymentRequired
Assert that response has a payment required (`402`) status

```ts
response.assertPaymentRequired()
```

### assertForbidden
Assert that response has a forbidden (`403`) status

```ts
response.assertForbidden()
```

### assertNotFound
Assert that response has a not found (`404`) status

```ts
response.assertNotFound()
```

### assertMethodNotAllowed
Assert that response has a method not allowed (`405`) status

```ts
response.assertMethodNotAllowed()
```

### assertNotAcceptable
Assert that response has a not acceptable (`406`) status

```ts
response.assertNotAcceptable()
```

### asserRequestTimeout
Assert that response has a request timeout (`408`) status

```ts
response.assertRequestTimeout()
```

### assertConflict
Assert that response has a conflict (`409`) status

```ts
response.assertConflict()
```

### assertGone
Assert that response has a gone (`410`) status

```ts
response.assertGone()
```

### assertLengthRequired
Assert that response has a length required (`411`) status

```ts
response.assertLengthRequired()
```

### assertPreconditionFailed
Assert that response has a precondition failed (`412`) status

```ts
response.assertPreconditionFailed()
```

### assertPayloadTooLarge
Assert that response has a payload too large (`413`) status

```ts
response.assertPayloadTooLarge()
```

### assertURITooLong
Assert that response has an URI too long (`414`) status

```ts
response.assertURITooLong()
```

### assertUnsupportedMediaType
Assert that response has an unsupported media type (`415`) status

```ts
response.assertUnsupportedMediaType()
```

### assertRangeNotSatisfiable
Assert that response has a range not satisfiable (`416`) status

```ts
response.assertRangeNotSatisfiable()
```

### assertImATeapot
Assert that response has an im a teapot (`418`) status

```ts
response.assertImATeapot()
```

### assertUnprocessableEntity
Assert that response has an unprocessable entity (`422`) status

```ts
response.assertUnprocessableEntity()
```

### assertLocked
Assert that response has a locked (`423`) status

```ts
response.assertLocked()
```

### assertTooManyRequests
Assert that response has a too many requests (`429`) status

```ts
response.assertTooManyRequests()
```

## Extending classes
The following classes exposed by the `@japa/api-client` package are extensible using macros and getters.

- [ApiRequest](https://github.com/japa/api-client/blob/3.x/src/request.ts)
- [ApiResponse](https://github.com/japa/api-client/blob/3.x/src/response.ts)

:::note
You can write the code for extending the classes within the `bin/test.js` file or create a new file and import it inside the `bin/test.js` file.
:::

### About getters and macros
Getters and macros expose the API to add custom properties to the test class.

A `getter` is a function evaluated lazily when accessing the property.

```ts
import { ApiResponse } from '@japa/api-client'

ApiResponse.getter('responseTime', function () {
  return this.header('X-Time')
})
```

Whereas `macros` can be both functions and literal values. You can access the test instance using `this`.

```ts
import { ApiRequest } from '@japa/api-client'

ApiRequest.macro('requestId', function (id) {
  this.header('X-Request-Id', id)
  return this
})

// Usage
await client
  .get('/')
  .requestId('10')
```

### Usage with TypeScript
Since getters and macros are added at runtime, you must inform the TypeScript compiler about these new properties separately. 

You can use [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to define these properties at a static level.

Create a new file, `bin/japaTypes.ts`, and paste the following code.

```ts
declare module '@japa/api-client' {
    
  // Interface must match the class name
  interface ApiRequest {
    requestId(id: string): this
  }

  interface ApiResponse {
    responseTime: string | undefined
  }
}
```

## Custom response parsers
The `@japa/api-client` plugin automatically parses the response body for the following content types.

- `text/*`
- `image/*`
- `application/json`
- `application/x-www-form-urlencoded`
- `multipart/form-data`

However, you can also register custom parsers to process unsupported content types.

The parser is registered globally on the [ApiRequest](https://github.com/japa/api-client/blob/3.x/src/request.ts) class using the `addParser` method.

```ts
import { ApiRequest } from '@japa/api-client'

ApiRequest.addParser('application/vnd.api+json', function (response, cb) {
  response.setEncoding('utf-8')
  response.text = ''

  /**
   * Concatenate chunks
   */
  response.on('data', (chunk) => (response.text += chunk))

  /**
   * Parse collected chunks as JSON
   */
  response.on('end', () => {
    try {
      const body = JSON.parse(response.text)
      cb(null, body)
    } catch (error) {
      error.rawResponse = response.text || null
      error.statusCode = response.statusCode
      cb(error)
    }
  })

  /**
   * Report error (if any)
   */
  response.on('error', (error) => cb(error, null))
})
```

- The `addParser` method accepts the content type as the first argument and the implementation callback as the second argument.
- The callback receives the [Node.js ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) and a callback.
- You must invoke the callback with an error or the parsed response body.

## Custom request serializers
Like the response parser, you can also register custom serializers to serialize the request body before sending it to the server.

The following content types are handled automatically.

- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

You can register a custom serializer globally on the [ApiRequest](https://github.com/japa/api-client/blob/3.x/src/request.ts) class using the `addSerializer` method.

```ts
import { ApiRequest } from '@japa/api-client'

ApiRequest.addSerializer('application/vnd.api+json', function (value) {
  return JSON.stringify(value)
})
```

- The `addSerializer` method accepts the content type as the first argument and its implementation callback as the second argument.
- The callback values the request body set using `request.form` or `request.json`, which must return a string.
