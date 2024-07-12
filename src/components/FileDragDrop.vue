<script setup lang="ts">
import { ref } from 'vue'

const isFileDragging = ref(false)
const isFileUploading = ref(false)
const percentComplete = ref(0)
const fileEnterTarget = ref()

const emits = defineEmits(['addImages'])

async function fileDrop(event: any) {
    const files = event.dataTransfer.files;
    percentComplete.value = 0
    let processed = 0

    isFileUploading.value = true
    emits('addImages', files, () => {
        processed++;
        percentComplete.value = Math.round((processed / files.length) * 100);
        console.log(percentComplete.value)
        if (processed === files.length) {
            isFileUploading.value = false;
        }
    },
        () => { isFileUploading.value = false; });

    isFileDragging.value = false
}
</script>

<template>
    <file-drop-zone @dragover.prevent
        @dragenter="(event: any) => { if (event.dataTransfer.types.indexOf('Files') != -1) isFileDragging = true; fileEnterTarget = event.target; }"
        @dragleave="(event: any) => { if (event.target == fileEnterTarget) isFileDragging = false; }"
        @drop.prevent="(event: any) => { fileDrop(event); }">
        <slot :isFileDragging="isFileDragging" :isFileUploading="isFileUploading" :percentComplete="percentComplete">
        </slot>
    </file-drop-zone>
</template>