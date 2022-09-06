import '../css/app.css'
import 'lazysizes'
import 'unpoly'
import Alpine from 'alpinejs'
import { listen } from 'quicklink'
import docsearch from '@docsearch/js'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

Alpine.store('global', {
  selectedTab: Alpine.$persist(0),
})

Alpine.data('codegroup', function () {
  return {
    activeTab: this.$store.global.selectedTab,

    moveTo(index) {
      this.activeTab = index
      this.$store.global.selectedTab = index
    },

    changeTab(index) {
      const activeElement = this.$refs[`tab-${index}`]
      this.$refs.highlighter.style.left = `${activeElement.offsetLeft}px`
      this.$refs.highlighter.style.width = `${activeElement.clientWidth}px`
      this.$refs.highlighter.style.top = `${activeElement.offsetTop}px`
      this.$refs.highlighter.style.height = `${activeElement.clientHeight}px`
    },

    init() {
      this.changeTab(this.$store.global.selectedTab)
    },
  }
})

Alpine.data('urlHashWatcher', function () {
  return {
    findActiveLink(anchors, hash) {
      anchors.forEach((anchor) => {
        anchor.classList.remove('active')
        if (hash === anchor.hash) {
          anchor.classList.add('active')
        }
      })
    },

    init() {
      const anchors = this.$el.querySelectorAll('a')
      this.findActiveLink(anchors, location.hash)

      window.addEventListener('hashchange', () => {
        this.findActiveLink(anchors, location.hash)
      })
    },
  }
})

Alpine.data('prefetch', function () {
  return {
    init() {
      listen({
        el: this.$el,
      })
    },
  }
})

Alpine.data('search', function () {
  return {
    init() {
      docsearch({
        container: this.$el,
        appId: 'JK0LZ5Z477',
        // appId: 'R2IYF7ETH7',
        indexName: 'japa',
        // indexName: 'docsearch',
        apiKey: 'd21459d1420e545dd59b186ea41329ce',
        // apiKey: '599cec31baffa4868cae4e79f180729b',
      })
    },
  }
})

Alpine.start()
