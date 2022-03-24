/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { URL } from 'url'
import { normalize } from 'path'
import View from '@ioc:Adonis/Core/View'

View.global('icon', (filePath: string) => {
  return new URL(View.GLOBALS.asset(`assets/icons/${filePath}`)).href
})

View.global('image', (filePath: string) => {
  return new URL(View.GLOBALS.asset(`assets/images/${filePath}`)).href
})

View.global('filePathToUrl', (filePath: string) => {
  const [, contentPath] = filePath.split('content/')
  return `https://github.com/japa/japa.dev/tree/develop/content/${contentPath}`
})
