<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isEditing = ref(false)
const titleInput = ref<null | { focus: () => null }>(null)

defineProps(['value'])
defineEmits(['changeTitle'])

function edit() {
    isEditing.value = true
    console.log("Setting focus")
    nextTick(() => {
        titleInput?.value?.focus()
    })
}
</script>

<template>
    <span v-if="!isEditing && value != null" @click="edit" class="cursor-pointer">{{ value }}</span>
    <input v-if="isEditing || !value"
        @blur="isEditing = false; $emit('changeTitle', ($event.target as HTMLInputElement).value);"
        @focus="($event.target as HTMLInputElement).select()" name="title" :value="value" type="text"
        placeholder="Your video title" class="w-full" ref="titleInput" />
</template>