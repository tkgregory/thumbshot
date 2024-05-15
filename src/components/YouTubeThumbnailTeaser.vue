<script setup lang="ts">
import { Upload } from 'lucide-vue-next';
import { Shuffle } from 'lucide-vue-next';

defineEmits(['changeImage', 'randomize'])
</script>
<template>
    <div class="relative group">
        <div
            class="aspect-video rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer bg-youtube-dark" />
        <div class="absolute left-1/2 top-0 -translate-x-1/2 translate-y-full text-xl w-full text-center">
            Add thumbnail or randomize
        </div>
        <div class="absolute flex items-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="tooltip w-[32px]" data-tip="Add thumbnail">
                <label>
                    <Upload :size="32" class="clickable" />
                    <input name="thumbnail" type="file" accept="image/*" @change="$emit('changeImage', $event)"
                        class="hidden" />
                </label>
            </div>
            <div class="tooltip w-[32px]" data-tip="Randomize">
                <Shuffle :size="32" class="clickable" @click="$emit('randomize', $event)" />
            </div>
        </div>
    </div>
</template>