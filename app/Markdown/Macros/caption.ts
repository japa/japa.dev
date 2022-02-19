import { MarkdownFile } from '@dimerapp/markdown'

export default function caption(file: MarkdownFile) {
  file.macro('caption', (node) => {
    node.data = node.data || {}
    node.data.hName = 'div'
    node.data.hProperties = {
      class: ['caption', `caption-${node.attributes.for}`],
    }
  })
}
