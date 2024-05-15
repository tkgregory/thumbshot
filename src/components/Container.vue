<script setup lang="ts">
import YouTubeContainer from './YouTubeContainer.vue'
import { Camera } from 'lucide-vue-next';
import { RotateCcw } from 'lucide-vue-next';
import { Copy } from 'lucide-vue-next';
import { Check } from 'lucide-vue-next';
import { Download } from 'lucide-vue-next';
import { ref } from 'vue'

const isLoading = ref(false);
const previewUrl = ref()
const isJustCopied = ref(false)
const isJustDownloaded = ref(false)
const youtubeContainer = ref<InstanceType<typeof YouTubeContainer>>()

function reset() {
    youtubeContainer.value?.reset()
}

function generatePreview() {
    isLoading.value = true
    return fetch(`${import.meta.env.VITE_API_URL}/preview`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(youtubeContainer.value?.previewData)
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then(json => {
        isLoading.value = false
        previewUrl.value = json.previewUrl
        if (document) {
            (document.getElementById('my_modal_1') as HTMLFormElement).showModal();
        }
    });
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
            <div class="tooltip" data-tip="Reset">
                <button @click="reset" class="btn btn-square btn-neutral">
                    <RotateCcw />
                </button>
            </div>
            <div class="tooltip" data-tip="Generate shareable preview image">
                <button @click="!isLoading && generatePreview()" class="btn btn-square btn-primary"
                    :disabled="isLoading">
                    <Camera v-if="!isLoading" />
                    <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
                </button>
            </div>
            <dialog id="my_modal_1" class="modal">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Share your preview image</h3>
                    <div class="flex items-center gap-2">
                        <input type="text" class="input input-bordered w-full max-w-xs my-4" :value="previewUrl"
                            readonly />
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
        </div>
        <YouTubeContainer ref="youtubeContainer" />
    </div>
</template>