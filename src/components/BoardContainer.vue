<script setup lang="ts">
import ThumbnailBoard from './ThumbnailBoard.vue'
import LoadingButton from './LoadingButton.vue'
import NumberPicker from './NumberPicker.vue'
import { Camera } from 'lucide-vue-next';
import { RotateCcw } from 'lucide-vue-next';
import { Copy } from 'lucide-vue-next';
import { Check } from 'lucide-vue-next';
import { Download } from 'lucide-vue-next';
import { Images } from 'lucide-vue-next';
import { ref } from 'vue'
import { computed } from 'vue'
import { loadSettings } from '../composables/settings'
import { fetchScreenshot } from '../composables/api'
import { isPro } from '../composables/user'
import { accountLimits } from '../composables/data'
import { config } from '../composables/data'
const isGeneratingPreview = ref(false);
const isGeneratingSinglePreview = ref(false);
const previewUrl = ref()
const isJustCopiedURL = ref(false)
const isJustCopiedImage = ref(false)
const isJustDownloaded = ref(false)
const thumbnailBoard = ref<InstanceType<typeof ThumbnailBoard>>()
const error = ref()
const pro = ref()
const columnCount = ref()
isPro().then(value => pro.value = value)

const props = defineProps(['boardId'])
defineExpose({ thumbnailBoard: thumbnailBoard })

const isEmpty = computed(() => {
    return thumbnailBoard.value?.previewData && thumbnailBoard.value.previewData.length == 0
})

function reset() {
    thumbnailBoard.value?.reset()
}

function generatePreview() {
    isGeneratingPreview.value = true
    return fetchScreenshot(props.boardId, { showNumbers: loadSettings().showNumbers }, columnCount.value)
        .then(json => {
            previewUrl.value = json.previewUrl
            if (document) {
                (document.getElementById('generate_preview_modal') as HTMLFormElement).showModal();
            }
        }).catch(() => {
            handlePreviewImageError()
        }).finally(() => isGeneratingPreview.value = false);
}

function generateSinglePreview(index: number) {
    isGeneratingSinglePreview.value = true
    return fetchScreenshot(props.boardId, { showNumbers: false }, undefined, index)
        .then(json => {
            previewUrl.value = json.previewUrl
            if (document) {
                (document.getElementById('generate_preview_modal') as HTMLFormElement).showModal();
            }
        }).catch(() => {
            handlePreviewImageError()
        }).finally(() => isGeneratingSinglePreview.value = false);
}

function handlePreviewImageError() {
    error.value = "Could not generate preview image. Please try again later."
    if (document) {
        (document.getElementById('container_error_modal') as HTMLFormElement).showModal();
    }
}

function copyURLToClipboard() {
    if (previewUrl != null) {
        isJustCopiedURL.value = true
        setTimeout(() => {
            isJustCopiedURL.value = false
        }, 3000)
        return navigator.clipboard.writeText(previewUrl.value)
    }
}

async function copyImageToClipboard() {
    if (previewUrl != null) {
        const response = await fetch(previewUrl.value)
        const imageBlob = await response.blob()
        const pngBlob = await convertToPng(imageBlob);

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': pngBlob
            })
        ]);

        isJustCopiedImage.value = true
        setTimeout(() => {
            isJustCopiedImage.value = false
        }, 3000)
    }
}

function convertToPng(blob) {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((pngBlob) => {
                resolve(pngBlob);
            }, 'image/png');
        };

        img.src = URL.createObjectURL(blob);
    });
}

function download() {
    if (previewUrl != null) {
        isJustDownloaded.value = true
        setTimeout(() => {
            isJustDownloaded.value = false
        }, 3000)
    }
}
</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="flex justify-center gap-4">
            <div class="tooltip" :data-tip="!isEmpty ? 'Reset' : undefined">
                <button @click="reset" class="btn btn-square btn-neutral" :disabled="isEmpty">
                    <RotateCcw />
                </button>
            </div>
            <div class="tooltip" :data-tip="!isEmpty ? 'Generate shareable preview image' : undefined">
                <LoadingButton @click="generatePreview" :disabled="isEmpty" :isLoading="isGeneratingPreview">
                    <Camera />
                </LoadingButton>
            </div>
            <div class="hidden xl:block tooltip" data-tip="Set column count">
                <NumberPicker name="columnCount" :min="3" :max="6" defaultTextValue="Auto"
                    @change="(value) => columnCount = value" />
            </div>
            <dialog id="generate_preview_modal" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Share your preview image</h3>
                    <div class="flex items-center gap-2">
                        <input type="text" class="input input-bordered grow max-w-64 my-4" :value="previewUrl"
                            id="previewUrl" readonly />
                        <div class="tooltip" :data-tip="isJustCopiedURL ? 'Copied!' : 'Copy URL to clipboard'">
                            <button @click="copyURLToClipboard" class="btn btn-square btn-neutral">
                                <Copy v-if="!isJustCopiedURL" />
                                <Check v-if="isJustCopiedURL" color="#00ff00" />
                            </button>
                        </div>
                        <div class="tooltip" :data-tip="isJustCopiedImage ? 'Copied!' : 'Copy image to clipboard'">
                            <button @click="copyImageToClipboard" class="btn btn-square btn-neutral">
                                <Images v-if="!isJustCopiedImage" />
                                <Check v-if="isJustCopiedImage" color="#00ff00" />
                            </button>
                        </div>
                        <div class="tooltip" :data-tip="isJustDownloaded ? 'Downloaded!' : 'Download image'">
                            <a :href="previewUrl" download>
                                <button @click="download" class="btn btn-square btn-neutral">
                                    <Download v-if="!isJustDownloaded" />
                                    <Check v-if="isJustDownloaded" color="#00ff00" />
                                </button>
                            </a>
                        </div>

                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="container_error_modal" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Ooops</h3>
                    <p>{{ error }}</p>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
        <ThumbnailBoard ref="thumbnailBoard" :boardId="boardId" :isGeneratingSinglePreview="isGeneratingSinglePreview"
            @generateSinglePreview="(index) => generateSinglePreview(index)"
            :max-preview-count="accountLimits[pro ? 'pro' : 'free'].previewLimit" :columnCount="columnCount">
            <template #previewLimit>
                <template v-if="pro">
                    <p>You reached the {{ accountLimits.pro.previewLimit }} thumbnail limit.</p>
                </template>
                <template v-else>
                    <p class="mb-1">You reached the {{ accountLimits.free.previewLimit }} thumbnail limit.</p>
                    <p>
                        <a :href="config.stripePaymentLink" class="link-primary">
                            <button class="btn btn-primary btn-sm">Get Pro</button>
                        </a>
                        to add {{ accountLimits.pro.previewLimit }} thumbnails per board.
                    </p>
                </template>
            </template>
        </ThumbnailBoard>
    </div>
</template>