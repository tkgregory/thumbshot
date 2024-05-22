<script setup lang="ts">
import { SettingsIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue'
import { loadSettings } from '../composables/settings'

const showNumbers = defineModel('showNumbers', { default: true })
showNumbers.value = loadSettings().showNumbers
watch(showNumbers, async () => {
    saveStorage()
})

function saveStorage() {
    try {
        localStorage.setItem('settings', JSON.stringify({ showNumbers: showNumbers.value }))
    } catch (e) {
        console.error(e)
    }
}
</script>

<template>
    <div class="drawer drawer-end">
        <input id="settings-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <label for="settings-drawer" class="drawer-button btn btn-square btn-neutral">
                <SettingsIcon />
            </label>
        </div>
        <div class="drawer-side z-10">
            <label for="settings-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="form-control menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <label class="label cursor-pointer">
                    <span class="label-text">Show numbers on screenshot</span>
                    <input type="checkbox" class="checkbox" v-model="showNumbers" />
                </label>
            </div>
        </div>
    </div>
</template>