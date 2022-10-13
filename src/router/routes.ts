import HomePage from '../views/HomePage.vue'
import ErrorPage from '../views/ErrorPage.vue'
import PageNotFound from '../views/PageNotFound.vue'

export const routes = [
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
    meta: {
      title: '404 - Page Not Found',
    },
  },
  {
    name: 'error',
    path: '/error',
    component: ErrorPage,
    meta: {
      title: 'Error',
    },
  },
  {
    name: 'home',
    path: '/',
    component: HomePage,
    meta: {
      title: 'Home',
    },
  },
]
