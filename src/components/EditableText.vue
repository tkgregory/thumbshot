<script setup lang="ts">
import { ref, nextTick } from 'vue'

const isEditing = ref(false)
const inputElement = ref<null | { focus: () => null }>(null)

defineProps(['name', 'value', 'placeholder'])
defineEmits(['changeValue'])

function edit() {
    isEditing.value = true
    console.log("Setting focus")
    nextTick(() => {
        inputElement?.value?.focus()
    })
}
</script>

<template>
    <span v-if="!isEditing && value != null" @click="edit" class="cursor-pointer">{{ value }}</span>
    <input v-if="isEditing || !value"
        @blur="isEditing = false; $emit('changeValue', ($event.target as HTMLInputElement).value);"
        @focus="($event.target as HTMLInputElement).select()" @keyup.enter="($event.target as HTMLInputElement).blur()"
        :name="name" :value="value" type="text" :placeholder="placeholder" class="w-full" ref="inputElement" />
</template>