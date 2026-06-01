<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth';

const { user, fetchMe, logout } = useAuth()
const router = useRouter()

const url = "http://localhost:8080/users"


const deleteAccount = async () => {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(url+`/${user.value.user_id}`, {
                method:"DELETE",
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            logout()
            await router.push('/login')
        } catch (error) {
            console.error(error.message);
        }
}


onMounted( async () => { 
    await fetchMe()
})

</script>

<template>
    <div class="p-4 sm:ml-64">
        <div class="p-4 rounded-base bg-neutral-secondary-soft">
            <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl mb-4">Profil</h4>
            <div class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-5xl">
                <svg class="w-24 h-24 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                <div class="flex flex-col justify-between md:p-4 leading-normal">
                    <h1 v-if="user">Email: {{ user.email }}</h1>
                    <h1 v-if="user">ID użytkownika: {{ user.user_id }}</h1>
                </div>
            </div>
            <button data-modal-target="remove-user-modal" data-modal-toggle="remove-user-modal" class="mt-4 inline-flex items-center text-nowrap text-white bg-danger hover:bg-danger-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" type="button">
                        Usuń konto
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg>
            </button>
        </div>
    </div>


    <!-- Remove account modal -->
                    <div id="remove-user-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <form @submit.prevent="deleteAccount">
                        <div class="relative p-4 w-full max-w-2xl max-h-full">
                            <!-- Modal content -->
                            <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                                <!-- Modal header -->
                                <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                                    <h3 class="text-lg font-medium text-heading">
                                        Czy na pewno chcesz usunąć konto?
                                    </h3>
                                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="remove-user-modal">
                                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                                        <span class="sr-only">Zamknij</span>
                                    </button>
                                </div>
                                <!-- Modal footer -->
                                <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                                    <button data-modal-hide="remove-user-modal" type="reset" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Nie</button>
                                    <button data-modal-hide="remove-user-modal" type="submit" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Tak</button>
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>
</template>