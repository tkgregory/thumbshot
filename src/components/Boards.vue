<script setup lang="ts">
import { fetchPathWithAuth } from '../composables/api'
import { Trash2 } from 'lucide-vue-next';
import { Plus } from 'lucide-vue-next';
import { ref, watch } from 'vue'

const boards = ref()
const selectedBoardId = ref()
const newBoardName = ref()
if (localStorage.getItem('selectedBoardId')) {
    selectedBoardId.value = localStorage.getItem('selectedBoardId')
}
defineExpose({ selectedBoardId })

listBoards()
async function listBoards() {
    return fetchPathWithAuth('GET', '/boards').then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then((json) => {
        boards.value = json
    })
}

async function deleteBoard(deleteBoardId: string) {
    if (confirm('Are you sure you want to delete this board?')) {
        await fetchPathWithAuth('DELETE', `/boards/${deleteBoardId}`).then((response) => {
            if (response.status !== 204) {
                throw new Error(`Invalid response with status ${response.status}`)
            }
        })
        if (selectedBoardId.value === deleteBoardId) {
            selectedBoardId.value = null
        }
        listBoards()
    }
}

function showCreateBoard() {
    (document.getElementById('create_board_modal') as HTMLFormElement).showModal();
}

async function createBoard() {
    const body = {
        name: newBoardName.value,
        previews: []
    }
    await fetchPathWithAuth('POST', `/boards`, body).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then((json) => {
        console.log(JSON.stringify(json, null, 2));
        selectedBoardId.value = json.id;
        (document.getElementById('create_board_modal') as HTMLFormElement).close();
        newBoardName.value = null;
        return listBoards();
    })
}

watch(selectedBoardId, async (newBoardId) => {
    if (newBoardId) {
        localStorage.setItem('selectedBoardId', newBoardId)
    } else {
        localStorage.removeItem('selectedBoardId')
    }
})
</script>

<template>
    <div class="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex justify-end">
            <label for="my-drawer-4" class="drawer-button btn btn-primary">Boards</label>
        </div>
        <div class="drawer-side z-10">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

            <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <div class="text-xl mb-4 flex gap-4 items-center">
                    Thumbnail boards
                    <div class="tooltip tooltip-bottom" data-tip="Create new board" @click="showCreateBoard()">
                        <div class="btn btn-ghost">
                            <Plus />
                        </div>
                    </div>
                </div>
                <ul>
                    <li v-for="board in boards">
                        <div class="flex py-0">
                            <div class="w-full" @click="selectedBoardId = board.id">{{ board.name }}&nbsp;</div>
                            <div class="tooltip tooltip-left" data-tip="Delete" @click="deleteBoard(board.id)">
                                <div class="btn btn-ghost">
                                    <Trash2 :size="16" />
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <dialog id="create_board_modal" class="modal">
        <div class="modal-box flex flex-col gap-4">
            <h3 class="font-bold text-lg">Create new Board</h3>
            <label class="flex items-center gap-2">
                Name
                <input type="text" v-model="newBoardName" @keyup.enter="createBoard()" placeholder="New board name"
                    class="input input-bordered w-full" />
            </label>
            <button class="btn btn-primary" @click="createBoard()">Create Board</button>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>