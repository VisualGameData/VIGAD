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
                    primary: '#5E35B1',
                    secondary: '#181F32',
                    background: '#121827',
                    surface: '#181F32',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    font: '#DBE6EB',
                },
            },
            // Custom Light Theme
            light: {
                dark: false,
                colors: {
                    primary: '#5E35B1',
                    secondary: '#181F32',
                    background: '#121827',
                    surface: '#181F32',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    font: '#DBE6EB',
                },
            },
        },
    },
    components,
    directives,
});
