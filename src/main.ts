import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import vuetify from './plugins/vuetify';
// https://github.com/nikitasnv/vue-resizable

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
    .$nextTick(() => {
        postMessage({ payload: 'removeLoading' }, '*');
    });
