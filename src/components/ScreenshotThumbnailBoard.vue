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
const boardName = ref()
const props = defineProps(['boardId'])

loadServer()
async function loadServer() {
    fetch(`${import.meta.env.VITE_API_URL}/boards/${props.boardId}`).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then((json) => {
        boardName.value = json.name
        previewData.value = json.previews
    })
}
</script>

<template>
    <youtube-container
        class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
        <template v-for="(preview, index) in previewData">
            <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title" :channelName="preview.channelName"
                :duplicateEnabled="false" :moveLeftEnabled="index != 0"
                :moveRightEnabled="index != previewData.length - 1" :fileName="preview.fileName" :index="index" />
        </template>
    </youtube-container>
</template>