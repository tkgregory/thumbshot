<script setup lang="ts">
import { Upload } from 'lucide-vue-next';
import { Shuffle } from 'lucide-vue-next';
import { ref } from 'vue'

defineEmits(['changeImage', 'randomize'])
const isLoading = ref(false)
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
            <div class="absolute left-1/2 top-0 -translate-x-1/2 translate-y-full text-xl w-full text-center">
                Add thumbnail or randomize
            </div>
            <div class="absolute flex items-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="tooltip w-[32px]" data-tip="Add thumbnail">
                    <label>
                        <Upload :size="32" class="clickable" />
                        <input name="thumbnail" type="file" accept="image/*"
                            @change="isLoading = true; $emit('changeImage', $event, () => { isLoading = false })"
                            class="hidden" />
                    </label>
                </div>
                <div class="tooltip w-[32px]" data-tip="Randomize">
                    <Shuffle :size="32" class="clickable" @click="$emit('randomize', $event)" />
                </div>
            </div>
        </template>
    </div>
</template>