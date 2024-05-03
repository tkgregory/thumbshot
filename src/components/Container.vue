<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { CirclePlus } from 'lucide-vue-next';
import { CircleMinus } from 'lucide-vue-next';
import { ArrowLeftRight } from 'lucide-vue-next';
</script>

<script lang="ts">

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

export default {
    data() {
        return {
            previewData: [] as any[],
            maxPreviewCount: 9
        }
    },
    created() {
        this.loadStorage()
        if (this.previewData.length == 0) {
            this.addPreview()
        }
    },
    methods: {
        addPreview() {
            this.addPreview(this.previewData.length)
        },
        addPreview(index: number) {
            const random = Math.floor(Math.random() * realYouTubeVideos.length);

            this.previewData.splice(index, 0, {
                title: realYouTubeVideos[random].title,
                imageSrc: `https://i.ytimg.com/vi/${realYouTubeVideos[random].videoId}/hq720.jpg`
            })
        },
        removePreview() {
            this.previewData.pop()
        },
        swapPreview(index1: number, index2: number) {
            const firstElement = this.previewData[index1]
            const secondElement = this.previewData[index2]
            this.previewData[index1] = secondElement
            this.previewData[index2] = firstElement
        },
        saveStorage() {
            try {
                localStorage.setItem('previewData', JSON.stringify(this.previewData))
            } catch (e) {
                console.error('Failed to save to local storage', e)
            }
        },
        loadStorage() {
            try {
                const previewData = localStorage.getItem('previewData')
                if (previewData) {
                    this.previewData = JSON.parse(previewData as string);
                }
            } catch (e) {
                console.error('Failed to load from local storage', e)
            }
        },
        reset() {
            this.previewData.length = 0
            this.addPreview()
            this.saveStorage()
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-16">
        <div class="flex justify-center">
            <button @click="reset" class="btn btn-neutral">Reset</button>
        </div>
        <div class="flex gap-y-4 flex-wrap">
            <template v-for="(preview, index) in previewData">
                <div class="flex">
                    <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title"
                        @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                        @changeImageSrc="(imageSrc) => { preview.imageSrc = imageSrc; saveStorage(); }" />

                    <div class="flex flex-col gap-4 justify-center">
                        <CirclePlus v-if="previewData.length != maxPreviewCount"
                            @click="addPreview(index + 1); saveStorage();" />
                        <CircleMinus v-if="previewData.length != 1 && index == previewData.length - 1"
                            @click="removePreview(); saveStorage();" />
                        <ArrowLeftRight v-if="previewData.length != 1 && index != previewData.length - 1"
                            @click="swapPreview(index + 1, index); saveStorage();" />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>