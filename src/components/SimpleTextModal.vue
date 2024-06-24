<script setup lang="ts">
import { CircleX } from 'lucide-vue-next';
import { ref } from 'vue'

const errorMessage = ref()
const inputText = ref()
const modal = ref()

const emit = defineEmits(['submit'])
defineProps({
    title: { type: String, required: true }
})
defineExpose({ show })

function submit() {
    emit('submit', inputText.value, () => {
        reset()
    },
        (error: string) => {
            errorMessage.value = error
        })
}

function show() {
    modal.value.showModal()
}

function reset() {
    inputText.value = '';
    errorMessage.value = '';
    modal.value.close()
}
</script>

<template>
    <dialog class="modal" ref="modal">
        <div class="modal-box flex flex-col gap-4">
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <label class="flex items-center gap-2 whitespace-nowrap">
                Video URL
                <input type="text" v-model="inputText" @keyup.enter="submit()" required
                    class="input input-bordered w-full" />
            </label>
            <div v-if="errorMessage" role="alert" class="alert alert-error">
                <CircleX />
                <span>{{ errorMessage }}</span>
            </div>
            <button class="btn btn-primary" @click="submit()">Go</button>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="reset()">close</button>
        </form>
    </dialog>
</template>