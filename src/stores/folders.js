import { ref } from 'vue'

const folders = ref([])

export function useFolders() {

    async function fetchFolders() {

        try {

            const token = localStorage.getItem('token')

            const response = await fetch(
                'http://localhost:8080/myfolders',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            folders.value = await response.json()

        } catch (error) {

            console.error(error.message)
        }
    }

    return {
        folders,
        fetchFolders
    }
}