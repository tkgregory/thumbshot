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
            previewData: [] as any[]
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
        swapPreview() {
            const firstElement = this.previewData[0]
            const secondElement = this.previewData[1]
            this.previewData[0] = secondElement
            this.previewData[1] = firstElement
        },
        saveStorage() {
            localStorage.setItem('previewData', JSON.stringify(this.previewData))
        },
        loadStorage() {
            const previewData = localStorage.getItem('previewData')
            if (previewData) {
                this.previewData = JSON.parse(previewData as string);
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
        <div class="flex gap-4 flex-wrap">
            <template v-for="(preview, index) in previewData">
                <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title"
                    @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                    @changeImageSrc="(imageSrc) => { preview.imageSrc = imageSrc; saveStorage(); }" />
                <div class="flex flex-col gap-4 justify-center">
                    <CirclePlus v-if="previewData.length == 1" @click="addPreview(); saveStorage();" />
                    <CircleMinus v-if="previewData.length == 2 && index == 0"
                        @click="removePreview(); saveStorage();" />
                    <ArrowLeftRight v-if="previewData.length == 2 && index == 0"
                        @click="swapPreview(); saveStorage();" />
                </div>
            </template>
        </div>
    </div>
</template>