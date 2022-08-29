import { MarkdownFile } from '@dimerapp/markdown'

export default function announcement(file: MarkdownFile) {
  file.macro('announcement', (node) => {
    node.data = node.data || {}
    node.data.hName = 'div'
    node.data.hProperties = {
      className: ['alert', 'alert-announcement'],
    }
  })
}
