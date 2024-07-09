<script setup lang="ts">
import { watch } from 'vue'
import { loadSettings } from '../composables/settings'

const showNumbers = defineModel('showNumbers', { default: true })
showNumbers.value = loadSettings().showNumbers
watch(showNumbers, async () => {
    saveStorage()
})
defineExpose({ show })

function saveStorage() {
    try {
        localStorage.setItem('settings', JSON.stringify({ showNumbers: showNumbers.value }))
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