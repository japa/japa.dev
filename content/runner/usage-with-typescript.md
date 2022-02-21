---
title: Usage with TypeScript
description: Use Japa inside a TypeScript project with any additional Japa specific build tools 
ogImage: usage-with-typescript.jpeg
---

# Usage with TypeScript

Since Japa does not have any CLI, you do not have to rely on us to add explicit support for TypeScript. Instead, you can use your existing tooling to run Japa tests within a TypeScript project.

In this guide, we will setup Japa to work with [esmo](https://github.com/antfu/esno) and [ts-node](https://typestrong.org/ts-node/).

## Using ts-node

Install the `ts-node` package from the npm registry.

```sh
npm i -D ts-node
```

Next, let's use the `ts-node` JIT compiler to run the test file.

```sh
node -r ts-node/register/transpile-only bin/test.ts
```

You can also add the above command as a script inside the `package.json` file.

```json
{
  "scripts": {
    "test": "node -r ts-node/register/transpile-only bin/test.ts"
  }
}
```

## Using esno

Esno is similar to `ts-node`. However, it uses ESbuild instead of the TypeScript official compiler API.

Let's install the package from the npm registry.

```sh
npm i -D esmo
```

And add the following script to the `package.json` file.

```json
{
  "scripts": {
    "test": "esmo bin/test.ts"
  }
} 
```
