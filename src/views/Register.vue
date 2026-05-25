<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth';


const url = "http://localhost:8080/users";
const email = ref("")
const user_password = ref("")
const repeat_password = ref("")
const error = ref("")

const router = useRouter()

async function register() {
    error.value = ""

    try {
        if (user_password.value != repeat_password.value) {
            error.value='Hasło niepoprawne.'
            user_password.value=''
            repeat_password.value=''
            return
        }

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                    "Content-Type":"application/json"
                },
            body: JSON.stringify({
                email: email.value,
                user_password: user_password.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            error.value = data.message
            return
        }

        //localStorage.setItem('token', data.token)
        const { login } = useAuth()
        login(data.token)

        router.push('/folders')
    } catch(err) {
        error.value = 'Błąd serwera.'
    }
}
</script>

<template>
    <div class="p-4 sm:ml-64">
        <div class="p-4 rounded-base bg-neutral-secondary-soft" role="tabpanel">
        <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Rejestracja</h4>

        <div>
    </div>
    <div class="p-4 rounded-base bg-neutral-secondary-soft">
        <form @submit.prevent="register">

            <div class= "mb-3">
                <label>Email</label>
                <input v-model="email" type="email" />
            </div>

            <div class= "mb-3">
                <label>Hasło</label>
                <input v-model="user_password" type="password" />
            </div>

            <div class= "mb-3">
                <label>Powtórz hasło</label>
                <input v-model="repeat_password" type="password" />
            </div>

            <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">
                Zarejestruj się
            </button>

        </form>

        <p v-if="error">
            {{ error }}
        </p>
        </div>

        </div>
    </div>
</template>