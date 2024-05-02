<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { CirclePlus } from 'lucide-vue-next';
import { CircleMinus } from 'lucide-vue-next';
import { ArrowLeftRight } from 'lucide-vue-next';
</script>

<script lang="ts">
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
            this.previewData.push({
                title: `My awesome video ${this.previewData.length + 1}`,
                imageSrc: "https://i.ytimg.com/vi/hCMEGQfLIEM/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMpxw60a6wuygbengcJqCViJOFnQ"
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
                        <CirclePlus v-if="previewData.length != maxPreviewCount && index == previewData.length - 1"
                            @click="addPreview(); saveStorage();" />
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