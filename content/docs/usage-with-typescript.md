---
title: Usage with TypeScript
description: Use Japa inside a TypeScript project with any additional Japa specific build tools 
ogImage: usage-with-typescript.jpeg
---

# Usage with TypeScript

Since Japa does not have any CLI, you do not have to rely on us to add explicit support for TypeScript. Instead, you can use your existing tooling to run Japa tests within a TypeScript project.

In this guide, we will set up [ts-node](https://typestrong.org/ts-node/) to execute Japa tests for both ESM and CommonJS projects.

## CommonJS projects

Install the `ts-node` package from the npm registry.

```sh
npm i -D ts-node
```

Next, let's use `ts-node` and hook into the require lifecycle of Node.js to run the `bin/test.ts` file.

```sh
node -r ts-node/register bin/test.ts
```

You can also add the above command as a script inside the `package.json` file.

```json
{
  "scripts": {
    "test": "node -r ts-node/register bin/test.ts"
  }
}
```

By default, ts-node will perform type-checking every time you run tests. However, type-checking is usually slow, and you can turn it off by adding the following configuration block inside the `tsconfig.json` file.

```json
// title: tsconfig.json
"ts-node": {
  "transpileOnly": true
}
```

## ESM projects

Install the `ts-node` package from the npm registry.

```sh
npm i -D ts-node
```

Next, let's use `ts-node` as an ESM loader to pre-compile TypeScript source files to JavaScript during imports.

```sh
node --loader=ts-node/esm bin/test.ts
```

You can also add the above command as a script inside the `package.json` file.

```json
{
  "scripts": {
    "test": "node --loader=ts-node/esm bin/test.ts"
  }
}
```

By default, ts-node will perform type-checking every time you run tests. However, type-checking is usually slow, and you can turn it off by adding the following configuration block inside the `tsconfig.json` file.

```json
// title: tsconfig.json
"ts-node": {
  "transpileOnly": true
}
```

## Using SWC
[SWC](https://swc.rs/) is a Rust-based TypeScript compiler. ts-node has first-class support for using SWC in place of the TypeScript official compiler. Let's open the `tsconfig.json` file and paste the following configuration inside.

```json
// title: tsconfig.json
"ts-node": {
  "swc": true
}
```
