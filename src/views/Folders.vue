<script setup>
import { ref, onMounted, watch } from 'vue'

const url = "http://localhost:8080/folders";
const folders = ref([])
const token = localStorage.getItem('token')

async function fetchFolders() {
        try {
            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            folders.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }
onMounted(() => { fetchFolders() })

</script>

<template>
<div class="p-4 sm:ml-64">
  <h1>Folders</h1>
  <table class="w-full text-sm text-left rtl:text-right text-body">
    <thead class="text-sm text-body bg-neutral-secondary-soft border-b rounded-base border-default">
        <tr>
            <th>id folderu</th>
            <th>id twórcy</th>
            <th>nazwa</th>
            <th>widoczność</th>
            <th>przywileje folderu</th>
            <th>data utworzenia</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="folder in folders" :key="folder.folder_id">
        <th scope="row">{{ folder.folder_id }}</th>
        <td>{{ folder.creator_id }}</td>
        <td>{{ folder.name }}</td>
        <td>{{ folder.visibility }}</td>
        <td>{{ folder.member_privileges }}</td>
        <td>{{ folder.creation_date }}</td>
        </tr>
  </tbody>
  </table>
</div>
</template>