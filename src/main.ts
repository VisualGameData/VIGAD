import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import vuetify from './plugins/vuetify';
import VueDragResize from 'vue3-drag-resize';
// https://github.com/nikitasnv/vue-resizable

createApp(App)
    .component('vue-drag-resize', VueDragResize)
    .use(vuetify)
    .use(router)
    .mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*');
    });
