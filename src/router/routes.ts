export const routes = [
    {
        name: '404',
        path: '/:pathMatch(.*)*',
        component: () => import('../views/PageNotFound.vue'),
        meta: {
            title: 'Vigad - 404 - Page Not Found',
        },
    },
    {
        name: 'error',
        path: '/error',
        component: () => import('../views/ErrorPage.vue'),
        meta: {
            title: 'Vigad - Error',
        },
    },
    {
        name: 'home',
        path: '/',
        component: () => import('../views/SourcesView.vue'),
        meta: {
            title: 'Vigad - Sources',
        },
    },
    {
        name: 'capture',
        path: '/capture',
        component: () => import('../views/CapturePage.vue'),
        meta: {
            title: 'Vigad - Capturing',
        },
    },
    {
        name: 'regex',
        path: '/regex',
        component: () => import('../views/RegexView.vue'),
        meta: {
            title: 'Vigad - Regex',
        },
    },
];
