import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faHome,
  faExclamationCircle,
  faBan,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHome, faExclamationCircle, faBan)

import vuetify from './plugins/vuetify'

createApp(App)
  .use(vuetify)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
