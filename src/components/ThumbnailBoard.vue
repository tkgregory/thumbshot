<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchPathWithAuth } from '../composables/api'
import { realYouTubeVideos } from '../composables/data'
import { getVideoData } from '../composables/youtube'
import { compressImage } from '../composables/image'
import { getImageSrc } from '../composables/image'
import type { YouTubePreviewData } from '../types/YouTubePreviewData.type'
import YouTubePreview from './YouTubePreview.vue'
import YouTubeThumbnailTeaser from './YouTubeThumbnailTeaser.vue'
import { CircleX } from 'lucide-vue-next';

const validExtensions = ['jpg', 'jpeg', 'png']

const previewData = ref<YouTubePreviewData[]>([])
const error = ref()
const boardName = ref()
const defaultTitle = 'Enter your video title'
const defaultChannelName = 'Enter your channel name'
const errorMessage = ref()
const isDragging = ref(false)
const dragSourceIndexRef = ref()

defineExpose({ reset, previewData, load })
defineEmits(['generateSinglePreview'])
const props = defineProps({
    boardId: {
        type: String,
        required: false
    },
    frontEndOnly: {
        type: Boolean,
    },
    isGeneratingSinglePreview: {
        type: Boolean,
    },
    maxPreviewCount: {
        type: Number,
        default: 9
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
        imageURL: `https://i.ytimg.com/vi/${realYouTubeVideos[random].videoId}/hq720.jpg`,
        channelName: realYouTubeVideos[random].channelName
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

async function uploadThumbnail(imageBlob: Blob, fileExtension: string) {
    const preSignResponse = await preSign(fileExtension)
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set("Content-Type", 'multipart/form-data')
    await fetch(preSignResponse.presignedUploadURL, {
        method: 'PUT',
        headers: requestHeaders,
        body: imageBlob
    })

    return preSignResponse.objectKey;
}

async function save() {
    if (props.frontEndOnly) {
        return
    }

    for (const preview of previewData.value) {
        if (preview.s3ObjectKey !== undefined && preview.imageURL !== undefined) {
            throw Error('Cannot save both s3ObjectKey and imageURL to the server.')
        }
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
    if (props.frontEndOnly) {
        return
    }

    fetchPathWithAuth('GET', `/user/boards/${props.boardId}`).then((response) => {
        if (response.status === 404) {
            errorMessage.value = 'Board not found'
        }
        else if (response.status !== 200) {
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

async function validateImage(event: any) {
    if (!event.target.files[0]) {
        return Promise.reject()
    }

    const fileName = event.target.files[0].name
    if (validExtensions.indexOf(fileName.split('.').pop().toLowerCase()) == -1) {
        showError(`Image must be one of these types: ${validExtensions.join(", ")}`)
        return Promise.reject()
    } else {
        const url = URL.createObjectURL(event.target.files[0])
        resetImageInput(event)

        return getImage(url).then((image) => {
            if (image.width / image.height != 16 / 9) {
                showError("Image aspect ratio must be 16:9")
                return Promise.reject()
            }
            if (image.width < 1280 || image.height < 720) {
                showError("Image size must be at least 1280x720 pixels")
                return Promise.reject()
            }

            return url
        })
    }
}

function getImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = url
    })
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

async function onChangeExistingImage(event: any, preview: YouTubePreviewData, finishLoading: () => void) {
    const imageURL = await validateImage(event)
    if (props.frontEndOnly) {
        preview.imageURL = imageURL;
    } else {
        const response = await fetch(imageURL)
        const blob = await response.blob()
        const compressedBlob = await compressImage(blob)
        const s3ObjectKey = await uploadThumbnail(compressedBlob, 'jpg')
        preview.s3ObjectKey = s3ObjectKey
        preview.imageURL = undefined
        await save()
    }

    finishLoading()
}

async function onChangeTeaserImage(event: any, finishLoading: () => void) {
    const imageURL = await validateImage(event)
    if (props.frontEndOnly) {
        const index = previewData.value.length

        previewData.value.splice(index, 0, {
            title: defaultTitle,
            imageURL: imageURL,
            channelName: defaultChannelName
        })
        return
    }
    const response = await fetch(imageURL)
    const blob = await response.blob()
    const compressedBlob = await compressImage(blob)
    const index_1 = previewData.value.length
    const s3ObjectKey = await uploadThumbnail(compressedBlob, 'jpg')
    previewData.value.splice(index_1, 0, {
        title: defaultTitle,
        s3ObjectKey: s3ObjectKey,
        channelName: defaultChannelName
    })
    await save()
    finishLoading()
}

async function getFromYouTubeForTeaser(youTubeVideoURL: any, closeModal: Function, handleError: Function) {
    let videoData
    try {
        videoData = await getVideoData(youTubeVideoURL)
    } catch (error: any) {
        handleError(error.message)
        return
    }

    previewData.value.splice(previewData.value.length, 0, videoData)
    closeModal()
}

async function getFromYouTubeForPreview(preview: YouTubePreviewData, youTubeVideoURL: any, closeModal: Function, handleError: Function) {
    let videoData
    try {
        videoData = await getVideoData(youTubeVideoURL)
    } catch (error: any) {
        handleError(error.message)
        return
    }

    preview.title = videoData.title
    preview.channelName = videoData.channelName
    preview.imageURL = videoData.imageURL
    preview.s3ObjectKey = undefined
    closeModal()
}

function drag() {
    isDragging.value = true
}

function dragStart(event: any, index: number) {
    if (event.dataTransfer) {
        event.dataTransfer.setData("dragSourceIndex", index.toString());
        dragSourceIndexRef.value = index
    }
}

function drop(event: any, index: number) {
    const dragSourceIndex = event.dataTransfer.getData("dragSourceIndex");

    if (dragSourceIndex === undefined || dragSourceIndex === "") {
        throw new Error('dragSourceIndex is undefined')
    }
    const dragTargetIndex = calculateTargetIndex(event, parseInt(dragSourceIndex), index)
    const itemToInsert = previewData.value.splice(dragSourceIndex, 1)[0]
    previewData.value.splice(dragTargetIndex, 0, itemToInsert);
}

function calculateTargetIndex(event: any, dragSourceIndex: number, dragTargetIndex: number) {
    var boundingRectangle = event.target.getBoundingClientRect();
    const xPosition = event.pageX - boundingRectangle.left
    const left = xPosition < boundingRectangle.width / 2
    if (left && dragSourceIndex < dragTargetIndex) {
        return dragTargetIndex - 1
    } else if (!left && dragSourceIndex > dragTargetIndex) {
        return dragTargetIndex + 1
    }

    return dragTargetIndex
}

function dragEnd() {
    isDragging.value = false
}

</script>

<template>
    <h2 class="text-2xl">{{ boardName }}</h2>
    <div v-if="errorMessage" role="alert" class="alert alert-error">
        <CircleX />
        <span>{{ errorMessage }}</span>
    </div>
    <template v-else-if="previewData.length === 0">
        <div class="grid grid-cols-auto-fill-300 md:grid-cols-[minmax(300px,_1fr),2fr]">
            <YouTubeThumbnailTeaser :isGetFromYouTubeEnabled="!frontEndOnly" @randomize="randomize(); save();"
                @changeImage="(event, finishLoading) => onChangeTeaserImage(event, finishLoading)"
                @getFromYouTube="(youTubeVideoURL, closeModal, handleError) => getFromYouTubeForTeaser(youTubeVideoURL, closeModal, handleError)" />
            <div class="hidden md:block relative">
                <img src="/visualisation.png" class="absolute -translate-x-16" />
            </div>
        </div>
    </template>
    <template v-else>
        <youtube-container
            class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
            <template v-for="(preview, index) in previewData">
                <draggable-element draggable="true" @drag="drag" @dragstart="(event: any) => dragStart(event, index)"
                    @dragend="dragEnd" @drop.preventDefault="(event: any) => { drop(event, index); save(); }"
                    @dragover.prevent>
                    <YouTubePreview :isGetFromYouTubeEnabled="!frontEndOnly" :imageSrc="getImageSrc(preview)"
                        :title="preview.title" :channelName="preview.channelName"
                        :duplicateEnabled="previewData.length != maxPreviewCount" :moveLeftEnabled="index != 0"
                        :moveRightEnabled="index != previewData.length - 1" :index="index"
                        :isGeneratingPreview="isGeneratingSinglePreview" :isSinglePreviewEnabled="!frontEndOnly"
                        :isHighlighted="isDragging && dragSourceIndexRef === index"
                        @changeTitle="(title) => { preview.title = title; save(); }"
                        @changeChannelName="(channelName) => { preview.channelName = channelName; save(); }"
                        @changeImage="(event, finishLoading) => onChangeExistingImage(event, preview, finishLoading)"
                        @deletePreview="deletePreview(index); save();"
                        @duplicatePreview="duplicatePreview(index); save();" @moveLeft="moveLeft(index); save();"
                        @moveRight="moveRight(index); save();" @generatePreview="$emit('generateSinglePreview', index);"
                        @getFromYouTube="async (youTubeVideoURL, closeModal, handleError) => { await getFromYouTubeForPreview(preview, youTubeVideoURL, closeModal, handleError); save(); }" />
                </draggable-element>
            </template>
            <template v-if="previewData.length < maxPreviewCount">
                <YouTubeThumbnailTeaser :isGetFromYouTubeEnabled="!frontEndOnly" @randomize="randomize(); save();"
                    @changeImage="(event, finishLoading) => onChangeTeaserImage(event, finishLoading)"
                    @getFromYouTube="async (youTubeVideoURL, closeModal, handleError) => { await getFromYouTubeForTeaser(youTubeVideoURL, closeModal, handleError); save(); }" />
            </template>
            <template v-else>
                <div class="aspect-video flex flex-col justify-center items-center text-xl">
                    <div class="w-full">
                        <template v-if="$slots.previewLimit">
                            <slot name="previewLimit" />
                        </template>
                        <template v-else>
                            <p>Preview limit reached.</p>
                            <p>Remove previews to add up.</p>
                        </template>
                    </div>
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