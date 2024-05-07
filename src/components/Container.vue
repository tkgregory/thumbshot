<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { Camera } from 'lucide-vue-next';
import { RotateCcw } from 'lucide-vue-next';
import { Copy } from 'lucide-vue-next';
import { Check } from 'lucide-vue-next';
import { ref } from 'vue'
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

const isLoading = ref(false);
export default {
    data() {
        return {
            previewData: [] as any[],
            maxPreviewCount: 9,
            previewUrl: null,
            isJustCopied: false
        }
    },
    created() {
        this.loadStorage()
        if (this.previewData.length == 0) {
            this.addPreviewAtEnd()
        }
    },
    methods: {
        addPreviewAtEnd() {
            this.addPreview(this.previewData.length)
        },
        addPreview(index: number) {
            const random = Math.floor(Math.random() * realYouTubeVideos.length);

            this.previewData.splice(index, 0, {
                title: realYouTubeVideos[random].title,
                imageSrc: `https://i.ytimg.com/vi/${realYouTubeVideos[random].videoId}/hq720.jpg`,
                fileName: ''
            })
        },
        deletePreview(index: number) {
            this.previewData.splice(index, 1)
        },
        moveLeft(index: number) {
            const firstElement = this.previewData[index - 1]
            const secondElement = this.previewData[index]
            this.previewData[index - 1] = secondElement
            this.previewData[index] = firstElement
        },
        moveRight(index: number) {
            const firstElement = this.previewData[index]
            const secondElement = this.previewData[index + 1]
            this.previewData[index] = secondElement
            this.previewData[index + 1] = firstElement
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
            this.addPreviewAtEnd()
            this.saveStorage()
        },
        generatePreview() {
            isLoading.value = true
            return fetch(`${import.meta.env.VITE_API_URL}/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.previewData)
            }).then(response => {
                if (response.status !== 200) {
                    throw new Error(`Invalid response with status ${response.status}`)
                }
                return response.json()
            }).then(json => {
                isLoading.value = false
                this.previewUrl = json.previewUrl
                if (document) {
                    (document.getElementById('my_modal_1') as HTMLFormElement).showModal();
                }
            });
        },
        copyToClipboard() {
            if (this.previewUrl != null) {
                this.isJustCopied = true
                setTimeout(() => {
                    this.isJustCopied = false
                }, 3000)
                return navigator.clipboard.writeText(this.previewUrl)
            }
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-16">
        <div class="flex justify-center gap-4">
            <div class="tooltip" data-tip="Reset">
                <button @click="reset" class="btn btn-square">
                    <RotateCcw />
                </button>
            </div>
            <div class="tooltip" data-tip="Generate shareable preview image">
                <button @click="!isLoading && generatePreview()" class="btn btn-square" :disabled="isLoading">
                    <Camera v-if="!isLoading" />
                    <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
                </button>
            </div>
            <dialog id="my_modal_1" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Share your preview image</h3>
                    <div class="flex items-center">
                        <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs my-4"
                            :value="previewUrl" readonly />
                        <div class="tooltip" :data-tip="isJustCopied ? 'Copied!' : 'Copy URL to clipboard'">
                            <button @click="copyToClipboard" class="btn btn-square mx-4">
                                <Copy v-if="!isJustCopied" />
                                <Check v-if="isJustCopied" color="#00ff00" />
                            </button>
                        </div>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
        <div class="flex gap-y-4 flex-wrap">
            <template v-for="(preview, index) in previewData">
                <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title"
                    :deleteEnabled="previewData.length != 1" :addEnabled="previewData.length != maxPreviewCount"
                    :moveLeftEnabled="index != 0" :moveRightEnabled="index != previewData.length - 1"
                    :fileName="preview.fileName" @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                    @changeImageSrc="(imageSrc, fileName) => { preview.imageSrc = imageSrc; preview.fileName = fileName; saveStorage(); }"
                    @deletePreview="deletePreview(index); saveStorage();"
                    @addPreview="addPreview(index + 1); saveStorage();" @moveLeft="moveLeft(index); saveStorage();"
                    @moveRight="moveRight(index); saveStorage();" />
            </template>
        </div>
    </div>
</template>