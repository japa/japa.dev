import Core from '../content/core/menu.json'
import Runner from '../content/runner/menu.json'

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
| Theme used for codeblocks
|--------------------------------------------------------------------------
|
| Themes used for codeblocks
|
*/
export const codeBlocksTheme = 'one-dark-pro'

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
    title: 'Runner',
    baseUrl: '/',
    template: 'templates/docs',
    contentPath: './content/runner',
    menu: Runner,
    caption: 'Use Japa runner to test your applications',
  },
  {
    title: 'Core',
    baseUrl: '/core',
    template: 'templates/docs',
    contentPath: './content/core',
    menu: Core,
    caption: 'Use Japa core to create your own tests runner',
  },
]
