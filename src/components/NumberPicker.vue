<script setup lang="ts">
import { Minus } from 'lucide-vue-next';
import { Plus } from 'lucide-vue-next';
import { ref } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    },
    default: {
        type: Number,
        required: true
    },
})
const numberValue = ref(initialValue())
const emits = defineEmits(['change'])
emits('change', numberValue.value)

function increment() {
    numberValue.value = numberValue.value >= props.max ? props.max : numberValue.value + 1
    saveToLocalStorage()
    emits('change', numberValue.value)
}

function decrement() {
    numberValue.value = numberValue.value <= props.min ? props.min : numberValue.value - 1
    saveToLocalStorage()
    emits('change', numberValue.value)
}

function initialValue() {
    const value = localStorage.getItem(props.name)
    if (value) {
        return parseInt(value)
    }

    return props.default
}

function saveToLocalStorage() {
    localStorage.setItem(props.name, numberValue.value.toString())
}
</script>


<template>
    <div class="join">
        <button class="btn btn-neutral btn-square join-item  rounded-l-full" @click="decrement">
            <Minus />
        </button>
        <div class="bg-neutral flex items-center w-full join-item px-3">{{ numberValue }}</div>
        <button class="btn btn-neutral btn-square join-item rounded-r-full" @click="increment">
            <Plus />
        </button>
    </div>
</template>