<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { ref } from 'vue'

type YouTubePreview = {
    title: string;
    imageSrc: string;
    fileName: string;
    channelName: string;
}

const previewData = ref<YouTubePreview[]>([])

loadStorage()

function loadStorage() {
    try {
        const localStoragePreviewData = localStorage.getItem('previewData') as string
        if (localStoragePreviewData) {
            previewData.value = JSON.parse(localStoragePreviewData);
        }
    } catch (e) {
        console.error('Failed to load from local storage', e)
    }
}
</script>

<template>
    <youtube-container
        class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
        <template v-for="(preview) in previewData">
            <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title" :channelName="preview.channelName"
                :duplicateEnabled="false" :moveLeftEnabled="false" :moveRightEnabled="false"
                :fileName="preview.fileName" />
        </template>
    </youtube-container>
</template>