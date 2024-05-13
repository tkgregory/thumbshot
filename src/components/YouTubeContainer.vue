<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { ref } from 'vue'

type YouTubePreview = {
    title: string;
    imageSrc: string;
    fileName: string;
}

const realYouTubeVideos = [
    {
        videoId: 'XpN_Abd1RQc',
        title: 'Batman: Arkham Shadow - Official Teaser Trailer'
    },
    {
        videoId: '2ya8Oww8xWo',
        title: 'Godzilla Attacks Brawl Stars!!!'
    },
    {
        videoId: 'mEIJxaJLGUE',
        title: 'British Students’ Last Meal before Military: Korea’s #1 BBQ'
    },
    {
        videoId: 'HJqYoQBXXxs',
        title: "Finding out I'm pregnant & telling my family | BABY 3"
    },
    {
        videoId: 'TiMuT2BhwO0',
        title: 'Gracie Abrams - Risk (Official Music Video)'
    },
    {
        videoId: '4TU3EqSHLr4',
        title: 'YOUTUBER GUESS WHO: REAL LIFE EDITION'
    },
    {
        videoId: 'WBoWd991ClI',
        title: 'We Built an Actual WATER SLIDE in our House!'
    },
    {
        videoId: 'y6bJd27xoks',
        title: 'THE BOOGEYMAN CAME OUT TO PLAY! | Kendrick Lamar - Euphoria (Drake diss) (REACTION!!!)'
    },
    {
        videoId: 'hDTorbKavfI',
        title: 'Alter | Based on a True Story'
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
        fileName: ''
    })
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
    <youtube-container class="flex gap-y-[40px] gap-x-[16px] flex-wrap">
        <template v-for="(preview, index) in previewData">
            <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title" :deleteEnabled="previewData.length != 1"
                :addEnabled="previewData.length != maxPreviewCount" :moveLeftEnabled="index != 0"
                :moveRightEnabled="index != previewData.length - 1" :fileName="preview.fileName"
                @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                @changeImageSrc="(imageSrc, fileName) => { preview.imageSrc = imageSrc; preview.fileName = fileName; saveStorage(); }"
                @deletePreview="deletePreview(index); saveStorage();"
                @addPreview="addPreview(index + 1); saveStorage();" @moveLeft="moveLeft(index); saveStorage();"
                @moveRight="moveRight(index); saveStorage();" />
        </template>
    </youtube-container>
</template>