<script setup lang="ts">
import Typing from './Typing.vue'
import YouTubePreview from '../components/YouTubePreview.vue'
import { validateImage } from '../composables/image'
import JSConfetti from 'js-confetti'
import { ref, computed, onMounted } from 'vue'

const title = ref()
const channelTitle = ref()
const thumbnailURL = ref()
const error = ref()
const isSetTitle = ref(false)
const isSetChannelTitle = ref(false)
const isSetThumbnailURL = ref(false)
const isGameStarted = ref(false)
const typing = ref()

random()
async function random() {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/videos`)
    if (response.status !== 200) {
        beginUserInteraction()
        console.error(`Invalid /youtube/videos response with status ${response.status}`)
    } else {
        const json = await response.json()
        await waitUntil(() => typing.value && typing.value.finished)
        randomise(json, 0)
    }
}

function waitUntil(condition: any, interval: number = 100) {
    return new Promise<void>(function (resolve, _reject) {
        (function wait() {
            if (condition()) {
                return resolve();
            }
            setTimeout(wait, interval);
        })();
    });
}

async function randomise(json: any, index: number) {
    title.value = json.items[index].snippet.title
    channelTitle.value = json.items[index].snippet.channelTitle
    thumbnailURL.value = `https://img.youtube.com/vi/${json.items[index].id.videoId}/maxresdefault.jpg`

    const thumbnailsToShow = 3
    const timeout = 2000
    if (index + 1 < thumbnailsToShow && index + 1 < json.items.length) {
        setTimeout(() => { randomise(json, index + 1) }, timeout)
    } else {
        setTimeout(() => {
            beginUserInteraction()
        }, timeout);
    }
}

function beginUserInteraction() {
    title.value = 'Enter your video title'
    channelTitle.value = 'Enter your channel name'
    thumbnailURL.value = undefined
    isGameStarted.value = true
}

async function onChangeImage(file: any, finishLoading: () => void) {
    try {
        thumbnailURL.value = await validateImage(file)
    } catch (error: any) {
        showError(error.message)
    }
    isSetThumbnailURL.value = true
    finishLoading()
}

function showError(errorMessage: string) {
    error.value = errorMessage
    if (document) {
        (document.getElementById('youtube_container_home_error_modal') as HTMLFormElement).showModal();
    }
}

const progress = computed(() => {
    const progress = (isSetTitle.value ? 1 : 0) + (isSetChannelTitle.value ? 1 : 0) + (isSetThumbnailURL.value ? 1 : 0)
    if (progress === 3) {
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti()
    }
    return progress
})
</script>

<template>
    <div class="mockup-browser bg-base-300 lg:w-full aspect-[6/5]">
        <div class="mockup-browser-toolbar">
            <div class="input">
                <Typing text="youtube.com" ref="typing" />
            </div>
        </div>
        <div class="bg-base-200 flex flex-col px-8 lg:px-16 py-8 gap-8 h-full">
            <YouTubePreview v-if="title != undefined" :isGetFromYouTubeEnabled="false" :title="title"
                :channelName="channelTitle" :imageSrc="thumbnailURL" :index="0" :isHoverControlsEnabled="false"
                @changeTitle="(newTitle) => { title = newTitle; isSetTitle = true; }"
                @changeChannelName="(newChannelName) => { channelTitle = newChannelName; isSetChannelTitle = true; }"
                @changeImage="(file, cancelLoading) => { onChangeImage(file, cancelLoading); }" />
            <progress v-if="isGameStarted" class="progress progress-primary w-full" :value="progress"
                max="3"></progress>
        </div>
    </div>

    <Teleport to="body">
        <dialog id="youtube_container_home_error_modal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Ooops</h3>
                <p>{{ error }}</p>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </Teleport>
</template>