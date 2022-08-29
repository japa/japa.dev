---
title: AdonisJS integration
description: Official preset for the AdonisJS framework
---

# AdonisJS integration
Japa has an [official preset](https://github.com/japa/preset-adonis) for the [AdonisJS framework](https://adonisjs.com/). The preset bundles the following plugins under a single package.

- `@japa/api-client`
- `@japa/assert`
- `@japa/run-failed-tests`
- `@japa/spec-reporter`

Also, the core classes of Japa are [registered](https://github.com/japa/preset-adonis/blob/develop/providers/TestsProvider/index.ts) inside the AdonisJS IoC container. This allows AdonisJS packages to extend Japa using the service provider lifecycle hooks.

## Setup
Japa comes pre-configured with every new AdonisJS application. Hence, there is no need to perform any additional setup.

## Creating and running tests
You can use the AdonisJS Ace command line to create test files and execute tests. 

- [Guide on creating tests](https://docs.adonisjs.com/guides/testing/introduction#creating-tests)
- [Guide on running tests](https://docs.adonisjs.com/guides/testing/introduction#running-tests)
