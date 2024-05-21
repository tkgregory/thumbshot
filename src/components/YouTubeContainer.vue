<script setup lang="ts">
import YouTubePreview from './YouTubePreview.vue'
import YouTubeThumbnailTeaser from './YouTubeThumbnailTeaser.vue'
import { ref } from 'vue'

type YouTubePreview = {
    title: string;
    imageSrc: string;
    fileName: string;
    channelName: string;
}

const realYouTubeVideos = [
    {
        videoId: 'XpN_Abd1RQc',
        title: 'Batman: Arkham Shadow - Official Teaser Trailer',
        channelName: 'Some Channel Name'
    },
    {
        videoId: '2ya8Oww8xWo',
        title: 'Godzilla Attacks Brawl Stars!!!',
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'mEIJxaJLGUE',
        title: 'British Students’ Last Meal before Military: Korea’s #1 BBQ',
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'HJqYoQBXXxs',
        title: "Finding out I'm pregnant & telling my family | BABY 3",
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'TiMuT2BhwO0',
        title: 'Gracie Abrams - Risk (Official Music Video)',
        channelName: 'Some Channel Name'
    },
    {
        videoId: '4TU3EqSHLr4',
        title: 'YOUTUBER GUESS WHO: REAL LIFE EDITION',
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'WBoWd991ClI',
        title: 'We Built an Actual WATER SLIDE in our House!',
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'y6bJd27xoks',
        title: 'THE BOOGEYMAN CAME OUT TO PLAY! | Kendrick Lamar - Euphoria (Drake diss) (REACTION!!!)',
        channelName: 'Some Channel Name'
    },
    {
        videoId: 'hDTorbKavfI',
        title: 'Alter | Based on a True Story',
        channelName: 'Some Channel Name'
    }
]

const validExtensions = ['jpg', 'jpeg', 'png']
const previewData = ref<YouTubePreview[]>([])
const maxPreviewCount = ref(9)
const error = ref()

loadStorage()

defineExpose({ reset, previewData })

function randomize() {
    const index = previewData.value.length
    const random = Math.floor(Math.random() * realYouTubeVideos.length);

    previewData.value.splice(index, 0, {
        title: realYouTubeVideos[random].title,
        imageSrc: `https://i.ytimg.com/vi/${realYouTubeVideos[random].videoId}/hq720.jpg`,
        fileName: '',
        channelName: realYouTubeVideos[random].channelName
    })
}

function buildPreviewFromTeaser(imageSrc: string, fileName: string) {
    const index = previewData.value.length

    previewData.value.splice(index, 0, {
        title: 'Enter your video title',
        imageSrc: imageSrc,
        fileName: fileName,
        channelName: 'Enter your channel name'
    })
}

function duplicatePreview(index: number) {
    previewData.value.splice(index, 0, JSON.parse(JSON.stringify(previewData.value[index])))
}

function deletePreview(index: number) {
    previewData.value.splice(index, 1)
}

function moveLeft(index: number) {
    const firstElement = previewData.value[index - 1]
    const secondElement = previewData.value[index]
    previewData.value[index - 1] = secondElement
    previewData.value[index] = firstElement
}

function moveRight(index: number) {
    const firstElement = previewData.value[index]
    const secondElement = previewData.value[index + 1]
    previewData.value[index] = secondElement
    previewData.value[index + 1] = firstElement
}

function saveStorage() {
    try {
        localStorage.setItem('previewData', JSON.stringify(previewData.value))
    } catch (e) {
        console.error(e)
        if (e instanceof DOMException) {
            showError("Thumbnail images too large. \n\nYou can add more thumbnails, but they won't be available when you reload the page. \n\nPlease use smaller thumbnail images e.g. 1280x720 JPG files.")
        }
    }
}

function loadStorage() {
    try {
        const localStoragePreviewData = localStorage.getItem('previewData') as string
        if (localStoragePreviewData) {
            previewData.value = JSON.parse(localStoragePreviewData);
        }
    } catch (e) {
        console.error('Failed to load from local storage', e)
    }
}

function reset() {
    previewData.value.length = 0
    saveStorage()
}

type MyCallback = (imageSrc: string, fileName: string) => void;

function onChangeImage(event: any, callback: MyCallback) {
    if (!event.target.files[0]) {
        return
    }

    const fileName = event.target.files[0].name
    if (validExtensions.indexOf(fileName.split('.').pop().toLowerCase()) == -1) {
        showError(`Image must be one of these types: ${validExtensions.join(", ")}`)
        return
    } else {
        const reader = new FileReader()
        reader.onloadend = function () {
            var image = new Image()
            image.src = reader.result as string
            image.onload = function () {
                if (image.width / image.height != 16 / 9) {
                    showError("Image aspect ratio must be 16:9")
                    return
                }
                if (image.width < 1280 || image.height < 720) {
                    showError("Image size must be at least 1280x720 pixels")
                    return
                }
                callback(reader.result as string, fileName)
            }
        }
        reader.readAsDataURL(event.target.files[0])
    }

    resetImageInput(event)
}

function resetImageInput(event: any) {
    event.target.value = null
}

function showError(errorMessage: string) {
    error.value = errorMessage
    if (document) {
        console.log("Showing modal");
        (document.getElementById('error_modal') as HTMLFormElement).showModal();
    }
}
</script>

<template>
    <template v-if="previewData.length === 0">
        <div class="grid grid-cols-auto-fill-300 md:grid-cols-[minmax(300px,_1fr),2fr]">
            <YouTubeThumbnailTeaser @randomize="randomize(); saveStorage();"
                @changeImage="(event) => onChangeImage(event, (imageSrc, fileName) => { buildPreviewFromTeaser(imageSrc, fileName); saveStorage(); })" />
            <div class="hidden md:block relative">
                <img src="/visualisation.png" class="absolute -translate-x-16" />
            </div>
        </div>
    </template>
    <template v-else>
        <youtube-container
            class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
            <template v-for="(preview, index) in previewData">
                <YouTubePreview :imageSrc="preview.imageSrc" :title="preview.title" :channelName="preview.channelName"
                    :duplicateEnabled="previewData.length != maxPreviewCount" :moveLeftEnabled="index != 0"
                    :moveRightEnabled="index != previewData.length - 1" :fileName="preview.fileName"
                    @changeTitle="(title) => { preview.title = title; saveStorage(); }"
                    @changeChannelName="(channelName) => { preview.channelName = channelName; saveStorage(); }"
                    @changeImage="(event) => onChangeImage(event, (imageSrc, fileName) => { preview.imageSrc = imageSrc; preview.fileName = fileName; saveStorage(); })"
                    @deletePreview="deletePreview(index); saveStorage();"
                    @duplicatePreview="duplicatePreview(index); saveStorage();"
                    @moveLeft="moveLeft(index); saveStorage();" @moveRight="moveRight(index); saveStorage();" />
            </template>
            <template v-if="previewData.length != maxPreviewCount">
                <YouTubeThumbnailTeaser @randomize="randomize(); saveStorage();"
                    @changeImage="(event) => onChangeImage(event, (imageSrc, fileName) => { buildPreviewFromTeaser(imageSrc, fileName); saveStorage(); })" />
            </template>
            <template v-else>
                <div class="aspect-video flex flex-col justify-center items-center text-xl">
                    <p>Preview limit reached.</p>
                    <p>Remove previews to add more.</p>
                </div>
            </template>
        </youtube-container>
    </template>

    <Teleport to="body">
        <dialog id="error_modal" class="modal">
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