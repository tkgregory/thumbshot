<script setup lang="ts">
import { CopyPlus } from 'lucide-vue-next';
import { CircleArrowLeft } from 'lucide-vue-next';
import { CircleArrowRight } from 'lucide-vue-next';
import { Upload } from 'lucide-vue-next';
import { X } from 'lucide-vue-next';

defineProps(['imageSrc', 'moveLeftEnabled', 'moveRightEnabled', 'duplicateEnabled'])
defineEmits(['changeImage', 'deletePreview', 'duplicatePreview', 'moveLeft', 'moveRight'])
</script>
<template>
    <youtube-thumbnail class="relative group">
        <img class="rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer"
            :src="imageSrc" id="output" />
        <div class="absolute bottom-0 right-0 rounded bg-[#00000099] m-[8px] px-[4px] py-[1px] text-white">
            10:08
        </div>
        <div class="absolute hidden group-hover:flex top-0 right-0 -translate-x-1/4 translate-y-1/4 tooltip w-[32px]"
            data-tip="Delete this preview">
            <X :size="32" class="clickable" @click="$emit('deletePreview')" />
        </div>
        <div
            class="absolute hidden group-hover:flex items-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="tooltip w-[32px]" :data-tip="moveLeftEnabled ? 'Move left' : undefined">
                <CircleArrowLeft :size="32" :class="{ [`clickable`]: moveLeftEnabled, [`disabled`]: !moveLeftEnabled }"
                    @click="moveLeftEnabled && $emit('moveLeft')" />
            </div>
            <div class="tooltip w-[32px]" data-tip="Change thumbnail">
                <label>
                    <Upload :size="32" class="clickable" />
                    <input name="thumbnail" type="file" accept="image/*" @change="$emit('changeImage', $event)"
                        class="hidden" />
                </label>
            </div>
            <div class="tooltip w-[32px]" :data-tip="duplicateEnabled ? 'Duplicate' : undefined">
                <CopyPlus :size="32" :class="{ [`clickable`]: duplicateEnabled, [`disabled`]: !duplicateEnabled }"
                    @click="duplicateEnabled && $emit('duplicatePreview')" />
            </div>
            <div class="tooltip w-[32px]" :data-tip="moveRightEnabled ? 'Move right' : undefined">
                <CircleArrowRight :size="32"
                    :class="{ [`clickable`]: moveRightEnabled, [`disabled`]: !moveRightEnabled }"
                    @click="moveRightEnabled && $emit('moveRight')" />
            </div>
        </div>
    </youtube-thumbnail>
</template>