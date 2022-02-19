import '../css/app.css'
import 'lazysizes'
import 'unpoly'
import Alpine from 'alpinejs'
import { listen } from 'quicklink'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

Alpine.store('languageSwitcher', {
  value: Alpine.$persist(1),
})

Alpine.data('codegroup', function (store) {
  return {
    store: store,
    activeTab: store ? this.$store[store].value : 0,

    moveTo(index) {
      this.activeTab = index
      if (this.store) {
        this.$store[this.store].value = index
      }
    },

    changeTab(index) {
      const activeElement = this.$refs[`tab-${index}`]
      this.$refs.highlighter.style.left = `${activeElement.offsetLeft}px`
      this.$refs.highlighter.style.width = `${activeElement.clientWidth}px`
      this.$refs.highlighter.style.top = `${activeElement.offsetTop}px`
      this.$refs.highlighter.style.height = `${activeElement.clientHeight}px`
    },

    init() {
      this.changeTab(this.store ? this.$store[this.store].value : 0)
    },
  }
})

Alpine.data('urlHashWatcher', function () {
  return {
    findActiveLink(anchors) {
      anchors.forEach((anchor) => {
        anchor.classList.remove('active')
        if (location.hash === anchor.hash) {
          anchor.classList.add('active')
        }
      })
    },

    init() {
      const anchors = this.$el.querySelectorAll('a')
      this.findActiveLink(anchors)

      window.addEventListener('hashchange', () => {
        this.findActiveLink(anchors)
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

Alpine.start()
