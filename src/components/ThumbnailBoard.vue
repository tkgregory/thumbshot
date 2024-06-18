<script setup lang="ts">
import { fetchPathWithAuth } from '../composables/api'
import { realYouTubeVideos } from '../composables/data'
import YouTubePreview from './YouTubePreview.vue'
import YouTubeThumbnailTeaser from './YouTubeThumbnailTeaser.vue'
import { ref, watch } from 'vue'

type YouTubePreview = {
    title: string;
    imageSrc: string;
    fileName: string;
    channelName: string;
}

const validExtensions = ['jpg', 'jpeg', 'png']
const previewData = ref<YouTubePreview[]>([])
const maxPreviewCount = ref(9)
const error = ref()
const boardName = ref()

defineExpose({ reset, previewData, load })
defineEmits(['generateSinglePreview'])
const props = defineProps({
    boardId: {
        type: String,
        required: false
    },
    isTrial: {
        type: Boolean,
    },
    isGeneratingSinglePreview: {
        type: Boolean,
    },
})

load()

watch(() => props.boardId, () => {
    load()
});

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

async function buildPreviewFromTeaser(imageSrc: string, fileName: string) {
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

async function preSign(fileExtension: string) {
    const body = {
        fileExtension: fileExtension
    }
    return fetchPathWithAuth('POST', '/presigned-upload-url', body).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    })
}

async function uploadThumbnail(imageData: string, fileName: string) {
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    if (!fileExtension || validExtensions.indexOf(fileExtension) == -1) {
        throw new Error('Invalid file extension')
    }

    const preSignResponse = await preSign(fileExtension)
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", 'multipart/form-data')
    const blob = await fetch(imageData).then((r) => r.blob());
    await fetch(preSignResponse.presignedUploadURL, {
        method: 'PUT',
        headers: requestHeaders,
        body: blob
    })

    return preSignResponse.objectKey;
}

async function save() {
    if (props.isTrial) {
        return
    }

    const body = {
        name: boardName.value,
        previews: previewData.value,
    }

    await fetchPathWithAuth('PUT', `/user/boards/${props.boardId}`, body).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
    })
}

async function load() {
    if (props.isTrial) {
        return
    }

    fetchPathWithAuth('GET', `/user/boards/${props.boardId}`).then((response) => {
        if (response.status !== 200) {
            throw new Error(`Invalid response with status ${response.status}`)
        }
        return response.json()
    }).then((json) => {
        boardName.value = json.name
        previewData.value = json.previews
    })
}

function reset() {
    previewData.value.length = 0
    save()
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
        (document.getElementById('youtube_container_error_modal') as HTMLFormElement).showModal();
    }
}

function onChangeExistingImage(event: any, preview: YouTubePreview) {
    onChangeImage(event, async (imageSrc, fileName) => {
        if (props.isTrial) {
            preview.imageSrc = imageSrc;
            preview.fileName = fileName;
            return
        }

        preview.imageSrc = await uploadThumbnail(imageSrc, fileName);
        preview.fileName = fileName;
        save();
    })
}

function onChangeTeaserImage(event: any) {
    onChangeImage(event, async (imageSrc, fileName) => {
        if (props.isTrial) {
            buildPreviewFromTeaser(imageSrc, fileName);
            return
        }

        const objectKey = await uploadThumbnail(imageSrc, fileName);
        buildPreviewFromTeaser(objectKey, fileName);
        save();
    })
}
</script>

<template>
    <h2 class="text-2xl">{{ boardName }}</h2>
    <template v-if="previewData.length === 0">
        <div class="grid grid-cols-auto-fill-300 md:grid-cols-[minmax(300px,_1fr),2fr]">
            <YouTubeThumbnailTeaser @randomize="randomize(); save();"
                @changeImage="event => onChangeTeaserImage(event)" />
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
                    :moveRightEnabled="index != previewData.length - 1" :fileName="preview.fileName" :index="index"
                    :isGeneratingPreview="isGeneratingSinglePreview" :isSinglePreviewEnabled="!isTrial"
                    @changeTitle="(title) => { preview.title = title; save(); }"
                    @changeChannelName="(channelName) => { preview.channelName = channelName; save(); }"
                    @changeImage="(event) => onChangeExistingImage(event, preview)"
                    @deletePreview="deletePreview(index); save();" @duplicatePreview="duplicatePreview(index); save();"
                    @moveLeft="moveLeft(index); save();" @moveRight="moveRight(index); save();"
                    @generatePreview="$emit('generateSinglePreview', index);" />
            </template>
            <template v-if="previewData.length != maxPreviewCount">
                <YouTubeThumbnailTeaser @randomize="randomize(); save();"
                    @changeImage="event => onChangeTeaserImage(event)" />
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
        <dialog id="youtube_container_error_modal" class="modal">
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