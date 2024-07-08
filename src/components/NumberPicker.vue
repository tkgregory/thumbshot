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
    defaultTextValue: {
        type: String,
        required: true
    }
})
const numberValue = ref(initialValue())
const emits = defineEmits(['change'])
emit()

function increment() {
    if (numberValue.value === undefined) {
        numberValue.value = props.min
    } else {
        numberValue.value = numberValue.value >= props.max ? props.max : numberValue.value + 1
    }
    saveToLocalStorage()
    emit()
}

function decrement() {
    if (numberValue.value !== undefined && numberValue.value > props.min) {
        numberValue.value--
    } else {
        numberValue.value = undefined
    }

    saveToLocalStorage()
    emit()
}

function emit() {
    if (numberValue.value === undefined) {
        emits('change', undefined)
    } else {
        emits('change', numberValue.value.toString())
    }
}

function initialValue() {
    const storedValue = localStorage.getItem(props.name)
    if (storedValue) {
        if (isNaN(parseInt(storedValue))) {
            return props.min
        }
        return parseInt(storedValue)
    }

    return undefined
}

function saveToLocalStorage() {
    if (numberValue.value === undefined) {
        localStorage.removeItem(props.name)
    } else {
        localStorage.setItem(props.name, numberValue.value.toString())
    }
}
</script>

<template>
    <div class="join">
        <button class="btn btn-neutral btn-square join-item  rounded-l-full" @click="decrement">
            <Minus />
        </button>
        <div class="bg-neutral flex items-center justify-center w-full join-item min-w-12 px-1">
            <template v-if="numberValue === undefined">
                {{ defaultTextValue }}
            </template>
            <template v-else>
                {{ numberValue }}
            </template>
        </div>
        <button class="btn btn-neutral btn-square join-item rounded-r-full" @click="increment">
            <Plus />
        </button>
    </div>
</template>