//import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import User from './views/User.vue'
import Folders from './views/Folders.vue'
import Folder from './views/Folder.vue'
import Bookmarks from './views/Bookmarks.vue'
import NotFoundView from './views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
    },
    {
      path: '/users/:user_id',
      name: 'user',
      component: User,
    },
    {
      path: '/folders',
      name: 'folders',
      component: Folders,
    },
    {
      path: '/folders/:folder_id',
      name: 'folder',
      component: Folder,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

createApp(App).use(router).mount('#app')
