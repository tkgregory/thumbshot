<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { ref } from 'vue'

type YouTubePreview = {
    title: string;
    imageSrc: string;
    fileName: string;
    channelName: string;
}

const realYouTubeVideos = [
    {
        videoId: 'XpN_Abd1RQc',
        title: 'Batman: Arkham Shadow - Official Teaser Trailer',
        channelName: 'Some channel name'
    },
    {
        videoId: '2ya8Oww8xWo',
        title: 'Godzilla Attacks Brawl Stars!!!',
        channelName: 'Some channel name'
    },
    {
        videoId: 'mEIJxaJLGUE',
        title: 'British Students’ Last Meal before Military: Korea’s #1 BBQ',
        channelName: 'Some channel name'
    },
    {
        videoId: 'HJqYoQBXXxs',
        title: "Finding out I'm pregnant & telling my family | BABY 3",
        channelName: 'Some channel name'
    },
    {
        videoId: 'TiMuT2BhwO0',
        title: 'Gracie Abrams - Risk (Official Music Video)',
        channelName: 'Some channel name'
    },
    {
        videoId: '4TU3EqSHLr4',
        title: 'YOUTUBER GUESS WHO: REAL LIFE EDITION',
        channelName: 'Some channel name'
    },
    {
        videoId: 'WBoWd991ClI',
        title: 'We Built an Actual WATER SLIDE in our House!',
        channelName: 'Some channel name'
    },
    {
        videoId: 'y6bJd27xoks',
        title: 'THE BOOGEYMAN CAME OUT TO PLAY! | Kendrick Lamar - Euphoria (Drake diss) (REACTION!!!)',
        channelName: 'Some channel name'
    },
    {
        videoId: 'hDTorbKavfI',
        title: 'Alter | Based on a True Story',
        channelName: 'Some channel name'
    }
]

const previewData = ref<YouTubePreview[]>([])
const maxPreviewCount = ref(9)

loadStorage()
if (previewData.value.length == 0) {
    addPreviewAtEnd()
}

defineExpose({ reset, previewData })

function addPreviewAtEnd() {
    addPreview(previewData.value.length)
}

function addPreview(index: number) {
    const random = Math.floor(Math.random() * realYouTubeVideos.length);

    previewData.value.splice(index, 0, {
        title: realYouTubeVideos[random].title,
        imageSrc: `https://i.ytimg.com/vi/${realYouTubeVideos[random].videoId}/hq720.jpg`,
        fileName: '',
        channelName: realYouTubeVideos[random].channelName
    })
}

function duplicatePreview(index: number) {
    previewData.value.splice(index, 0, JSON.parse(JSON.stringify(previewData.value[index])))
}

function deletePreview(index: number) {
    previewData.value.splice(index, 1)
}

function moveLeft(index: number) {
    const firstElement = previewData.value[index - 1]
    const secondElement = previewData.value[index]
    previewData.value[index - 1] = secondElement
    previewData.value[index] = firstElement
}

function moveRight(index: number) {
    const firstElement = previewData.value[index]
    const secondElement = previewData.value[index + 1]
    previewData.value[index] = secondElement
    previewData.value[index + 1] = firstElement
}

function saveStorage() {
    try {
        localStorage.setItem('previewData', JSON.stringify(previewData.value))
    } catch (e) {
        console.error('Failed to save to local storage', e)
    }
}

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

function reset() {
    previewData.value.length = 0
    addPreviewAtEnd()
    saveStorage()
}
</script>

<template>
    <youtube-container class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] ">
        <template v-for="(preview, index) in previewData">
            <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title" :channelName="preview.channelName"
                :deleteEnabled="previewData.length != 1" :duplicateEnabled="previewData.length != maxPreviewCount"
                :moveLeftEnabled="index != 0" :moveRightEnabled="index != previewData.length - 1"
                :fileName="preview.fileName" @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                @changeChannelName="(channelName) => { preview.channelName = channelName; saveStorage(); }"
                @changeImageSrc="(imageSrc, fileName) => { preview.imageSrc = imageSrc; preview.fileName = fileName; saveStorage(); }"
                @deletePreview="deletePreview(index); saveStorage();"
                @duplicatePreview="duplicatePreview(index); saveStorage();" @moveLeft="moveLeft(index); saveStorage();"
                @moveRight="moveRight(index); saveStorage();" />
        </template>
    </youtube-container>
</template>