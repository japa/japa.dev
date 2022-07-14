module.exports = {
  content: ['resources/views/**/*.edge'],
  theme: {
    colors: {
      white: '#fff',
      transparent: 'transparent',
      translucent: 'rgba(255, 255, 255, 0.16)',
      brand: '#5a45ff',
      green: {
        500: '#2dd4bf',
      },
      red: {
        500: '#fb7185',
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
    },
    fontFamily: {
      display: ['PolySans'],
      body: ['Calibre'],
      mono: ['Operator Mono'],
    },
    extend: {
      lineHeight: {
        0: '0',
      },
      listStyleType: {
        circle: 'circle',
      },
      spacing: {
        'sidebar': '322px',
        'sidebar-small': '280px',
        'header': '4rem',
        'toc': '280px',
      },
      height: {
        'screen-wo-header': 'calc(100% - 4rem)',
      },
      boxShadow: {
        xl: '0px 8px 32px rgba(0, 0, 0, 0.08);',
        lg: '0px 2px 4px rgba(44, 43, 42, 0.1)',
      },
      transitionProperty: {
        left: 'left',
      },
      fontSize: {
        'prose-lg': '1.025rem',
        'prose-xl': '1.125rem',
        'prose-6xl': '3.25rem',
        'prose-4xl': '2.025rem',
        'prose-3xl': '1.6rem',
        'prose-2xl': '1.3rem',
        'prose-codeblocks': '1.1rem',
        'prose': '1.25rem',
      },
    },
  },
  plugins: [],
}
