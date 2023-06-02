# News

Stay up to date with everything you need to know about Japa. Official releases, community contributions, and social mentions, all are covered in the news timeline.

<hr>
<br>
<br>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2023-02-24">June 02, 2023</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New plugin - `@japa/snapshot`

`@japa/snapshot` is a snapshot testing plugin for Japa. You can use it to write snapshot tests for your code. Also includes inline snapshots, and extends the `assert` and `expect` APIs with snapshot assertions.

[Plugin documentation](../docs/plugins/snapshot.md)\
 [Github repo](https://github.com/japa/snapshot)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2023-02-24">February 24, 2023</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New plugin - `@japa/browser-client`

The `@japa/browser-client` plugin is built on top of Playwright, and you can use it for writing
end-to-end browser tests using it.

[Plugin documentation](../docs/plugins/browser-client.md)\
 [Github repo](https://github.com/japa/browser-client)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2023-02-10">February 10, 2023</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New plugin - `@japa/file-system`

The `@japa/file-system` plugin is a thin wrapper over the fs module for easier file system management during tests. The plugin also extends the assert plugin to write assertions for the file system.

[Plugin documentation](../docs/plugins/file_system.md)\
 [Github repo](https://github.com/japa/file-system)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-10-17">October 17, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Improvements in reporters

- Spec reporter now prefixes the pinned tests with the `PINNED` label for better visual feedback.
- The base reporter now displays the tests summary in compact mode.

[Base reporter release notes](https://github.com/japa/base-reporter/releases/tag/v1.1.0) \
 [Spec reporter release notes](https://github.com/japa/spec-reporter/releases/tag/v1.3.2)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-09-21">September 21, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New plugin - `@japa/expect-type`

The `expect-type` plugin allows you to write assertions for the static TypeScript types. Think of them as additional guards to ensure that during refactoring you are not messing up with the types a method returns or accepts.

[Plugin documentation](../docs/plugins/expect-type.md)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-09-08">September 08, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New reporter - `@japa/dot-reporter`

The dot reporter is a minimalist reporter that displays a dot for each passing test and a cross for each failing test. You might consider using the dot reporter in a CI workflow to keep the output clean.

[Reporter documentation](../docs/plugins/dot-reporter.md)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-09-02">September 02, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Improvements to filtering layer

The `@japa/runner` version `2.1.0` brings improvements to the filtering layer of the tests runner. It improves performance since the parent layers do not run when all the children are filtered out.

For example: If you apply a filter that disables all the tests within a group, that group will not execute its hooks. Earlier it was not the case.

[View release notes](https://github.com/japa/runner/releases/tag/v2.1.0)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-09-02">September 02, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Launch official VSCode extension

Julien from the core team created the VSCode extension to run individual tests and all tests inside a file directly from your code editor.

[Download Extension](https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode)\
 [Support Julien on Github](https://github.com/sponsors/julien-R44)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-05-04">May 04, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Youtube session with Kelvin Omereshone

During our Youtube session, we build a dummy RESTful API using AdonisJS. Also, we use the Japa API client and OpenAPI testing feature to test our API endpoints.

[Link to the session video](https://www.youtube.com/watch?v=_MSQY3lqhCo)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-03-24">March 24, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New integration - `@japa/preset-adonis`

The AdonisJS integration creates a bridge between AdonisJS and Japa. Also, the AdonisJS packages can resolve Japa classes from the IoC container to further extend them during the lifecycle of an AdonisJS app.

[Integration repo](https://github.com/japa/preset-adonis)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-03-24">March 24, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## New plugin - `@japa/api-client`

The API client plugin of Japa makes it super simple to test your API endpoints over HTTP. You can use it to test any HTTP endpoint that returns JSON, XML, HTML, or even plain text.

[Plugin repo](https://github.com/japa/api-client)\
 [API client docs](../docs/plugins/api-client.md)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-03-17">March 17, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Mentioned in the Github release radar post

We are thankful to Github for mentioning Japa in their monthly release radar post 🙏

[Link to release radar post](https://github.blog/2022-03-17-release-radar-feb-2022/#japa-5-0)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-03-05">March 05, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Support for dynamic test titles

Tests using datasets can now reference values of the current iteration within the test title.

In the following example, you access the `email` property by wrapping it inside the single curly braces.

```ts
test('validate email - {email}')
  .with([
    {
      email: 'some+user@gmail.com',
    },
    {
      email: 'email@example.com (Joe Smith)',
    },
  ])
  .run(({ assert }, { email }) => {})
```

[View release notes](https://github.com/japa/core/releases/tag/v6.0.0)\
 [Learn more about dynamic test titles](../docs/datasets.md#dynamic-title-for-each-test)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-02-26">February 26, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Support for test suites

Test suites allow you to organize your tests by their type. For example, you can create separate suites for **unit tests** and **functional tests**.

[View release notes](https://github.com/japa/runner/releases/tag/v1.2.0)\
 [Learn more about suites](../docs/test-suites.md)

  </div>
</div>

<div class="timeline_item">
  <div class="news_datetime">
    <dl>
      <dt> Date </dt>
      <dd> <time datetime="2022-02-21">February 21, 2022</time> </dd>
    </dl>
  </div>

  <div class="news_content">

## Rewrite from scratch

Japa has received a massive rewrite, and all the packages have been moved to the `@japa` npm scope. The existing package [japa](https://www.npmjs.com/package/japa) is replaced with [@japa/runner](https://npmjs.com/package/@japa/runner).

  </div>
</div>
