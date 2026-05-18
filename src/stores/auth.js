import { ref } from 'vue'
const isLoggedIn = ref(!!localStorage.getItem('token'))

export function useAuth(){
   function login(token) {
    localStorage.setItem('token', token)
    isLoggedIn.value = true
   }
   function logout() {
    localStorage.removeItem('token')
    isLoggedIn.value = false
   }
   return {
    isLoggedIn,
    login,
    logout
   }
}