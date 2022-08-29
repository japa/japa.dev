import Docs from '../content/docs/menu.json'
import About from '../content/about/menu.json'

/*
|--------------------------------------------------------------------------
| Additional markdown languages
|--------------------------------------------------------------------------
|
| Additional set of VScode languages to beautify the documentation code
| blocks.
|
| The path is relative from the project root.
|
*/
export const markdownLanguages = []

/*
|--------------------------------------------------------------------------
| Content zones
|--------------------------------------------------------------------------
|
| Following is the content zones with the base template they use for rendering
| the markdown nodes and a menu tree for rendering the header nav and the
| documentation sidebar.
|
*/
export const zones = [
  {
    title: 'Docs',
    baseUrl: '/docs',
    template: 'templates/docs',
    contentPath: './content/docs',
    menu: Docs,
  },
  {
    title: 'About',
    baseUrl: '/',
    template: 'templates/longform',
    contentPath: './content/about',
    menu: About,
  },
]
