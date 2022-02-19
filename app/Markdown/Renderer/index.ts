import { Renderer } from '@dimerapp/edge'

/**
 * Renderer accepts the markdown AST and convert them to HTML by processing
 * each node through edge templates. This allows us to hook into the
 * rendering process and use custom templates for any node.
 */
export default new Renderer().use((node) => {
  /**
   * Render images using "elements/img.edge" file
   */
  if (node.tagName === 'img') {
    return ['elements/img', { node }]
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
    return ['elements/pre', { node }]
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

  /**
   * Render captions using "elements/caption.edge" file
   */
  if (node.properties!.className.includes('caption')) {
    return ['elements/caption', { node }]
  }
})
