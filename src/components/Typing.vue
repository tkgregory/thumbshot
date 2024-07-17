<script setup lang="ts">
import { ref } from 'vue'

const revealedText = ref()
const finished = ref(false)
let index = 0

const props = defineProps({
    text: {
        type: String,
        required: true
    },
})
defineExpose({ finished })

const interval = 60
setTimeout(revealNext, interval)
function revealNext() {
    revealedText.value = props.text.slice(0, index)
    if (index < props.text.length) {
        index++
        setTimeout(revealNext, interval)
    } else {
        finished.value = true
    }
}
</script>

<template>
    {{ revealedText }}
</template>