<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { loadSettings } from '../composables/settings'
import { getImageSrc } from '../composables/image'
import type { YouTubePreviewData } from '../types/YouTubePreviewData.type'
import YouTubePreview from './YouTubePreview.vue'

const previewData = ref<YouTubePreviewData[]>([])
const boardName = ref()
const isPollingServer = ref(true)
const props = defineProps({
    boardId: {
        required: true,
        type: String
    },
    boardIndex: {
        type: Number
    },
    columnCount: {
        type: String,
        required: false
    }
})

loadServer()
async function loadServer() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/boards/${props.boardId}`)

    if (response.status !== 200) {
        throw new Error(`Invalid response with status ${response.status}`)
    }
    const json = await response.json()
    boardName.value = json.name
    previewData.value = json.previews

    if (isPollingServer.value) {
        setTimeout(loadServer, 1000)
    }
}

onUnmounted(() => {
    isPollingServer.value = false
})
</script>

<template>
    <youtube-container
        :class="{ [`xl:grid-cols-3`]: columnCount == '3', [`xl:grid-cols-4`]: columnCount == '4', [`xl:grid-cols-5`]: columnCount == '5', [`xl:grid-cols-6`]: columnCount == '6' }"
        class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
        <template v-if="boardIndex != null">
            <template v-if="previewData.length >= boardIndex + 1">
                <YouTubePreview :imageSrc="getImageSrc(previewData[boardIndex])" :title="previewData[boardIndex].title"
                    :channelName="previewData[boardIndex].channelName" :index="boardIndex" />
            </template>
            <template v-else>
                Invalid index
            </template>
        </template>
        <template v-else v-for="(preview, index) in previewData">
            <YouTubePreview :imageSrc="getImageSrc(preview)" :title="preview.title" :channelName="preview.channelName"
                :index="index" :showNumbers="loadSettings().showNumbers && previewData.length > 1" />
        </template>
    </youtube-container>
</template>