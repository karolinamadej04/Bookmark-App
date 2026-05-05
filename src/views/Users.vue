<script setup>
    import { ref, onMounted, watch } from 'vue'

    const url = "http://localhost:8080/users";
    const users = ref([])
    const email = ref("")
    const user_password = ref("")
    const user_id = ref("")
    const put_user_password = ref("")
    const put_user_id = ref("")

    async function fetchUsers() {
        try {
            const response = await fetch(url.toString());
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            users.value = await response.json();
        } catch (error) {
            console.error(error.message);
        }
    }

    const addUser = async () => {
        try {
            const response = await fetch(url.toString(), {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    email:email.value,
                    user_password: user_password.value
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            email.value=""
            user_password.value=""
            await fetchUsers()
        } catch (error) {
            console.error(error.message);
        }
    }

    const deleteUser = async () => {
        try {
            const response = await fetch(url+`/${user_id.value}`, {
                method:"DELETE",
            })

            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
            }
            user_id.value=""
            await fetchUsers()
        } catch (error) {
            console.error(error.message);
        }
    }

    const changePassword = async () => {
        try {
            const response = await fetch(`${url.toString()}/${put_user_id.value}`, {
                method:"PUT",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    user_password: put_user_password.value
                })
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            put_user_id.value=""
            put_user_password.value=""
            await fetchUsers()
        } catch (error) {
            console.error(error.message);
        }
    }


/*
const changePassword = async () => {
        try {
            const requestOptions = {
                method:"PUT",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    user_password: put_user_password.value
                })
            }
            const response = await fetch(`${url.toString()}/${put_user_id.value}`, requestOptions);
            const data = await response.json;
            this.put_user_password=data.put_user_password
            

            put_user_id.value=""
            put_user_password.value=""
            await fetchUsers()
            
        } catch (error) {
            console.error(error.message);
        }
    }
*/

onMounted(() => {
    fetchUsers()})
    
</script>

<template>
    <h1>Users</h1>
    <table class="w-full table-fixed text-sm text-left text-gray-500 dark:text-gray-400">
    <thead>
        <tr>
            <th>id</th>
            <th>email</th>
            <th>password</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="user in users" :key="user.user_id">
        <th scope="row">
            {{ user.user_id }}
        </th>
        <td>{{ user.email }}</td>
        <td>{{ user.user_password }}</td>
        </tr>
  </tbody>
  </table>

<h3 class= "mb-3">Dodaj użytkownika</h3>
<form @submit.prevent="addUser">
    <input type="text" class= "mb-3" v-model="email" placeholder="email" required><br>
    <input type="text" class= "mb-3" v-model="user_password" placeholder="hasło" required><br>
    <button type="submit" class= "btn btn-primary mb-3">Dodaj</button>
</form>

<h3 class= "mb-3">Usuń użytkownika</h3>
<form @submit.prevent="deleteUser">
    <input type="text" class= "mb-3" v-model="user_id" placeholder="id użytkownika" required><br>
    <button type="submit" class= "btn btn-primary mb-3">Usuń</button>
</form>

<h3 class= "mb-3">Zmień hasło</h3>
<form @submit.prevent="changePassword">
    <input type="text" class= "mb-3" v-model="put_user_id" placeholder="id użytkownika" required><br>
    <input type="text" class= "mb-3" v-model="put_user_password" placeholder="hasło użytkownika" required><br>
    <button type="submit" class= "btn btn-primary mb-3">Zmień hasło</button>
</form>
</template>