<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFolders } from '@/stores/folders'
import { useAuth } from '@/stores/auth';

const url = "http://localhost:8080/folders";
const url2 = "http://localhost:8080/bookmarks";
const url3 = "http://localhost:8080/folders";
const url4 = "http://localhost:8080/members";
const url5 = "http://localhost:8080/domains";
const url6 = "http://localhost:8080/filters";
const route = useRoute()
const router = useRouter()
const { user, fetchMe } = useAuth()

const { fetchFolders } = useFolders()

const accessDenied = ref(false)
const search = ref("")
const sortMode = ref("name")

const bookmark_name = ref("")
const member_email = ref("")
const folder = ref(null)
const bookmarks = ref([])
const members = ref([])
const domains = ref([])
const filters = ref([])
const visibility = ref(null)
const member_privileges = ref(null)
const name = ref(null)
const domain = ref("")
const filtered_phrase = ref("")
const link = ref("")

const memberSuccess = ref("")
const memberError = ref("")

const deleteMember = async (member_id) => {
        try {
            const response = await fetch(url4+`/${member_id}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            await fetchMembers()
        } catch (error) {
            console.error(error.message);
        }
}

const addMember = async () => {
        memberError.value = ""
        memberSuccess.value = ""

        try {
            const response = await fetch(url4.toString(), {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    folder_id:route.params.folder_id,
                    email: member_email.value
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            memberSuccess.value="Dodano członka do grupy."
            member_email.value=""
            await fetchMembers()
        } catch (error) {
            memberError.value = "Użytkownik nie istnieje lub jest już członkiem grupy."
        }
    }

const filteredBookmarks = computed(() => {
    let list = [...bookmarks.value]

    if (search.value) {
        const query = search.value.toLowerCase()

        list = list.filter(bookmark =>
            bookmark.link.toLowerCase().includes(query) ||
            bookmark.name.toLowerCase().includes(query)
        )
    }

    switch (sortMode.value) {

        case "name":
            return list.sort((a, b) =>
                a.name.localeCompare(b.name)
            )

        case "updated_desc":
            return list.sort((a, b) =>
                new Date(b.change_date) - new Date(a.change_date)
            )

        case "created_desc":
            return list.sort((a, b) =>
                new Date(b.creation_date) - new Date(a.creation_date)
            )

        case "created_asc":
            return list.sort((a, b) =>
                new Date(a.creation_date) - new Date(b.creation_date)
            )

        default:
            return list
    }
})

function getFavicon(link) {

    try {

        const hostname = new URL(link).hostname

        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`

    } catch {

        return '/src/assets/logo.svg'
    }
}

function formatDate(date){
    return date || ""
}

const isValidLink = computed(() => {
    if (!link.value) return false

    try {
        const url = new URL(link.value)
        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        )
    } catch {
        return false
    }
})

//const token = localStorage.getItem('token')

