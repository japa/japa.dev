# News
Stay up to date with everything you need to know about Japa. Official releases, community contributions, and social mentions, all are covered in the news timeline.

<hr>
<br>
<br>

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
        email: 'email@example.com (Joe Smith)'
      }
    ])
    .run(({ assert }, { email }) => {
    })
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
