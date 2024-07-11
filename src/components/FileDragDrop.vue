<script setup lang="ts">
import { ref } from 'vue'

const isFileDragging = ref(false)
const isFileUploading = ref(false)
const fileEnterTarget = ref()

const emits = defineEmits(['changeImage'])

async function fileDrop(event: any) {
    const firstItem = event.dataTransfer.items[0]
    if (firstItem.kind === "file") {
        isFileUploading.value = true
        const file = firstItem.getAsFile();
        emits('changeImage', file, () => { isFileUploading.value = false; });
    }
    isFileDragging.value = false
}
</script>

<template>
    <file-drop-zone @dragover.prevent
        @dragenter="(event: any) => { if (event.dataTransfer.types.indexOf('Files') != -1) isFileDragging = true; fileEnterTarget = event.target; }"
        @dragleave="(event: any) => { if (event.target == fileEnterTarget) isFileDragging = false; }"
        @drop.prevent="(event: any) => { fileDrop(event); }">
        <slot :isFileDragging="isFileDragging" :isFileUploading="isFileUploading"></slot>
    </file-drop-zone>
</template>