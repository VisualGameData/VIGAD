// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'; // Global CSS has to be imported

// Vuetify
import { createVuetify, ThemeDefinition } from 'vuetify';

// if needed imported
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Icons https://materialdesignicons.com/

export default createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            // Custom Dark Theme
            dark: {
                dark: true,
                colors: {
                    background: '#121827',
                    surface: '#181F32',
                    primary: '#FAD761',
                    secondary: '#31353E',
                    font: '#DBE6EB',
                    error: '#F74343',
                    info: '#58a7fe',
                    success: '#77D679',
                    warning: '#F74343',
                },
            },
            // Custom Light Theme
            light: {
                dark: false,
                colors: {
                    background: '#ffffff',
                    surface: '#181F32',
                    primary: '#DBE6EB',
                    secondary: '#31353E',
                    error: '#F74343',
                    info: '#FAD761',
                    success: '#77D679',
                    warning: '#F74343',
                },
            },
        },
    },
    components,
    directives,
});
