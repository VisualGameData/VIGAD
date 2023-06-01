// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'; // Global CSS has to be imported

// Vuetify
import { createVuetify } from 'vuetify';

// if needed imported
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Icons https://materialdesignicons.com/

export default createVuetify({
    theme: {
        defaultTheme: 'dark',
    },
    components,
    directives,
});
