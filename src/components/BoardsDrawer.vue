<script setup lang="ts">
import { fetchPathWithAuth } from '../composables/api'
import { Pencil } from 'lucide-vue-next';
import { Trash2 } from 'lucide-vue-next';
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { isPro } from '../composables/user'
import { accountLimits } from '../composables/data'
import { config } from '../composables/data'
import type { Board } from '../types/Board.type'
import { getCurrentUser } from 'aws-amplify/auth';
import { CircleChevronLeft } from 'lucide-vue-next';
const route = useRoute()
const router = useRouter()
const boards = ref([] as Board[])
const newBoardName = ref()
const isDrawerOpen = ref()
const renamedBoardId = ref()
const renamedBoardName = ref()
defineExpose({ boards, open })
const emits = defineEmits(['selectedBoardUpdated'])
const pro = ref()
const sortBy = ref(localStorage.getItem('sortBy') !== null ? localStorage.getItem('sortBy') : 'Name')
const sortDirection = ref(localStorage.getItem('sortDirection') !== null ? localStorage.getItem('sortDirection') : 'ascending')
import { ArrowUp } from 'lucide-vue-next';
import { ArrowDown } from 'lucide-vue-next';
isPro().then(value => pro.value = value)

listBoards()

async function listBoards() {
    return fetchPathWithAuth('GET', '/user/boards').then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then((json) => {
        boards.value = json
        sort()
    })
}

function sortByUpdated(a: Board, b: Board) {
    if (a.updated < b.updated) {
        return -1;
    }
    if (a.updated > b.updated) {
        return 1;
    }
    return 0;
}

function sortByName(a: Board, b: Board) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

async function deleteBoard(deleteBoardId: string) {
    if (confirm('Are you sure you want to delete this board?')) {
        await fetchPathWithAuth('DELETE', `/user/boards/${deleteBoardId}`).then((response) => {
            if (response.status !== 204) {
                throw new Error(`Invalid response with status ${response.status}`)
            }
        })
        if (deleteBoardId == route.params.boardId) {
            router.push('/')
            await clearLocalStorage()
        }
        listBoards()
    }
}

function showCreateBoard() {
    newBoardName.value = null;
    (document.getElementById('create_board_modal') as HTMLFormElement).showModal();
}

function showRenameBoard(boardId: string, boardName: string) {
    renamedBoardId.value = boardId;
    renamedBoardName.value = boardName;
    (document.getElementById('rename_board_modal') as HTMLFormElement).showModal()
}

async function createBoard() {
    const body = {
        name: newBoardName.value,
        previews: []
    }
    const json = await fetchPathWithAuth('POST', `/user/boards`, body).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    })
    router.push(`/boards/${json.id}`);
    await updateLocalStorage(json.id);
    (document.getElementById('create_board_modal') as HTMLFormElement).close();
    await listBoards();
}

async function renameBoard() {
    const body = {
        name: renamedBoardName.value,
    }
    await fetchPathWithAuth('PUT', `/user/boards/${renamedBoardId.value}`, body).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        (document.getElementById('rename_board_modal') as HTMLFormElement).close();

        if (renamedBoardId.value == route.params.boardId) {
            emits('selectedBoardUpdated')
        }
        return listBoards();
    })
}

async function updateLocalStorage(boardId: string) {
    return getCurrentUser()
        .then((user) => {
            localStorage.setItem(`selectedBoardId-${user.username}`, boardId);
        })
}

async function clearLocalStorage() {
    return getCurrentUser()
        .then((user) => {
            localStorage.removeItem(`selectedBoardId-${user.username}`);
        })
}

function changeSortDirection(direction: string) {
    sortDirection.value = direction;
    localStorage.setItem('sortDirection', sortDirection.value)
    sort();
}

function selectSortBy(event: any) {
    sortBy.value = event.target.value
    if (sortBy.value !== null) {
        localStorage.setItem('sortBy', sortBy.value)
    }
    sort()
}

function sort() {
    if (sortBy.value === 'Name') {
        boards.value.sort(sortByName)
    }
    else if (sortBy.value === 'Updated') {
        boards.value.sort(sortByUpdated)
    }

    if (sortDirection.value === 'descending') {
        boards.value.reverse()
    }
}

function open() {
    isDrawerOpen.value = true
}
</script>

<template>
    <div class="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
        <div class="drawer-content flex justify-end">
            <label for="my-drawer-4" class="drawer-button btn btn-ghost">
                <CircleChevronLeft />
                Boards
            </label>
        </div>
        <div class="drawer-side z-10">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>

            <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <div class="text-xl mb-4 flex gap-4 items-center justify-between">
                    <div class="flex items-center gap-2">
                        Boards
                        <div v-if="boards.length < accountLimits.free.boardsLimit || pro" class="tooltip tooltip-left"
                            data-tip="Create new board" @click="showCreateBoard()">
                            <div class="btn btn-ghost">
                                <Plus />
                            </div>
                        </div>
                        <div v-else class="tooltip tooltip-left tooltip-accent"
                            data-tip="Get Pro to add unlimited boards">
                            <div class="btn btn-sm btn-square btn-disabled">
                                <Plus :size="16" />
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div v-if="sortDirection === 'ascending'" @click="changeSortDirection('descending')"
                            class="btn btn-sm btn-ghost rounded-left">
                            <ArrowUp :size="16" />
                        </div>
                        <div v-else @click="changeSortDirection('ascending')" class="btn btn-sm btn-ghost rounded-left">
                            <ArrowDown :size="16" />
                        </div>
                        <select name="sort-by" class="select select-sm w-full max-w-xs rounded-right mr-1"
                            @change="selectSortBy">
                            <option disabled>Sort by</option>
                            <option :selected="sortBy === 'Name'">Name</option>
                            <option :selected="sortBy === 'Updated'">Updated</option>
                        </select>
                    </div>
                </div>
                <ul>
                    <li v-for="board in boards" class="group">
                        <RouterLink class="flex py-0 pr-0 h-12" :to="`/boards/${board.id}`"
                            @click="updateLocalStorage(board.id)">
                            <div class="w-full">{{ board.name }}&nbsp;</div>
                            <div class="hidden group-hover:flex">
                                <div class="tooltip" data-tip="Rename"
                                    @click.stop="showRenameBoard(board.id, board.name)">
                                    <div class="btn btn-ghost px-2">
                                        <Pencil :size="14" />
                                    </div>
                                </div>
                                <div class="tooltip tooltip-left" data-tip="Delete" @click.stop="deleteBoard(board.id)">
                                    <div class="btn btn-ghost px-2">
                                        <Trash2 :size="14" />
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </li>
                </ul>
                <div v-if="boards.length >= accountLimits.free.boardsLimit && !pro" class="mt-8">
                    <p class="mb-1">You reached the {{ accountLimits.free.boardsLimit }} board limit.</p>
                    <p>
                        <a :href="config.stripePaymentLink" class="link-primary">
                            <button class="btn btn-primary btn-xs">Get Pro</button>
                        </a>
                        to add unlimited boards.
                    </p>
                </div>
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

    <dialog id="rename_board_modal" class="modal">
        <div class="modal-box flex flex-col gap-4">
            <h3 class="font-bold text-lg">Rename Board</h3>
            <label class="flex items-center gap-2">
                Name
                <input type="text" v-model="renamedBoardName" @keyup.enter="renameBoard()" placeholder="New board name"
                    class="input input-bordered w-full" />
            </label>
            <button class="btn btn-primary" @click="renameBoard()">Rename Board</button>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>