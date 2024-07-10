<script setup lang="ts">
import { watch } from 'vue'
import { loadSettings } from '../composables/settings'

const showNumbers = defineModel('showNumbers', { default: true })
showNumbers.value = loadSettings().showNumbers
const defaultChannelName = defineModel('defaultChannelName')
defaultChannelName.value = loadSettings().defaultChannelName
watch([showNumbers, defaultChannelName], async () => {
    saveStorage()
})
defineExpose({ show })

function saveStorage() {
    try {
        localStorage.setItem('settings', JSON.stringify({ showNumbers: showNumbers.value, defaultChannelName: defaultChannelName.value }))
    } catch (e) {
        console.error(e)
    }
}

function show() {
    (document.getElementById('settings_modal') as HTMLFormElement).showModal()
}
</script>

<template>
    <dialog id="settings_modal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Settings</h3>
            <label class="label cursor-pointer">
                <span class="label-text">Show numbers on screenshot</span>
                <input type="checkbox" class="checkbox" v-model="showNumbers" />
            </label>
            <label class="label cursor-pointer gap-4">
                <span class="label-text whitespace-nowrap">Default channel name</span>
                <input type="text" class="input input-bordered w-full max-w-xs" v-model="defaultChannelName" />
            </label>
            <div class="modal-action">
                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>