import '../css/app.css'
import 'lazysizes'
import 'unpoly'
import Alpine from 'alpinejs'
import { listen } from 'quicklink'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

Alpine.store('global', {
  selectedTab: Alpine.$persist(0),
  themeColor: Alpine.$persist(
    /**
     * Starting with user system theme and then they can toggle as needed
     */
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  ),
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

Alpine.data('darkModeSwitch', function () {
  return {
    toggle(mode) {
      this.$store.global.themeColor = mode
    },
  }
})

Alpine.start()
