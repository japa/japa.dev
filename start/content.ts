/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { Renderer } from '@dimerapp/edge'
import Content from 'App/Services/Content'
import { zones, codeBlocksTheme } from 'Config/markdown'

/**
 * Renderer makes the markdown AST and convert them to HTML by processing
 * each node through edge templates. This allows you hook into the
 * rendering process and use custom templates for any node
 */
const dimerRenderer = new Renderer().use((node) => {
  /**
   * Render images using "elements/img.edge" file
   */
  if (node.tagName === 'img') {
    return ['elements/img', { node }]
  }

  /**
   * Render captions using "elements/caption.edge" file
   */
  if (node.tagName === 'div' && node.properties?.caption !== undefined) {
    return ['elements/caption', { node }]
  }

  /**
   * Render anchor tags using "elements/a.edge" file
   */
  if (node.tagName === 'a') {
    return ['elements/a', { node }]
  }

  /**
   * Render pre tags using "elements/code.edge" file
   */
  if (node.tagName === 'pre') {
    return ['elements/code', { node }]
  }

  if (!Array.isArray(node.properties!.className)) {
    return
  }

  /**
   * Render codegroup using "elements/codegroup.edge" file
   */
  if (node.properties!.className.includes('codegroup')) {
    return ['elements/codegroup', { node }]
  }

  /**
   * Render alert elements
   */
  if (node.properties!.className.includes('alert')) {
    return ['elements/alert', { node }]
  }
})

/**
 * Cache markup and do not re-compile unchanged files
 */
Content.cache('markup')

/**
 * Registering zones with the `@dimerapp/content` module.
 */
zones.forEach(({ title, baseUrl, template, caption, menu, contentPath }) => {
  const zone = Content.zone(title, { caption })
  // markdownLanguages.forEach((lang) => zone.loadLanguage({ ...lang }))

  zone
    .baseUrl(baseUrl)
    .baseContentPath(contentPath)
    .template(template)
    .useTheme(codeBlocksTheme)
    .before('compile', (file) => {
      file.macro('caption', (node) => {
        node.data = node.data || {}
        node.data.hName = 'div'
        node.data.hProperties = {
          caption: node.attributes.for,
        }
      })

      file.macro('languageSwitcher', (node, file, removeNode) => {
        const tabNames: string[] = []
        let nonCodeBlockIndex = -1

        node.children.forEach((child, index) => {
          if (child.type === 'code') {
            tabNames.push((child.meta as any).title || `Tab ${index + 1}`)
            return
          }

          if (nonCodeBlockIndex === -1) {
            nonCodeBlockIndex = index
          }
        })

        if (nonCodeBlockIndex !== -1) {
          file.report(
            `"languageSwitcher" must contain codeblock only`,
            node.children[nonCodeBlockIndex].position
          )
          removeNode()
          return
        }

        node.data = node.data || {}
        node.data.hName = 'div'
        node.data.hProperties = {
          dataTabs: JSON.stringify(tabNames),
          className: ['codegroup'],
          component: 'languageSwitcher',
        }
      })
    })
    .after('compile', (file) => {
      const firstListItem = file.toc?.children.find((node) => {
        return node.type === 'element' && node.tagName === 'li'
      })
      if (!firstListItem || firstListItem.type !== 'element') {
        file.toc = null
        return
      }

      const toc = firstListItem.children.find((node) => {
        return node.type === 'element' && node.tagName === 'ul'
      })

      file.toc = toc as any
    })
    .docs(menu)
    .renderer('dimerRenderer', dimerRenderer)
    .register()
})
