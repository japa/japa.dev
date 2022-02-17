import '../css/app.css'
import 'lazysizes'
import 'unpoly'
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

Alpine.store('languageSwitcher', {
  value: Alpine.$persist(1),
})

Alpine.data('languageSwitcher', function () {
  return {
    moveTo(index, event) {
      this.$store.languageSwitcher.value = index
      event.preventDefault()
    },

    changeTab(index) {
      const activeElement = this.$refs[`tab-${index}`]
      this.$refs.highlighter.style.left = `${activeElement.offsetLeft}px`
      this.$refs.highlighter.style.width = `${activeElement.clientWidth}px`
      this.$refs.highlighter.style.top = `${activeElement.offsetTop}px`
      this.$refs.highlighter.style.height = `${activeElement.clientHeight}px`
    },

    init() {
      this.changeTab(this.$store.languageSwitcher.value)
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

Alpine.start()
