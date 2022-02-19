import { MarkdownFile } from '@dimerapp/markdown'

/**
 * Processing TOC to remove the first li, ie basically for the
 * H1
 */
export default function processToc(file: MarkdownFile) {
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
}
