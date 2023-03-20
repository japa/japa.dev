---
title: API client
description: API client plugin is used to test HTTP endpoints. Optionally, you can also use OpenAPI schema to test JSON endpoints.
ogImage: api-client-plugin.jpeg
---

# API client

The API client plugin of Japa makes it super simple to test your API endpoints over HTTP. You can use it to test any HTTP endpoint that returns JSON, XML, HTML, or even plain text.

It has out of the box support for:

- Multiple content types including `application/json`, `application/x-www-form-urlencoded` and `multipart`.
- Ability to upload files.
- Read and write cookies with the option to register custom cookies serializer.
- Lifecycle hooks. A great use-case of hooks is to persist and load session data during a request.
- All other common abilities like sending headers, query-string, and following redirects.
- Support for registering custom body serializers and parsers.

:::note
The plugin is built on top of [superagent](https://ladjs.github.io/superagent/). However, it is worth noting that it is not a thin wrapper, and therefore the API is somewhat different.
:::

## Setup
Install the package from the npm registry as follows.

```sh
npm i -D @japa/api-client

# yarn
yarn add -D @japa/api-client
```

And register it as a plugin within the `bin/test.js` file.

:::languageSwitcher

```ts
// title: ESM
// highlight-start
import { apiClient } from '@japa/api-client'
// highlight-end
import { configure, processCliArgs } from '@japa/runner'

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [apiClient('https://localhost:3333')]
    // highlight-end
  }
})
```

```ts
// title: CommonJS
// highlight-start
const { apiClient } = require('@japa/api-client')
// highlight-end
const { configure, processCliArgs } = require('@japa/runner')

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    // highlight-start
    plugins: [apiClient('https://localhost:3333')]
    // highlight-end
  }
})
```
:::

Once done. You can access the `client` property from the [Test context](../test-context.md) as follows.

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

You can use the `client.request` method for any other HTTP method.

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

Or just call the `dump` method to dump the entire response.

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

The file content can also be defined as Buffer or a readable stream. For example:

```ts
await client
  .post('/posts')
  .file('cover_image', createReadStream('./path/to/file'))

// Using buffer
await client
  .post('/posts')
  .file('cover_image', Buffer.from(binaryContents))
```

When making a multipart request, you cannot use `form` or `json` methods. Instead, you must use either the `field` or `fields` methods to submit the form data.

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

:::languageSwitcher

```ts
// title: ESM
import { ApiClient } from '@japa/api-client'

ApiClient.cookiesSerializer({
  // Invoked when reading cookies from the response
  process(key, value) {
    return unsignCookie(value)
  },
  
  // Invoked when sending cookie to the server
  prepare(key, value) {
    return signCookie(value)
  }
})
```

```ts
// title: CommonJS
const { ApiClient } = require('@japa/api-client')

ApiClient.cookiesSerializer({
  // Invoked when reading cookies from the response
  process(key, value) {
    return unsignCookie(value)
  },
  
  // Invoked when sending cookie to the server
  prepare(key, value) {
    return signCookie(value)
  }
})
```

:::

Once the serializer has been registered, all the cookies will be signed/unsigned automatically.

## Assertions
You can validate the API response by directly calling the assertion methods on the response object.

:::note
The support for `@japa/expect` is on its way and will be released soon.
:::

The assertions methods only work when you are using the `@japa/assert` package as a plugin. Also, the assertions made using the response object count against the planned assertions. For example:

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

You can find all the available assertions methods in the [Assertions API](#assertions-api) section.

## Lifecycle Hooks
Similar to the rest of the testing framework. You can also define lifecycle hooks executed before the request and after getting the response from the server.

You can either define the lifecycle hooks globally using the `ApiClient` class directly or define them for individual requests.

#### Defining hooks globally

:::languageSwitcher

```ts
// title: ESM
import { ApiClient } from '@japa/api-client'

ApiClient.setup(async (request) => {
  // executed before each request
})

ApiClient.teardown(async (response) => {
  // executed after each request
})
```

```ts
// title: CommonJS
const { ApiClient } = require('@japa/api-client')

ApiClient.setup(async (request) => {
  // executed before each request
})

ApiClient.teardown(async (response) => {
  // executed after each request
})
```
:::

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
Set cookie for the request. The method accepts the cookie name and its value. We will stringify the value unless you have registered a cookie serializer that can handle different data types.

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
Set form field for the `multipart/form-data` request. The method accepts the field name and its value. One of the following data types are accepted as the value.

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
Send form data to the server with `application/x-www-form-urlencoded` content type. The method accepts the form data as an object of key-value pair.

```ts
request.form({
  title: 'Japa 101',
  description: 'Something about the post',
  tags: [1, 2, 4]
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

### qs
Set the query string for the request.

```ts
request.qs({
  order_by: 'id',
  direction: 'desc'
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
Set the `Accept` header for the request. Like the `type` method, you can pass a shorthand for the mime-type.

```ts
request.accept('json') // Accept: application/json
```

### redirects
Instruct request to follow server redirects. By default, five redirects are followed. However, you can set the custom count using this method.

```ts
// follow 2 redirects from the server
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
Dump the request data to the console. The method is meant to be used for quick debugging only.

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
Trust insecure SSL connections for localhost. You can learn about this method directly from the [superagent docs](https://visionmedia.github.io/superagent/#ignoring-brokeninsecure-https-on-localhost)

```ts
request.trustLocalhost()

// disable
request.trustLocalhost(false)
```

### TLS options
The following methods to configure the TLS settings work similarly to [superagent](https://visionmedia.github.io/superagent/#tls-options).

- `ca`: Set the CA certificate(s) to trust
- `cert`: Set the client certificate chain(s)
- `privateKey`: Set the client private key(s)
- `pfx`: Set the client PFX or PKCS12 encoded private key and certificate chain
- `disableTLSCerts`: Accepts expired or invalid TLS certs. Sets internally rejectUnauthorized=true. Be warned, this method allows MITM attacks.

## Response API
Following is the list of methods available in the Response class.

### text
Returns the unparsed response body as text. The property is only available when the response content-type type matches `text/`, `/json`, or `x-www-form-urlencoded`.

```ts
response.text()
```

### body
Returns the parsed response body. The body is parsed when the content-type matches `application/json`, `application/x-www-form-urlencoded` and `multipart/form-data`.

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
Returns all cookies as an object of key-value pair.

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
Returns the response content-type.

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
You can validate the response against an Open API schema using the `assertAgainstApiSpec`. This method relies on the `@japa/assert` package, so read [Open API testing](./assert.md#open-api-testing) section to register your API schemas.

```ts
response.assertAgainstApiSpec()
```

### assertRedirectsTo(pathname)
Assert the current HTTP request has been redirected to a given pathname. The pathname is matched using the strict equality check against the [response.redirects()](#redirects) output.

```ts
response.assertRedirectsTo('/posts/1')
```

## Extending classes
The following classes exposed by the `@japa/api-client` package are extensible using macros and getters.

- [ApiRequest](https://github.com/japa/api-client/blob/develop/src/Request/index.ts)
- [ApiResponse](https://github.com/japa/api-client/blob/develop/src/Response/index.ts)

:::note
You can write the code for extending the classes within the `bin/test.js` file or create a new file and import it inside the `bin/test.js` file.
:::

### About getters and macros
Getters and macros expose the API to add custom properties to the test class.

A `getter` is a function that is evaluated lazily when accessing the property.

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

Create a new file, `bin/japaTypes.ts`, and paste the following code inside it.

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

However, you can also register custom parsers to process unsupported content types as follows.

The parser is registered globally on the [ApiRequest](https://github.com/japa/api-client/blob/develop/src/Request/index.ts) class using the `addParser` method.

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
- You must invoke the callback either with an error or the parsed response body.

## Custom request serializers
Like the response parser, you can also register custom serializers to serialize the request body before sending it to the server.

Following content types are handled automatically.

- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

You can register a custom serializer globally on the [ApiRequest](https://github.com/japa/api-client/blob/develop/src/Request/index.ts) class using the `addSerializer` method.

```ts
import { ApiRequest } from '@japa/api-client'

ApiRequest.addSerializer('application/vnd.api+json', function (value) {
  return JSON.stringify(value)
})
```

- The `addSerializer` method accepts the content type as the first argument and its implementation callback as the second argument.
- The callback values the request body set using `request.form` or `request.json`, and it must return a string.
