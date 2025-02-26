import { computed } from 'vue'

export function useColors() {
  return {
    footerHeaderDarkBlue: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--footer-header-dark-blue')
        .trim()
    }),
    mainRedLight: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--main-red-light')
        .trim()
    }),
    mainRedDark: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--main-red-dark')
        .trim()
    }),
    mainBlueLight: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--main-blue-light')
        .trim()
    }),
    mainBlueDark: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--main-blue-dark')
        .trim()
    }),
    accentYellow: computed(() => {
      return getComputedStyle(document.body)
        .getPropertyValue('--accent-yellow')
        .trim()
    })
  }
}