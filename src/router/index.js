import { createWebHashHistory, createRouter } from 'vue-router'
import Notebooks from '../pages/Notebooks'
import Notebook from '../pages/Notebook'

const routes = [
  {
    path: '/',
    redirect: '/notebooks'   
  },
  {
    name: 'Notebooks',
    path: '/notebooks',
    component: Notebooks
  },
  {
    name: 'Notebook',
    path: '/:name/:key',
    component: Notebook,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router