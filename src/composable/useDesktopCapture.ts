// Create all Screen related methodes here and export them
// so they can be used in other files
// ie access the current screen etc.

// ! use the functions defined in the HomePage.vue file and add documentation to them

// ! properly document each function and add @return to every function

import { ref } from 'vue'

export const isLoadingScreensAndWindows = ref(false)
export const allSources = ref([])

export const currentScreen = ref(null)
export const currentWindow = ref(null)
export const currentStream = ref(null)

/**
 * Get all the video sources available on the system
 */
export async function getThings() {
  // TODO: is not called again if new sources showes up
  // Get the available video sources
  allSources.value = await (window as any).electronAPI.getMedia()
}
