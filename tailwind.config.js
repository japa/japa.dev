module.exports = {
  content: ['resources/views/**/*.edge'],
  darkMode: ['class'],
  theme: {
    colors: {
      white: '#fff',
      transparent: 'transparent',
      translucent: 'rgba(255, 255, 255, 0.16)',
      brand: '#5a45ff',
      brandDark: '#9385ff',
      green: {
        500: '#2dd4bf',
      },
      red: {
        500: '#fb7185',
      },
      plum: {
        500: '#ab4aba',
      },
      plumDark: {
        500: '#883894',
      },
      amber: {
        500: '#ffb224',
      },
      amberDark: {
        500: '#824e00',
      },
      gray: {
        50: '#f5f5f4',
        100: '#C1BFB9',
        200: '#f8f7f6',
        300: '#e7e5e0',
        600: '#72716d',
        800: '#40403d',
        900: '#1a1a19',
      },
      darkGray: {
        50: '#202021',
        100: 'rgba(28,28,28,.9)',
        200: '#343434',
        300: '#2e2e30',
        600: '#aaa',
        700: '#777',
        800: '#1c1c1c',
        900: '#e7e7e7',
      },
    },
    fontFamily: {
      display: ['Inter'],
      body: ['Inter'],
      mono: ['Jetbrains Mono'],
    },
    extend: {
      lineHeight: {
        0: '0',
      },
      screens: {
        'bigger-desktop': '1340px',
      },
      listStyleType: {
        circle: 'circle',
      },
      spacing: {
        'sidebar': '322px',
        'sidebar-small': '280px',
        'header': '4rem',
        'toc': '320px',
      },
      height: {
        'screen-wo-header': 'calc(100% - 4rem)',
      },
      boxShadow: {
        xl: '0 12px 32px rgba(0, 0, 0, .1), 0 2px 6px rgba(0, 0, 0, .08)',
        lg: '0px 2px 4px rgba(44, 43, 42, 0.1)',
        search: 'inset 0 0 0 1px #ffffff1f',
      },
      transitionProperty: {
        left: 'left',
      },
      fontSize: {
        'prose-lg': '1rem',
        'prose-xl': '1.125rem',
        'prose-6xl': '2.4rem',
        'prose-4xl': '1.7rem',
        'prose-3xl': '1.3rem',
        'prose-2xl': '1.1rem',
        'prose-code': '1rem',
        'prose-pre': '0.9rem',
        'prose': '1.06rem',
        'md': '0.9rem',
      },
    },
  },
  plugins: [],
}
