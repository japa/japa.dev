import { MarkdownFile } from '@dimerapp/markdown'

export default function languageSwitcher(file: MarkdownFile) {
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

    /**
     * Ensure all nodes are codeblocks inside "languageSwitcher"
     */
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
      class: ['codegroup'],
      languageSwitcher: 'true',
    }
  })
}
