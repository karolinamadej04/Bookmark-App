<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const url = "http://localhost:8080/users";
const url2 = "http://localhost:8080/folders";
const route = useRoute()
const user = ref(null)
const folders = ref(null)

async function fetchUsers() {
        try {
            const response = await fetch(`${url.toString()}/${route.params.user_id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            user.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

async function fetchFolders() {
        try {
            const response = await fetch(`${url2.toString()}/${route.params.user_id}`);
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            folders.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

onMounted(() => {
    fetchUsers(), fetchFolders()})

</script>

<template>
  <div v-if="user">
    <h1>User</h1>
    <h4>ID: {{ user.user_id }}</h4>
    <h4>Email: {{ user.email }}</h4>
    <h4>Hasło: {{ user.user_password }}</h4>
  </div>

  <div>
<table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>id</th>
            <th>nazwa</th>
            <th>widoczność</th>
            <th>przywileje</th>
            <th>data utworzenia</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="folder in folders" :key="folder.folder_id">
        <th scope="row">
            {{ folder.folder_id }}
        </th>
        <td>{{ folder.name }}</td>
        <td>{{ folder.visibility }}</td>
        <td>{{ folder.member_privileges }}</td>
        <td>{{ folder.creation_date }}</td>
        </tr>
  </tbody>
  </table>
  </div>
</template>