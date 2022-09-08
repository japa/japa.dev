---
title: Japa - A simple yet powerful testing framework for Node.js
description: Japa comes with all the tools you need to test your backend applications. Be it testing JSON APIs using Open API schema or writing browser tests using Playwright.
ogImage: introduction.jpeg
---

# A simple yet powerful testing framework for Node.js

Japa comes with all the tools you need to test your backend applications. Be it testing JSON APIs using Open API schema or writing browser tests using Playwright.

## Features

<div class="features">
  <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Basics covered </h4>
        <p>
          Despite being a small and simple test runner, Japa comes with all the basic features you expect from a great testing framework. It includes
        </p>
        <ul>
          <li> Support for asynchronous tests. </li>
          <li> Official plugins for chai assert and jest expect assertion libraries.</li>
          <li> Coverage reporting using nyc and c8. </li>
          <li> Ability to pin and run only selected tests. </li>
          <li>Works with ESM and TypeScript both with zero additional setup</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2" />
          <path d="M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Open API schema driven API testing </h4>
        <p>
          The API client plugin of Japa has first-class support for testing API endpoints against an Open API schema.
        </p>
        <ul>
          <li> You have to register the schema file path. </li>
          <li> The responses are matched based upon the request URL, method, and response status.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="8" y1="4" x2="8" y2="8" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Browser testing using Playwright </h4>
        <p> Suites serve as an organization layer for your tests. For example, a suite for unit tests and another for functional tests.</p>
      </div>
    </div>
  </div> -->

  <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
          <path d="M4 6v6a8 3 0 0 0 16 0v-6" />
          <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Dataset driven tests </h4>
        <p>
          Datasets allow you to test a function output against varying inputs.
        </p>
        <p>
          For example, instead of writing multiple tests to validate different email formats, you can write a single test and use datasets to run it with a different email each time.
        </p>
      </div>
    </div>
  </div>

  <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M9 4h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
          <path d="M17 17v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Test suites and groups for better organisation </h4>
        <p>
          Japa allows you to divide <strong>unit</strong>, <strong>integration</strong> and <strong>functional</strong> tests as multiple suites. Each suite can have its lifecycle hooks.
        </p>
        <p>
          On the other hand, groups allow you to bulk configure tests of similar nature.
        </p>
      </div>
    </div>
  </div>

  <!-- <div class="feature">
    <div class="feature_content">
      <div class="feature_title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      </div>
      <div class="feature_body">
        <h4> Integrations for all major Node.js frameworks </h4>
        <p>
          Japa works with ESM and TypeScript projects with zero additional toolings.
        </p>
      </div>
    </div>
  </div> -->
</div>

## Why Japa?
There are many testing frameworks available in the JavaScript ecosystem. So let's explore what makes Japa different.

### No build tools required
Most of the mainstream testing frameworks in JavaScript are born out of the frontend ecosystem; therefore, they extensively use build tools and transpilers.

For example, Jest uses `babel-jest`, and Vitest uses `vite` to transform your code before running tests.

The code transformation process is not needed for backend libraries and applications. So why pay the penalty in the first place?

If you are a Node.js backend developer, you will find Japa more natural and straightforward to work with in comparison to other mainstream testing frameworks.

### Naturally works with TypeScript, ESM, and CJS
Japa does not use any CLI or build tools. Therefore, it allows Japa to blend with your existing workflows easily.

Be it a TypeScript project or ES modules. You can use Japa with no additional tooling required on our end.

### Extensible
Most of the core APIs of Japa are extensible. 

- You can add custom behavior to the [underlying test class](./underlying-test-class.md#extending-test-class) using macros.
- Hook into the [lifecycle](./lifecycle-hooks.md) of a suite, group or a test.
- Extend [test context](./test-context.md#extending-context) with custom properties.
- Develop custom [plugins](./extend/creating-plugins.md) and [reporters](./extend/creating-reporters.md).

## Official VSCode extension
You can run Japa tests directly within your code editor using our [official VSCode extension](https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode).

::video{url="japa-vscode.mp4" controls}