const removeFolder = async () => {
        try {
            const response = await fetch(url3+`/${route.params.folder_id}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            await fetchFolders()
            router.push('/folders')
        } catch (error) {
            console.error(error.message);
        }
    }

const addBookmark = async () => {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(url2.toString(), {
                method:"POST",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    folder_id:route.params.folder_id,
                    name: bookmark_name.value,
                    link: link.value
                })
            });
            if (!response.ok) {
            const text = await response.text()
            console.log(text)
            throw new Error(`Response status: ${response.status}`);
            }

            bookmark_name.value=""
            link.value=""
            await fetchBookmarks()
        } catch (error) {
            console.error(error.message);
        }
    }

const deleteBookmark = async (bookmark_id) => {
        try {
            const response = await fetch(url2+`/${bookmark_id}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            await fetchBookmarks()
        } catch (error) {
            console.error(error.message);
        }
}

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
            await fetchFolders() // Odświeżanie panelu bocznego
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
const addDomain = async () => {
        try {
            const response = await fetch(url5.toString(), {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    domain:domain.value,
                    folder_id:route.params.folder_id
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            domain.value=""
            await fetchDomains()
        } catch (error) {
            console.error(error.message);
        }
    }

const deleteDomain = async (domain_id) => {
        try {
            const response = await fetch(url5+`/${domain_id}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            await fetchDomains()
        } catch (error) {
            console.error(error.message);
        }
}

const addFilter = async () => {
        try {
            const response = await fetch(url6.toString(), {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    filtered_phrase:filtered_phrase.value,
                    folder_id:route.params.folder_id
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            filtered_phrase.value=""
            await fetchFilters()
        } catch (error) {
            console.error(error.message);
        }
    }

const deleteFilter = async (filter_id) => {
        try {
            const response = await fetch(url6+`/${filter_id}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            await fetchFilters()
        } catch (error) {
            console.error(error.message);
        }
}

async function fetchFolder() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${url.toString()}/${route.params.folder_id}`, {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });

            if (response.status === 403 || response.status === 404){
                accessDenied.value = true
                router.replace('/not-found')
                return
            }

            const data = await response.json()

            folder.value = data
            visibility.value = data.visibility
            member_privileges.value = data.member_privileges
        } catch (error) {
            accessDenied.value = true
            router.replace({ name: 'NotFound' })
        }
    }

async function fetchBookmarks() {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${url2.toString()}/${route.params.folder_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
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
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${url4.toString()}/${route.params.folder_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            members.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchDomains() {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${url5.toString()}/${route.params.folder_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            domains.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchFilters() {
        try {
            const token = localStorage.getItem('token')

            const response = await fetch(
                `${url6.toString()}/${route.params.folder_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            filters.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }


onMounted( async () => { 
    await fetchMe()
    await fetchFolder()
    if (accessDenied.value) return
    await fetchBookmarks()
    await fetchMembers()
    await fetchDomains()
    await fetchFilters()
})

</script>

<template>
<div class="p-4 sm:ml-64">
<div class="mb-4 border-b border-default">
    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Folder</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="members-tab" data-tabs-target="#members" type="button" role="tab" aria-controls="members" aria-selected="false">Członkowie</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Ustawienia</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="domains-tab" data-tabs-target="#domains" type="button" role="tab" aria-controls="domains" aria-selected="false">Domeny</button>
        </li>
        <li class="me-2" role="presentation">
            <button class="inline-block p-4 border-b-2 rounded-t-base hover:text-fg-brand hover:border-brand" id="filters-tab" data-tabs-target="#filters" type="button" role="tab" aria-controls="filters" aria-selected="false">Filtry</button>
        </li>
    </ul>
</div>
<div id="default-tab-content">
    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div class="items-center justify-between w-full md:flex md:w-auto md:order-1">
                <h4 v-if="folder" class="text-3xl font-bold tracking-tight text-heading md:text-4xl">{{folder.name}}</h4>
            </div>
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                <button data-modal-target="default-modal-0" data-modal-toggle="default-modal-0" class="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" type="button">
                    Dodaj
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/></svg>

                </button>
                <button data-modal-target="remove-folder-modal" data-modal-toggle="remove-folder-modal" :disabled="!user || !folder || folder.creator_id !== user.user_id" class="inline-flex items-center text-nowrap text-white bg-danger hover:bg-danger-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" type="button">
                    Usuń folder
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/></svg>
                </button>
                <form class="max-w-md mx-auto">   
                    <label for="search" class="block mb-2.5 text-sm font-medium text-heading sr-only ">Szukaj</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
                        </div>
                        <input type="search" id="search" v-model="search" class="block w-full p-3 ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body" placeholder="Szukaj" required />
                    </div>
                </form>
            </div>
        </div>
        
        <div>
        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" class="inline-flex items-center justify-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none" type="button">
                Sortuj 
                <svg class="w-4 h-4 ms-1.5 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                </button>

                <!-- Dropdown menu -->
                <div id="dropdown" class="z-10 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44">
                    <ul class="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <a href="#" @click.prevent="sortMode = 'name'" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Nazwa</a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="sortMode = 'update_desc'" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Ostatnie aktualizowane</a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="sortMode = 'created_desc'" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Od najnowszych</a>
                    </li>
                    <li>
                        <a href="#" @click.prevent="sortMode = 'created_asc'" class="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Od najstarszych</a>
                    </li>
                    </ul>
                </div>
            </div>

        <ul>
        <li v-for="bookmark in filteredBookmarks" :key="bookmark.bookmark_id">
            <div class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-5xl">
                <a target="_blank" rel="noopener noreferrer" :href="bookmark.link" class="flex flex-col items-center md:flex-row w-full">
                    <img class="object-cover w-full rounded-base h-64 md:h-auto md:w-48 mb-4 md:mb-0" :src="getFavicon(bookmark.link)" :alt="bookmark.name">
                    <div class="flex flex-col justify-between md:p-4 leading-normal">
                        <h5 class="mb-2 text-3xl font-bold tracking-tight text-heading">{{ bookmark.name }}</h5>
                        <h5 class="mb-2 text-xl font-bold tracking-tight text-heading">{{ bookmark.link }}</h5>
                        <p class="mb-6 text-body">Status: {{ bookmark.page_status }}<br>
                        Ostatnio zaktualizowano: {{ formatDate(bookmark.change_date) }}<br>
                        Utworzono: {{ formatDate(bookmark.creation_date) }}</p>
                    </div>
                </a>
                <div class="mt-4 md:mt-0 md:ml-auto">
                    <button @click.stop="deleteBookmark(bookmark.bookmark_id)" type="button" class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        Usuń
                    </button>
                </div>
            </div>
        </li>
    </ul>


    <!-- Add bookmark modal -->
    <div id="default-modal-0" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <form @submit.prevent="addBookmark">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                <!-- Modal header -->
                <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                    <h3 class="text-lg font-medium text-heading">
                        Dodaj zakładkę
                    </h3>
                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal-0">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        <span class="sr-only">Zamknij</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="space-y-4 md:space-y-6 py-4 md:py-6">
                    <p class="leading-relaxed text-body">       
                            <input type="text" class= "mb-1" v-model="bookmark_name" placeholder="Nazwa"><br>
                    </p>
                    <p class="leading-relaxed text-body">       
                            <input type="url" class= "mb-1" v-model="link" placeholder="https://example.com" required><br>
                    </p>
                    <p
                        v-if="link && !isValidLink"
                        class="text-red-500 text-sm"
                    >
                        Wprowadź poprawny link URL
                    </p>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                    <button data-modal-hide="default-modal-0" type="submit" :disabled="!isValidLink" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Dodaj</button>
                    <button data-modal-hide="default-modal-0" type="reset" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Zamknij</button>
                </div>
            </div>
        </div>
        </form>
    </div>


    <!-- Remove folder modal -->
    <div id="remove-folder-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <form @submit.prevent="removeFolder">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                <!-- Modal header -->
                <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                    <h3 class="text-lg font-medium text-heading">
                        Czy na pewno chcesz usunąć folder?
                    </h3>
                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="remove-folder-modal">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        <span class="sr-only">Zamknij</span>
                    </button>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                    <button data-modal-hide="remove-folder-modal" type="reset" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Nie</button>
                    <button data-modal-hide="remove-folder-modal" type="submit" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Tak</button>
                </div>
            </div>
        </div>
        </form>
    </div>




    </div>
    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="members" role="tabpanel" aria-labelledby="members-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Członkowie</h4>
            
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                <button data-modal-target="default-modal-add-member" data-modal-toggle="default-modal-add-member" type="button" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" :disabled="!user || !folder || folder.creator_id !== user.user_id">Dodaj</button>
            </div>
        </div>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>Email</th>
            <th>ID użytkownika</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="member in members" :key="member.member_id">
            <th scope="row">
                {{ member.email }}
            </th>
            <td>{{ member.user_id }}</td>
            <td>
                <button @click.stop="deleteMember(member.member_id)" type="button" class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" :disabled="!user || !folder || folder.creator_id !== user.user_id">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        Usuń
                </button>
            </td>
        </tr>
  </tbody>
  </table>
    </div>

    <!-- Add member modal -->
    <div id="default-modal-add-member" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <form @submit.prevent="addMember">
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                <!-- Modal header -->
                <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                    <h3 class="text-lg font-medium text-heading">
                        Dodaj członka
                    </h3>
                    <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal-add-member">
                        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                        <span class="sr-only">Zamknij</span>
                    </button>
                </div>
                <!-- Modal body -->
                <div class="space-y-4 md:space-y-6 py-4 md:py-6">
                    <p class="leading-relaxed text-body">       
                            <input type="text" class= "mb-1" v-model="member_email" placeholder="example@gmail.com"><br>
                    </p>
                    <p v-if="memberError" class="text-red-500 text-sm">
                        {{ memberError }}
                    </p>
                    <p v-if="memberSuccess" class="text-green-500 text-sm">
                        {{ memberSuccess }}
                    </p>
                </div>
                <!-- Modal footer -->
                <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                    <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Dodaj</button>
                    <button data-modal-hide="default-modal-add-member" type="reset" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Zamknij</button>
                </div>
            </div>
        </div>
        </form>
    </div>



    <div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="settings" role="tabpanel" aria-labelledby="settings-tab">
    <div v-if="folder">
        <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Ustawienia</h4>
        <h4>ID: {{ folder.folder_id }}</h4>
        <h4>Twórca: {{ folder.creator_id }}</h4>
        <h4>Nazwa: {{ folder.name }}</h4>
        <h4>Data utworzenia: {{ formatDate(folder.creation_date) }}</h4>
  
        
        <h3 class= "mb-3">Zmień nazwę</h3>
        <form @submit.prevent="changeName">
            <input type="text" class= "mb-3" v-model="name" placeholder="Nazwa folderu" required :disabled="!user || !folder || folder.creator_id !== user.user_id"><br>
            <button type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" :disabled="!user || !folder || folder.creator_id !== user.user_id">Zmień</button>
        </form>


        <h3 class= "mb-3">Zmień widoczność</h3>
        <form @submit.prevent="changeVisibility">
            <select class= "mb-3" v-model.number="visibility" @change="changeVisibility" :disabled="!user || !folder || folder.creator_id !== user.user_id">
                        <option :value=0>Prywatny</option>
                        <option :value=1>Ograniczony</option>
                        <option :value=2>Publiczny</option>
            </select>
        </form>
    </div>

  <div>
    <h3 class= "mb-3">Zmień przywileje członków</h3>
    <form @submit.prevent="changeMemberPrivileges">
        <select class= "mb-3" v-model.number="member_privileges" @change="changeMemberPrivileges" :disabled="!user || !folder || folder.creator_id !== user.user_id">
                     <option :value=0>Tylko do odczytu</option>
                     <option :value=1>Dodawanie zakładek</option>
                     <option :value=2>Pełne przywileje</option>
            </select>
    </form>
  </div>
    </div>
</div>
<div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="domains" role="tabpanel" aria-labelledby="domains-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Dozwolone domeny</h4>
            
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                <button :disabled="!user || !folder || folder.creator_id !== user.user_id" data-modal-target="default-modal" data-modal-toggle="default-modal" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" type="button">Dodaj</button>
                <input type="text" id="input-group-1" class="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="Szukaj">
            </div>
        </div>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>ID domeny</th>
            <th>Domena</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="domain in domains" :key="domain.domain_id">
            <th scope="row">
                {{ domain.domain_id }}
            </th>
            <td>{{ domain.domain }}</td>
            <td>
                <button :disabled="!user || !folder || folder.creator_id !== user.user_id" @click="deleteDomain(domain.domain_id)" type="button" class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                            Usuń
                </button>
            </td>
        </tr>
  </tbody>
  </table>

<!-- Main modal -->
<div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <form @submit.prevent="addDomain">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <!-- Modal header -->
            <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 class="text-lg font-medium text-heading">
                    Dodaj nową domenę
                </h3>
                <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span class="sr-only">Zamknij</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="space-y-4 md:space-y-6 py-4 md:py-6">
                <p class="leading-relaxed text-body">
                    Dodaj element do listy dozwolonych domen.
                </p>
                <p class="leading-relaxed text-body">
                    
                        <input type="text" class= "mb-3" v-model="domain" placeholder="domena" required><br>
                </p>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                <button data-modal-hide="default-modal" type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Dodaj</button>
                <button data-modal-hide="default-modal" type="reset" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Zamknij</button>
            </div>
        </div>
    </div>
    </form>
</div>
</div>




<div class="hidden p-4 rounded-base bg-neutral-secondary-soft" id="filters" role="tabpanel" aria-labelledby="filters-tab">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <h4 class="text-3xl font-bold tracking-tight text-heading md:text-4xl">Filtry</h4>
            
            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
                <button :disabled="!user || !folder || folder.creator_id !== user.user_id" data-modal-target="default-modal2" data-modal-toggle="default-modal2" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none" type="button">Dodaj</button>
                <input type="text" id="input-group-1" class="block w-full ps-9 pe-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-2.5 py-2 shadow-xs placeholder:text-body" placeholder="Szukaj">
            </div>
        </div>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>ID filtru</th>
            <th>Filtrowany zwrot</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="filter in filters" :key="filter.filter_id">
            <th scope="row">
                {{ filter.filter_id }}
            </th>
            <td>{{ filter.filtered_phrase }}</td>
            <td>
                <button :disabled="!user || !folder || folder.creator_id !== user.user_id" @click="deleteFilter(filter.filter_id)" type="button" class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:border-gray-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                            Usuń
                </button>
            </td>
        </tr>
  </tbody>
  </table>
</div>
<!-- Main modal -->
<div id="default-modal2" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <form @submit.prevent="addFilter">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            <!-- Modal header -->
            <div class="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 class="text-lg font-medium text-heading">
                    Dodaj filtrowany zwrot
                </h3>
                <button type="button" class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal2">
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                    <span class="sr-only">Zamknij</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="space-y-4 md:space-y-6 py-4 md:py-6">
                <p class="leading-relaxed text-body">
                        <input type="text" class= "mb-3" v-model="filtered_phrase" placeholder="filtr" required><br>
                </p>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                <button data-modal-hide="default-modal2" type="submit" class="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Dodaj</button>
                <button data-modal-hide="default-modal2" type="reset" class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Zamknij</button>
            </div>
        </div>
    </div>
    </form>
</div>

</div>
</template>