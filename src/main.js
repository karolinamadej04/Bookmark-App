import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import User from './views/User.vue'
import Folders from './views/Folders.vue'
import FoldersTest from './views/FoldersTest.vue'
import FolderTest from './views/FolderTest.vue'
import Folder from './views/Folder.vue'
import NotFoundView from './views/NotFoundView.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Folders,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:user_id',
      name: 'user',
      component: User,
      meta: { requiresAuth: true }
    },
    {
      path: '/folders',
      name: 'folders',
      component: Folders,
      meta: { requiresAuth: true }
    },
    {
      path: '/folders/:folder_id',
      name: 'folder',
      component: Folder,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/folderstest',
      name: 'folderstest',
      component: FoldersTest,
      meta: { requiresAuth: true }
    },
    {
      path: '/folderstest/:folder_id',
      name: 'foldertest',
      component: FolderTest,
      meta: { requiresAuth: true }
    },
  ],
})


// Sprawdzanie czy użytkownik jest zalogowany
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }

  if (to.path === '/login' && token) {
    next('/')
    return
  }

  next()
})


createApp(App).use(router).mount('#app')
