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
  <div v-if="folder" class="p-4 sm:ml-64">
    <h1>Folder</h1>
    <h4>ID: {{ folder.folder_id }}</h4>
    <h4>Twórca: {{ folder.creator_id }}</h4>
    <h4>Nazwa: {{ folder.name }}</h4>
    <h4>Widoczność: {{ folder.visibility }}</h4>
    <h4>Przywileje członków: {{ folder.member_privileges }}</h4>
    <h4>Data utworzenia: {{ folder.creation_date }}</h4>
  </div>

  <div class="p-4 sm:ml-64">
    <h3 class= "mb-3">Zmień nazwę</h3>
    <form @submit.prevent="changeName">
        <input type="text" class= "mb-3" v-model="name" placeholder="Nazwa folderu" required><br>
        <button type="submit" class= "btn btn-primary mb-3">Zmień</button>
    </form>
  </div>

  <div class="p-4 sm:ml-64">
    <h3 class= "mb-3">Zmień widoczność</h3>
    <form @submit.prevent="changeVisibility">
        <input type="number" class= "mb-3" v-model.number="visibility" min="0" max="2" required><br>
        <button type="submit" class= "btn btn-primary mb-3">Zmień</button>
    </form>
  </div>

  <div class="p-4 sm:ml-64">
    <h3 class= "mb-3">Zmień przywileje członków</h3>
    <form @submit.prevent="changeMemberPrivileges">
        <input type="number" class= "mb-3" v-model.number="member_privileges" min="0" max="2" required><br>
        <button type="submit" class= "btn btn-primary mb-3">Zmień</button>
    </form>
  </div>
  <!-- Zakładki -->
  <div class="p-4 sm:ml-64">
    <h1>Zakładki</h1>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>ID</th>
            <th>Link</th>
            <th>Scheduler</th>
            <th>Status strony</th>
            <th>Data zmiany</th>
            <th>Data utworzenia</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="bookmark in bookmarks" :key="bookmark.bookmark_id">
        <th scope="row">
            {{ bookmark.bookmark_id }}
        </th>
        <td>{{ bookmark.link }}</td>
        <td>{{ bookmark.scheduler }}</td>
        <td>{{ bookmark.page_status }}</td>
        <td>{{ bookmark.change_date }}</td>
        <td>{{ bookmark.creation_date }}</td>
        </tr>
  </tbody>
  </table>
  </div>

    <!-- Członkowie -->
<div class="p-4 sm:ml-64">
    <h1>Członkowie</h1>
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
</template>