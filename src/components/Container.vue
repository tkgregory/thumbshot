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
        this.addPreview()
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
        }
    }
}
</script>

<template>
    <div class="flex gap-4 flex-wrap">
        <template v-for="(preview, index) in previewData">
            <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title"
                @changeTitle="(title) => preview.title = title"
                @changeImageSrc="(imageSrc) => preview.imageSrc = imageSrc" />
            <div class="flex flex-col gap-4 justify-center">
                <CirclePlus v-if="previewData.length == 1" @click="addPreview" />
                <CircleMinus v-if="previewData.length == 2 && index == 0" @click="removePreview" />
                <ArrowLeftRight v-if="previewData.length == 2 && index == 0" @click="swapPreview" />
            </div>
        </template>
    </div>
</template>