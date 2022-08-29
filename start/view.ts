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
import View from '@ioc:Adonis/Core/View'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons-outline'
import sponsors from '../resources/sponsorkit/sponsors.json'

View.use(edgeIconify)
addCollection(heroIcons)

View.global(
  'sponsors',
  sponsors.reduce(
    (result, sponsor) => {
      sponsor.sponsor['profileUrl'] = `https://github.com/${sponsor.sponsor.login}`
      sponsor.sponsor.name = sponsor.sponsor.name || sponsor.sponsor.login

      if (sponsor.isOneTime) {
        result.backers.push(sponsor.sponsor)
        return result
      }

      if (sponsor.tierName === '$19 a month') {
        result.sponsors.push(sponsor.sponsor)
        return result
      }

      if (sponsor.tierName === '$29 a month') {
        result.silver.push(sponsor.sponsor)
        return result
      }

      if (sponsor.monthlyDollars > 29) {
        result.gold.push(sponsor.sponsor)
        return result
      }

      result.backers.push(sponsor.sponsor)
      return result
    },
    {
      gold: [],
      silver: [],
      sponsors: [],
      backers: [],
    } as {
      gold: any[]
      silver: any[]
      sponsors: any[]
      backers: any[]
    }
  )
)

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
