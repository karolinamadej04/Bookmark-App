import { ref } from 'vue'
const isLoggedIn = ref(!!localStorage.getItem('token'))
const user = ref(null)

export function useAuth(){
   function login(token) {
    localStorage.setItem('token', token)
    isLoggedIn.value = true
    fetchMe()
   }
   function logout() {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    user.value = null
   }
   async function fetchMe() {

    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:8080/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    user.value = await response.json()
}
   return {
    isLoggedIn,
    user,
    login,
    logout,
    fetchMe
   }
}