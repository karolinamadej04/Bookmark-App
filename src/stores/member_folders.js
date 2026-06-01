import { ref } from 'vue'

const memberFolders = ref([])

export function useMemberFolders() {

    async function fetchMemberFolders() {

        try {

            const token = localStorage.getItem('token')

            const response = await fetch(
                'http://localhost:8080/memberfolders',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            memberFolders.value = await response.json()
            console.log('memberFolders:', memberFolders.value)

        } catch (error) {
            console.error(error.message)
        }
    }

    return {
        memberFolders,
        fetchMemberFolders
    }
}