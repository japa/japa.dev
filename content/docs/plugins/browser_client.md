---
title: Browser client
description: The browser client plugin of Japa is built on top of Playwright for writing end-to-end browser tests.
---

# Browser client

The browser client of Japa is built on top of [Playwright library](https://playwright.dev/docs/library) and integrates seamlessly with the Japa test runner. Following are some reasons to use this plugin over manually interacting with the Playwright API.

- Automatic management of browsers and browser contexts.
- Built-in assertions.
- Ability to extend the `browser`, `context`, and `page` objects using [decorators](#decorators).
- Class-based pages and interactions to de-compose the page under test into smaller and reusable components.
- Toggle headless mode, tracing, and browsers using CLI flags.

## Installation

The browser client plugin has peer dependencies on the [`@japa/assert`](./assert.md) plugin and the [`playwright`](https://playwright.dev/docs/library) library. Make sure to install them before installing this plugin.

```sh
// title: Peer dependencies
npm i -D @japa/assert playwright
```

```sh
npm i -D @japa/browser-client
```

And register it as a plugin within the entry point file, i.e. (`bin/test.js`)

```ts
import { assert } from '@japa/assert'
import { configure } from '@japa/runner'
// highlight-start
import { browserClient } from '@japa/browser-client'
// highlight-end

configure({
  plugins: [
    assert(),
    // highlight-start
    browserClient({
      runInSuites: ['browser']
    })
    // highlight-end
  ]
})
```


### Configuring browser suite
You must configure a separate suite for browser tests. This ensures the rest of your tests do not get slow, as this plugin will create a new [browser context](https://playwright.dev/docs/api/class-browsercontext) for each test.

In the following example, we create two test suites, one for running browser tests and another for running unit tests. Also, we tell the `browserClient` plugin to create a new browser context only in the `browser` suite.

```ts
configure({
  // highlight-start
  suites: [
    {
      name: 'browser',
      timeout: 30 * 1000,
      files: ['tests/browser/**/*.spec.js'],
    },
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.js'],
    }
  ],
  // highlight-end
  plugins: [
    assert(),
    browserClient({
      // highlight-start
      runInSuites: ['browser']
      // highlight-end
    })
  ]
})
```

## Basic example
Once the setup is completed, you can write tests inside the `tests/browser` directory. 

```ts
// title: tests/browser/visit_japa.spec.js
import { test } from '@japa/runner'

test('has docs for browser client', async ({ visit }) => {
  const page = await visit('https://japa.dev/docs')
  await page.getByRole('link', { name: 'Browser client' }).click()

  /**
   * Assertions
   */
  await page.assertPath('/docs/plugins/browser-client')
  await page.assertTextContains('body', 'Browser client')
})
```

Let's run the test using the `node bin/test.js` file.

```sh
node bin/test.js

# Run tests for browser suite
node bin/test.js browser

# Launch browser
node bin/test.js browser --headed

# Run in slow motion
node bin/test.js browser --headed --slow
```

## Browser API
Since the browser client plugin uses Playwright under the hood, you can access all the Playwright library methods. Refer to the following example for more information. 

```ts
test('has docs for browser client', async ({
  browser,
  browserContext,
  visit
}) => {
  // Create new page
  const page = await browserContext.newPage()
  await page.goto(url)

  // Or use visit helper
  const page = await visit(url)

  // Create multiple contexts
  const context1 = await browser.newContext()
  const context2 = await browser.newContext()
})
```

<dl>

<dt>

page

</dt>

<dd>

Reference to the [Playwright's Page class](https://playwright.dev/docs/api/class-page). You can get an instance of it either using the `visit` method or the `browserContext.newPage` method.

</dd>

<dt>

browserContext

</dt>

<dd>

Reference to the [Playwright's Context class](https://playwright.dev/docs/api/class-browsercontext). An isolated instance of `browserContext` is shared with every test.

</dd>

<dt>

browser

</dt>

<dd>

Reference to the [Playwright's Browser class](https://playwright.dev/docs/api/class-browser).

</dd>

<dt>

visit

</dt>

<dd>

A helper method to create a new page and visit a URL in a single step. The browser client plugin adds the `visit` helper.

</dd>


</dl>

## Configuration

You can configure the plugin when registering it inside the `plugins` array. Following is the list of available options.

```ts
plugins: [
  browserClient({
    runInSuites: ['browser'],
    contextOptions: {},
    tracing: {
      enabled: false,
      event: 'onError',
      cleanOutputDirectory: true,
      outputDirectory: join(__dirname, '..')
    }
  })
]
```

<dl>

<dt>

runInSuites

</dt>

<dd>

Configure the plugin to run for selected test suites.

```ts
browserClient({
  runInSuites: ['browser'],
})
```

</dd>

<dt>

launcher

</dt>

<dd>

An optional function to manually launch a playwright browser. By default, we launch the chromium browser, and you can choose other browsers using the `--browser` flag. 

You might want to implement this function if you need more control over launching a new browser with [custom options](https://playwright.dev/docs/api/class-browsertype#browser-type-launch).

```ts
import { firefox } from 'playwright'

browserClient({
  async launcher(options) {
    return firefox.launch({
      ...options,
      ...customOptionsToMerge
    })
  }
})
```

</dd>

<dt>

contextOptions

</dt>

<dd>

Configuration options to use when creating a new browser context behind the scenes. The `contextOptions` are given to the [`browser.newContext`](https://playwright.dev/docs/api/class-browser#browser-new-context) method as it is.

```ts
browserClient({
  contextOptions: {
    baseURL: 'http://localhost:3333',
    colorScheme: 'dark',
  }
})
```

</dd>

<dt>

tracing

</dt>

<dd>

The `tracing` property allows you to control the tracing event and options for generating test traces.

See also: [Tracing](#tracing-1)

```ts
import { join } from 'path'

browserClient({
  tracing: {
    enabled: false, // can be enabled using --trace flag
    event: 'onError',
    cleanOutputDirectory: true,
    outputDirectory: join(__dirname, '../tests/traces')
  }
})
```

</dd>

</dl>

## CLI flags
You can use the following CLI flags to control the behavior of tests.

### browser
The `--browser` flag allows you to switch between browsers at runtime. This flag is only used when a custom [`launcher`](#launcher) method is not defined.

```sh
node bin/test.js --browser=chromium

node bin/test.js --browser=webkit

node bin/test.js --browser=firefox
```

### trace
The `--trace` flag allows you to enable the automatic tracing of tests. You must pass the event for tracing as the flag value.

```sh
# Generate trace file when a test fails
node bin/test.js --trace=onError

# Generate trace file for all tests
node bin/test.js --trace=onTest
```

### slow
The `--slow` flag allows you to enable slow mode. In slow mode, all operations will be slowed down by a specified amount of milliseconds.

```sh
# Slow operations by 100ms
node bin/test.js --slow

# Slow operations by 500ms
node bin/test.js --slow=500
```

### devtools
Open the browser devtools automatically after launching the browser. The `--devtools` flag will disable the headless mode.

```sh
node bin/test.js --devtools
```

### headed
The `--headed` flag disables the headless mode.

```sh
node bin/test.js --headed
```

## Class-based pages
Pages serve as an organization layer for your tests. Instead of writing all the operations inline inside the test callback, you can use dedicated page classes to encapsulate the logic for a page or an interaction.

For example, if you are writing tests for a blog, you may create test pages for listing all posts, creating a post, viewing a post, and so on.

Let's create a page class for testing the posts list view. You can organize your tests and pages as you like, but we will keep the pages next within the test directory for this example.

```sh
tests/
├── browser
│   └── posts
│       ├── list.spec.js
│       └── pages
│           └── listing_page.js
```

### Create the listing page
A page must extend the `BasePage` class and define the URL to visit during the test. The primary goal of a page class is to encapsulate the testing behavior and expose a declarative API.

```ts
import { BasePage } from '@japa/browser-client'

export class PostsListingPage extends BasePage {
  url = '/posts'

  async assertHasEmptyList() {
    await this.page.assertTextContains('.posts_list', 'No posts found. Check back later')
  }

  async assertPostsCount(count: number) {
    await this.page.assertElementsCount('.post', count)
  }

  async assertHasPost(title: string) {
    await this.page.assertExists(
      this.page.locator('.post h2', { hasText: title })
    )
  }

  async paginateTo(page: number) {
    await this.page.locator('.pagination_links a', { hasText: String(page) }).click()
  }
}
```

Once you have created a page, you can import it inside a test and use its public API to test an endpoint behavior expressively.

```ts
import { test } from '@japa/runner'
import { PostsListingPage } from './pages/listing_page.js'

test.group('Posts | list', () => {
  test('see an empty list, when posts does not exists', async ({ visit }) => {
    const page = await visit(PostsListingPage)
    await page.assertHasEmptyList()
  })

  test('see first 10 posts', async ({ visit }) => {
    await PostsFactory.createMany(10)
    const page = await visit(PostsListingPage)
    await page.assertPostsCount(10)
  })

  test('navigate using pagination', async ({ visit }) => {
    const posts = await PostsFactory.createMany(20)

    const page = await visit(PostsListingPage)
    await page.paginateTo(2)
    await page.assertHasPost(posts[10].title)
  })
})
```

### Using page class with an existing page
You can use the Page classes with an existing page object using the `page.use` method. For example, you can create a page for viewing a single blog post and mount it inside an existing **CreatePostPage** or **UpdatePostPage**.

```ts
import { BasePage } from '@japa/browser-client'

export class ViewPostPage extends BasePage {
  async assertViewingPost(title: string) {
    await this.page.assertPathMatches(/\/posts\/[0-9]+/)

    await this.page.assertExists(
      this.page.locator('.post h1', { hasText: title })
    )
  }
}
```

```ts
import { ViewPostPage } from './pages/view_post_page.js'

test.group('Posts | create', () => {
  test('create post and redirect to single post view', async ({ visit }) => {
    const page = await visit('/posts/create')
    const post = await getPostData()
    await page.submitForm(post)

    await page
      .use(ViewPostPage)
      .assertViewingPost(post.title)
  })
})
```

## Debugging
You can debug your tests using the `PWDEBUG` environment variable or by pausing the test using the `page.pause` method.

```sh
PWDEBUG=console node bin/test.js
```

Alongside the `page.pause` method, you can use the `page.pauseIf` and `page.pauseUnless` methods to pause the script conditionally.

```ts
test('visit home page', async ({ visit }) => {
  const page = await visit('/')
  await page.pauseIf(process.env.DEBUG_TEST)
  await page.pauseUnless(process.env.NO_DEBUG)
})
```

## Tracing
Playwright supports generating traces for actions performed using the Playwright's API. Traces are stored as zip files on your computer, and you can view them using either [trace.playwright.dev](https://trace.playwright.dev/) or the `npx playwright show-trace trace-file.zip` command.

Using the `@japa/browser-client` plugin, you can automatically generate traces using the `--trace` CLI flag. The `--trace` flag accepts the event at which to create the trace file.

- The `onError` event will generate trace files for failing tests.
- The `onTest` event will generate trace files for all the tests.

```sh
node bin/test.js --trace=onError
```

You can control the output directory for trace files using the `tracing.outputDirectory` config option.

```ts
browserClient({
  tracing: {
    enabled: false, // will be enabled using the --trace flag
    event: 'onError',
    cleanOutputDirectory: true,
    // highlight-start
    outputDirectory: join(__dirname, '../tests/traces')
    // highlight-end
  }
})
```

## Switching between browsers
You can run your tests against different browsers using the `--browser` flag. Following is the list of valid browser options.

- chromium
- firefox
- webkit

```sh
node bin/test.js --browser=firefox
node bin/test.js --browser=chromium
```

You may add the above commands as npm scripts and run them together if needed.

```json
{
  "test:firefox": "node bin/test.js --browser=firefox",
  "test:chromium": "node bin/test.js --browser=chromium",
  "test": "npm run test:firefox && npm run test:chromium"
}
```

## Decorators
The browser client plugin allows you to extend the [browser context](https://playwright.dev/docs/api/class-browsercontext) object, the [page](https://playwright.dev/docs/api/class-page) object, and the [response](https://playwright.dev/docs/api/class-response) object using decorators. You can create a custom decorator can register it with the `decoratorsCollection`.

```ts
import { decoratorsCollection } from '@japa/browser-client'

decoratorsCollection.register({
  /**
   * Extend page
   */
  page(page) {
    page.getWidth = function () {
      return this.viewportSize().width
    }
  },

  /**
   * Extend context
   */
  context(context) {
    context.injectShaHash = function () {
      this.exposeFunction('sha256', (text) => {
        return crypto.createHash('sha256').update(text).digest('hex')
      })
    }
  },
  
  /**
   * Extend response
   */
  response(response) {
    response.getResponseTime = function () {
      return this.headers()['x-response-time']
    }
  },
})
```

If you use TypeScript, you must use [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) to define types for the added properties and methods.

```ts
declare module 'playwright' {
  export interface Page {
    getWidth(): number
  }

  export interface BrowserContext {
    injectShaHash(): void
  }

  export interface Response {
    getResponseTime(): String | undefined
  }
}
```

## Assertions
You can write assertions for a page using the `page.assert*` methods. All assertion methods are asynchronous, so `await` them.

### assertExists
Assert an element to exist. The method accepts either a string selector or the locator object.

```ts
const page = visit('/')

await page.assertExists('h2')
await page.assertExists(page.locator('h2', { hasText: 'It works!' }))
```

### assertNotExists
Assert an element not to exist. The method accepts either a string selector or the locator object.

```ts
const page = visit('/')

await page.assertNotExists('input[type="email"] + p')
await page.assertNotExists(page.getByRole('alert'))
```

### assertElementsCount
Assert an element to exist and have a matching count. The method accepts either a string selector or the locator object.

```ts
const page = visit('/')

await page.assertElementsCount('.posts', 10)
await page.assertElementsCount(page.locator('.posts'))
```

### assertVisible
Assert an element to be visible. Elements with `display:none` and `visibility:hidden` are invisible.

```ts
const page = visit('/')
await page.getByText('Delete post').click()

await page.assertVisible('.confirmation-modal')
await page.assertVisible(
  page.getByText('Are you sure, you want to delete this post?')
)
```

### assertNotVisible
Assert an element to be not visible. Elements with `display:none` and `visibility:hidden` are invisible.

```ts
const page = visit('/')

await page.assertNotVisible('.confirmation-modal')
await page.assertNotVisible(
  page.getByText('Are you sure, you want to delete this post?')
)
```

### assertTitle
Assert the page title to match the expected value. 

```ts
const page = visit('/')

await page.assertTitle('Home page')
```

### assertTitleContains
Assert the page title to include a substring value.

```ts
const page = visit('/posts/1')

await page.assertTitleContains('Post - ')
```

### assertUrl
Assert the page URL to match the expected value. The assertion is performed against the complete URL, including the domain and query string values.

```ts
const page = visit('/posts')

await page.assertUrl('https://foo.com/posts?order_by=popular')
```

### assertUrlContains
Assert the page URL to contain the expected substring. The assertion is performed against the complete URL, including the domain and query string values.

```ts
const page = visit('/posts')

await page.assertUrlContains('/posts?')
```

### assertUrlMatches
Assert the page URL to match the given regular expression.

```ts
const page = visit('/posts')

await page.assertUrlMatches(/posts(\?)?/)
```

### assertPath
Assert the page path to match the expected value. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

```ts
const page = visit('/posts/1')

await page.assertPath('/posts/1')
```

### assertPathContains
Assert the page path to contain the expected substring. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

```ts
const page = visit('/posts/1')

await page.assertPathContains('/posts/')
```

### assertPathMatches
Assert the page path to match the expected regex. The URL is parsed using the Node.js URL parser, and the pathname value is used for assertion.

```ts
const page = visit('/posts/1')

await page.assertPathMatches(/\/posts\/[0-9]+/)
```

### assertQueryString
Asserts the page URL querystring to contain values for the expected object.

```ts
const page = visit('/posts')
await page
  .locator('.pagination_links a', { hasText: '2' })
  .click()

await page.assertQueryString({ page: '2' })
```

### assertCookie
Assert the cookie to exist and optionally match the expected value.

```ts
const page = visit('/')

await page.assertCookie('cart_items')
await page.assertCookie('cart_total', 80)
```

### assertCookieMissing
Assert cookie to be missing.

```ts
const page = visit('/')
await page.assertCookieMissing('cart_items')
```

### assertText
Assert the inner text of an element to match the expected value.

```ts
const page = visit('/')
await page.assertText('span.issues_count', '25 issues')

await page.assertText(
  page.getByTitle('Issues count'),
  '25 Issues'
)
```

### assertTextContains
Assert the inner text of an element to include the expected substring.

```ts
const page = visit('/')
await page.assertTextContains('body', 'It works')
```

### assertElementsText
Assert the inner text of multiple elements to match the expected value.

```ts
const page = visit('/')
await page.assertElementsText('ul.todos > li', [
  'Buy groceries',
  'Publish browser client plugin',
])

const pendingTodos = page
  .locator('ul.todos > li')
  .filter({ has: await page.getByRole('checkbox').isChecked() })

await page.assertElementsText(
  pendingTodos,
  [
    'Buy groceries',
    'Publish browser client plugin',
  ]
)
```

### assertChecked
Assert a checkbox to be checked.

```ts
const page = visit('/')

await page.assertChecked('input[name="terms"]')
```

### assertNotChecked
Assert a checkbox not to be checked.

```ts
const page = visit('/')

await page.assertNotChecked('input[name="newsletter"]')
```

### assertDisabled
Assert an element to be disabled. All elements are enabled unless it is a `button`, `select`, `input`, or a `textarea` with a **disabled attribute**.

```ts
const page = visit('/')
await page.assertDisabled('button[type="submit"]')
```

### assertNotDisabled
Assert an element to be not disabled. All elements are enabled unless it is a `button`, `select`, `input`, or a `textarea` with a **disabled attribute**.

```ts
const page = visit('/')
await page.assertNotDisabled('button[type="submit"]')
```

### assertInputValue
Assert the input value to match the expected value. The assertion must be performed against an `input`, `textarea`, or a `select` box.

```ts
const page = visit('/')
await page.assertInputValue('input[name="username"]', 'virk')
```

### assertSelectedOptions
Assert the select box selected options to match the expected values.

```ts
const page = visit('/')
await page.assertSelectedOptions('select[name="tags"]', [
  'js',
  'css',
  'html'
])
```
