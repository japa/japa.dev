/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { zones } from 'Config/markdown'
import Content from 'App/Services/Content'
import * as macros from 'App/Markdown/Macros'
import dimerRenderer from 'App/Markdown/Renderer'
import processToc from 'App/Markdown/Processors/processToc'

/**
 * Cache markup and do not re-compile unchanged files
 */
Content.cache('markup')

/**
 * Registering zones with the `@dimerapp/content` module.
 */
zones.forEach(({ title, baseUrl, template, caption, menu, contentPath }) => {
  const zone = Content.zone(title, { caption })

  zone
    .baseUrl(baseUrl)
    .baseContentPath(contentPath)
    .template(template)
    .loadTheme('resources/themes/bio-dark.json')
    .before('compile', (file) => {
      macros.caption(file)
      macros.announcement(file)
      macros.languageSwitcher(file)
    })
    .after('compile', (file) => {
      processToc(file)
    })
    .docs(menu)
    .renderer('dimerRenderer', dimerRenderer)
    .register()
})
