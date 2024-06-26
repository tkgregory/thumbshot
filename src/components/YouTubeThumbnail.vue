<script setup lang="ts">
import { Camera } from 'lucide-vue-next';
import { CopyPlus } from 'lucide-vue-next';
import { CircleArrowLeft } from 'lucide-vue-next';
import { CircleArrowRight } from 'lucide-vue-next';
import { Upload } from 'lucide-vue-next';
import { X } from 'lucide-vue-next';
import { Grip } from 'lucide-vue-next';
import { Youtube } from 'lucide-vue-next';
import { ref } from 'vue'
import SimpleTextModal from './SimpleTextModal.vue';

defineProps({
    imageSrc: { type: String },
    moveLeftEnabled: { type: Boolean },
    moveRightEnabled: { type: Boolean },
    duplicateEnabled: { type: Boolean },
    isGeneratingPreview: { type: Boolean },
    isSinglePreviewEnabled: { type: Boolean },
    isGetFromYouTubeEnabled: { type: Boolean, default: true }
})
defineEmits(['changeImage', 'deletePreview', 'duplicatePreview', 'moveLeft', 'moveRight', 'generatePreview', 'getFromYouTube'])
const isLoading = ref(false)
const getFromYouTubeModal = ref()

</script>
<template>
    <youtube-thumbnail class="relative group block">
        <img class="rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer"
            :src="imageSrc" id="output" draggable="false" />
        <div class="absolute bottom-0 right-0 rounded bg-[#00000099] m-[8px] px-[4px] py-[1px] text-white">
            10:08
        </div>
        <div class="absolute hidden sm:group-hover:flex top-0 left-0 translate-x-1/4 translate-y-1/4 tooltip w-[32px] cursor-pointer"
            data-tip="Drag and drop to reorder">
            <Grip :size="32" />
        </div>
        <div class="absolute hidden group-hover:flex top-0 right-0 -translate-x-1/4 translate-y-1/4 tooltip w-[32px]"
            data-tip="Delete this preview">
            <X :size="32" class="clickable" @click="$emit('deletePreview')" />
        </div>

        <template v-if="isLoading">
            <div class="w-full absolute flex justify-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </template>
        <template v-else>
            <div
                class="w-full absolute hidden group-hover:flex justify-around gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="tooltip w-[32px] sm:hidden" :data-tip="moveLeftEnabled ? 'Move left' : undefined">
                    <CircleArrowLeft :size="32"
                        :class="{ [`clickable`]: moveLeftEnabled, [`disabled`]: !moveLeftEnabled }"
                        @click="moveLeftEnabled && $emit('moveLeft')" />
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
                        <div class="tooltip w-[32px]" data-tip="Change thumbnail">
                            <label>
                                <Upload :size="32" class="clickable" />
                                <input name="thumbnail" type="file" accept="image/*"
                                    @change="isLoading = true; $emit('changeImage', $event, () => { isLoading = false });"
                                    class="hidden" />
                            </label>
                        </div>
                        <div class="tooltip w-[32px]"
                            :data-tip="isGetFromYouTubeEnabled ? 'Get from YouTube' : 'Create a free account to Get from YouTube'">
                            <Youtube :size="32"
                                :class="{ [`clickable`]: isGetFromYouTubeEnabled, [`disabled`]: !isGetFromYouTubeEnabled }"
                                @click="isGetFromYouTubeEnabled && getFromYouTubeModal.show()" />
                        </div>
                        <div class="tooltip w-[32px]" :data-tip="duplicateEnabled ? 'Duplicate' : undefined">
                            <CopyPlus :size="32"
                                :class="{ [`clickable`]: duplicateEnabled, [`disabled`]: !duplicateEnabled }"
                                @click="duplicateEnabled && $emit('duplicatePreview')" />
                        </div>
                    </div>
                    <div class="flex justify-center">
                        <div v-if="isSinglePreviewEnabled" class="tooltip w-[32px]"
                            data-tip="Generate single preview image">
                            <span v-if="isGeneratingPreview" class="loading loading-spinner loading-md"></span>
                            <Camera v-else :size="32" class="clickable" @click="$emit('generatePreview')" />
                        </div>
                    </div>
                </div>
                <div class="tooltip w-[32px] sm:hidden" :data-tip="moveRightEnabled ? 'Move right' : undefined">
                    <CircleArrowRight :size="32"
                        :class="{ [`clickable`]: moveRightEnabled, [`disabled`]: !moveRightEnabled }"
                        @click="moveRightEnabled && $emit('moveRight')" />
                </div>
            </div>
        </template>
    </youtube-thumbnail>
    <Teleport to="body">
        <SimpleTextModal title="Get from YouTube"
            @submit="(text, handleSuccess, handleFailure) => $emit('getFromYouTube', text, handleSuccess, handleFailure)"
            ref="getFromYouTubeModal" />
    </Teleport>
</template>