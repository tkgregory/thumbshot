<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import { CirclePlus } from 'lucide-vue-next';
import { CircleMinus } from 'lucide-vue-next';
import { ref } from 'vue'
</script>

<script lang="ts">
export default {
    data() {
        return {
            previewCount: 1,
        }
    }
}
</script>

<template>
    <div class="flex gap-4 flex-wrap">
        <template v-for="index in previewCount" :key="index">
            <YouTubePreview />
            <div class="flex items-center">
                <CirclePlus v-if="previewCount == 1" @click="previewCount++" />
                <CircleMinus v-if="previewCount == 2 && index == 1" @click="previewCount--" />
            </div>
        </template>
    </div>
</template>