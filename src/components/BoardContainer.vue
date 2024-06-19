<script setup lang="ts">
import ThumbnailBoard from './ThumbnailBoard.vue'
import LoadingButton from './LoadingButton.vue'
import Settings from './Settings.vue'
import { Camera } from 'lucide-vue-next';
import { RotateCcw } from 'lucide-vue-next';
import { Copy } from 'lucide-vue-next';
import { Check } from 'lucide-vue-next';
import { Download } from 'lucide-vue-next';
import { ref } from 'vue'
import { computed } from 'vue'
import { loadSettings } from '../composables/settings'
import { fetchScreenshot } from '../composables/api'
import { isPro } from '../composables/user'
import { accountLimits } from '../composables/data'

const isGeneratingPreview = ref(false);
const isGeneratingSinglePreview = ref(false);
const previewUrl = ref()
const isJustCopied = ref(false)
const isJustDownloaded = ref(false)
const thumbnailBoard = ref<InstanceType<typeof ThumbnailBoard>>()
const error = ref()
const pro = ref()
isPro().then(value => pro.value = value)

const props = defineProps(['boardId'])
defineExpose({ thumbnailBoard: thumbnailBoard })

const isEmpty = computed(() => {
    return thumbnailBoard.value?.previewData.length == 0
})

function reset() {
    thumbnailBoard.value?.reset()
}

function generatePreview() {
    isGeneratingPreview.value = true
    return fetchScreenshot(props.boardId, { showNumbers: loadSettings().showNumbers })
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
    return fetchScreenshot(props.boardId, { showNumbers: false }, index)
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

function copyToClipboard() {
    if (previewUrl != null) {
        isJustCopied.value = true
        setTimeout(() => {
            isJustCopied.value = false
        }, 3000)
        return navigator.clipboard.writeText(previewUrl.value)
    }
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
            <div class="tooltip" data-tip="Change settings">
                <Settings />
            </div>
            <dialog id="generate_preview_modal" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Share your preview image</h3>
                    <div class="flex items-center gap-2">
                        <input type="text" class="input input-bordered w-full max-w-xs my-4" :value="previewUrl"
                            id="previewUrl" readonly />
                        <div class="tooltip" :data-tip="isJustCopied ? 'Copied!' : 'Copy URL to clipboard'">
                            <button @click="copyToClipboard" class="btn btn-square btn-neutral">
                                <Copy v-if="!isJustCopied" />
                                <Check v-if="isJustCopied" color="#00ff00" />
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
            :max-preview-count="accountLimits[pro ? 'pro' : 'free'].previewLimit">
            <template #previewLimit>
                <template v-if="pro">
                    <p>You reached the {{ accountLimits.pro.previewLimit }} thumbnail limit.</p>
                </template>
                <template v-else>
                    <p class="mb-1">You reached the {{ accountLimits.free.previewLimit }} thumbnail limit.</p>
                    <p>
                        <RouterLink to="sign-in" class="link-primary">
                            <button class="btn btn-primary btn-sm">Get Pro</button>
                        </RouterLink>
                        to add {{ accountLimits.pro.previewLimit }} thumbnails per board.
                    </p>
                </template>
            </template>
        </ThumbnailBoard>
    </div>
</template>