<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const url = "http://localhost:8080/folder";
const url2 = "http://localhost:8080/bookmarks";
const url3 = "http://localhost:8080/folders";
const url4 = "http://localhost:8080/members";
const route = useRoute()
const folder = ref(null)
const bookmarks = ref([])
const members = ref([])
const visibility = ref(null)
const member_privileges = ref(null)
const name = ref(null)


const changeName = async () => {
        try {
            const response = await fetch(`${url3.toString()}/${route.params.folder_id}`, {
                method:"PUT",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: name.value,
                    visibility: folder.value.visibility,
                    member_privileges: folder.value.member_privileges
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            name.value = ""
            await fetchFolder()
        } catch (error) {
            console.error(error.message);
        }
    }

const changeVisibility = async () => {
        try {
            const response = await fetch(`${url3.toString()}/${route.params.folder_id}`, {
                method:"PUT",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: folder.value.name,
                    visibility: visibility.value,
                    member_privileges: folder.value.member_privileges
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            visibility.value = null
            await fetchFolder()
        } catch (error) {
            console.error(error.message);
        }
    }

const changeMemberPrivileges = async () => {
        try {
            const response = await fetch(`${url3.toString()}/${route.params.folder_id}`, {
                method:"PUT",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    name: folder.value.name,
                    visibility: folder.value.visibility,
                    member_privileges: member_privileges.value
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            member_privileges.value = null
            await fetchFolder()
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchFolder() {
        try {
            const response = await fetch(`${url.toString()}/${route.params.folder_id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            folder.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchBookmarks() {
        try {
            const response = await fetch(`${url2.toString()}/${route.params.folder_id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            bookmarks.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchMembers() {
        try {
            const response = await fetch(`${url4.toString()}/${route.params.folder_id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            members.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }


onMounted(() => { fetchFolder(), fetchBookmarks(), fetchMembers() })

</script>

<template>
<div class="p-4 sm:ml-64">
<div class="mb-4 border-b border-default">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Folder</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Członkowie</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Ustawienia</button>
        </li>
    </ul>
</div>
<div id="default-tab-content">
    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                <h4 v-if="folder" class="text-3xl font-bold tracking-tight text-heading md:text-4xl">{{folder.name}}</h4>
            </div>
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                
                <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="inline-flex items-center justify-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" type="button">
                Filtruj 
                <svg class="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                </button>

                <!-- Dropdown menu -->
                <div id="dropdown" class="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                    <ul class="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Nazwa</a>
                    </li>
                    <li>
                        <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Ostatnie aktualizowane</a>
                    </li>
                    <li>
                        <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Od najnowszych</a>
                    </li>
                    <li>
                        <a href="#" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Od najstarszych</a>
                    </li>
                    </ul>
                </div>

                <button type="button" class="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    Dodaj
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
</svg>

                </button>
                <input type="text" id="input-group-1" class="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="Szukaj">
            </div>
        </div>
        <ul>
        <li v-for="bookmark in bookmarks" :key="bookmark.bookmark_id">
            <a href="#" class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-5xl">
                <img class="object-cover w-full rounded-base h-64 md:h-auto md:w-48 mb-4 md:mb-0" src="/src/assets/logo.svg" alt="">
                <div class="flex flex-col justify-between md:p-4 leading-normal">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-heading">{{ bookmark.link }}</h5>
                    <p class="mb-6 text-body">Status: {{ bookmark.page_status }}<br>
                        Ostatnio zaktualizowano: {{ bookmark.change_date }}<br>
                    Utworzono: {{ bookmark.creation_date }}</p>
                    <div>
                        <button type="button" class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                            Usuń
                        </button>
                    </div>
                </div>
            </a>
        </li>
    </ul>
    </div>
    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Członkowie</h4>
            
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                <button type="button" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">Dodaj</button>
                <input type="text" id="input-group-1" class="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="Szukaj">
            </div>
        </div>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>ID członka</th>
            <th>ID użytkownika</th>
            <th>Rola</th>
            <th>Filtr</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="member in members" :key="member.member_id">
            <th scope="row">
                {{ member.member_id }}
            </th>
            <td>{{ member.user_id }}</td>
            <td>{{ member.role }}</td>
            <td>{{ member.filter_type }}</td>
        </tr>
  </tbody>
  </table>
    </div>
    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="settings" role="tabpanel" aria-labelledby="settings-tab">
        <div v-if="folder">
    <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Ustawienia</h4>
    <h4>ID: {{ folder.folder_id }}</h4>
    <h4>Twórca: {{ folder.creator_id }}</h4>
    <h4>Nazwa: {{ folder.name }}</h4>
    <h4>Widoczność: {{ folder.visibility }}</h4>
    <h4>Przywileje członków: {{ folder.member_privileges }}</h4>
    <h4>Data utworzenia: {{ folder.creation_date }}</h4>
  </div>

  <div>
    <h3 class= "mb-3">Zmień nazwę</h3>
    <form @submit.prevent="changeName">
        <input type="text" class= "mb-3" v-model="name" placeholder="Nazwa folderu" required><br>
        <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">Zmień</button>
    </form>
  </div>

  <div>
    <h3 class= "mb-3">Zmień widoczność</h3>
    <form @submit.prevent="changeVisibility">
        <input type="number" class= "mb-3" v-model.number="visibility" min="0" max="2" required><br>
        <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"">Zmień</button>
    </form>
  </div>

  <div>
    <h3 class= "mb-3">Zmień przywileje członków</h3>
    <form @submit.prevent="changeMemberPrivileges">
        <input type="number" class= "mb-3" v-model.number="member_privileges" min="0" max="2" required><br>
        <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none">Zmień</button>
    </form>
  </div>
    </div>
</div>
</div>
</template>