<script setup lang="ts">
import { Upload } from 'lucide-vue-next';
import { Shuffle } from 'lucide-vue-next';
import { Youtube } from 'lucide-vue-next';
import SimpleTextModal from './SimpleTextModal.vue';
import { ref } from 'vue'

const emit = defineEmits(['changeImage', 'randomize', 'getFromYouTube'])
defineProps({
    isGetFromYouTubeEnabled: {
        type: Boolean,
        default: true
    }
})

const isLoading = ref(false)
const getFromYouTubeModal = ref()
</script>

<template>
    <div class="relative group aspect-video">
        <template v-if="isLoading">
            <div class="w-full absolute flex justify-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </template>
        <template v-else>
            <div
                class="rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer bg-youtube-dark" />
            <div
                class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full flex flex-col items-center gap-2">
                <div class="text-xl w-full text-center">
                    Add thumbnail or randomize
                </div>
                <div class="flex items-center gap-4">
                    <div class="tooltip w-[32px]" data-tip="Add thumbnail">
                        <label>
                            <Upload :size="32" class="clickable" />
                            <input name="thumbnail" type="file" accept="image/*"
                                @change="isLoading = true; $emit('changeImage', $event, () => { isLoading = false })"
                                class="hidden" />
                        </label>
                    </div>
                    <div class="tooltip w-[32px]"
                        :data-tip="isGetFromYouTubeEnabled ? 'Get from YouTube' : 'Create a free account to Get from YouTube'">
                        <Youtube :size="32"
                            :class="{ [`clickable`]: isGetFromYouTubeEnabled, [`disabled`]: !isGetFromYouTubeEnabled }"
                            @click="isGetFromYouTubeEnabled && getFromYouTubeModal.show()" />
                    </div>
                    <div class="tooltip w-[32px]" data-tip="Randomize">
                        <Shuffle :size="32" class="clickable" @click="$emit('randomize', $event)" />
                    </div>
                </div>
            </div>
        </template>
    </div>
    <Teleport to="body">
        <SimpleTextModal title="Get from YouTube"
            @submit="(text, handleSuccess, handleFailure) => $emit('getFromYouTube', text, handleSuccess, handleFailure)"
            ref="getFromYouTubeModal" />
    </Teleport>
</template>