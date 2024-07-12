<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { fetchPathWithAuth } from '../composables/api'
import { realYouTubeVideos } from '../composables/data'
import { getVideoData } from '../composables/youtube'
import { compressImage } from '../composables/image'
import { getImageSrc } from '../composables/image'
import type { YouTubePreviewData } from '../types/YouTubePreviewData.type'
import YouTubePreview from './YouTubePreview.vue'
import YouTubeThumbnailTeaser from './YouTubeThumbnailTeaser.vue'
import FileDragDrop from './FileDragDrop.vue'
import { CircleX } from 'lucide-vue-next';
import { loadSettings } from '../composables/settings'

const validExtensions = ['jpg', 'jpeg', 'png']

const previewData = ref<YouTubePreviewData[]>([])
const error = ref()
const boardName = ref()
const errorMessage = ref()
const isDragging = ref(false)
const dragSourceIndexRef = ref()
const dragTargetIndexRef = ref()
const isLoading = ref(true)

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
    columnCount: {
        type: String,
        required: false,
    }
})

load()

watch(() => props.boardId, () => {
    load()
});

function defaultTitle() {
    return boardName.value || 'Enter your video title'
}

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
        isLoading.value = false
        return
    }

    isLoading.value = true
    const response = await fetchPathWithAuth('GET', `/user/boards/${props.boardId}`)
    if (response.status === 200) {
        const json = await response.json()
        boardName.value = json.name
        previewData.value = json.previews
    } else if (response.status === 404) {
        errorMessage.value = 'Board not found'
    } else {
        throw new Error(`Invalid response with status ${response.status}`)
    }
    isLoading.value = false
}

function reset() {
    previewData.value.length = 0
    save()
}

async function validateImage(file: any) {
    const fileName = file.name
    if (validExtensions.indexOf(fileName.split('.').pop().toLowerCase()) == -1) {
        showError(`Image must be one of these types: ${validExtensions.join(", ")}`)
        return Promise.reject()
    } else {
        const url = URL.createObjectURL(file)

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

function showError(errorMessage: string) {
    error.value = errorMessage
    if (document) {
        (document.getElementById('youtube_container_error_modal') as HTMLFormElement).showModal();
    }
}

async function onChangeExistingImage(event: any, preview: YouTubePreviewData, finishLoading: () => void) {
    const imageURL = await validateImage(event.target.files[0])
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

async function onChangeTeaserImage(file: any, finishLoading: () => void) {
    const imageURL = await validateImage(file).catch((error) => {
        finishLoading()
        throw error
    })
    if (props.frontEndOnly) {
        const index = previewData.value.length

        previewData.value.splice(index, 0, {
            title: defaultTitle(),
            imageURL: imageURL,
            channelName: defaultChannelName()
        })
    } else {
        const response = await fetch(imageURL)
        const blob = await response.blob()
        const compressedBlob = await compressImage(blob)
        const index_1 = previewData.value.length
        const s3ObjectKey = await uploadThumbnail(compressedBlob, 'jpg')
        previewData.value.splice(index_1, 0, {
            title: defaultTitle(),
            s3ObjectKey: s3ObjectKey,
            channelName: defaultChannelName()
        })
        await save()
    }
    finishLoading()
}

async function onChangeTeaserImages(files: any, updateLoading: () => void, cancelLoading: () => void) {
    const collectedPreviews = [] as YouTubePreviewData[]

    const imageURLs = await Promise.all(Array.from(files).map(async (file: any) => {
        return await validateImage(file).catch((error) => {
            cancelLoading()
            throw error
        })
    }))

    for (let i = 0; i < imageURLs.length; i++) {
        if (props.frontEndOnly) {
            collectedPreviews.push({
                title: defaultTitle(),
                imageURL: imageURLs[i],
                channelName: defaultChannelName()
            })
        } else {
            const response = await fetch(imageURLs[i])
            const blob = await response.blob()
            const compressedBlob = await compressImage(blob)
            const s3ObjectKey = await uploadThumbnail(compressedBlob, 'jpg')
            collectedPreviews.push({
                title: defaultTitle(),
                s3ObjectKey: s3ObjectKey,
                channelName: defaultChannelName()
            })
        }
        updateLoading()
    }

    previewData.value.push(...collectedPreviews)
    if (!props.frontEndOnly) {
        await save()
    }
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

function defaultChannelName() {
    return loadSettings().defaultChannelName || 'Enter your channel name'
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
    const itemToInsert = previewData.value.splice(dragSourceIndex, 1)[0]
    previewData.value.splice(index, 0, itemToInsert);
}

function dragOver(index: number) {
    dragTargetIndexRef.value = index
}

function dragEnd() {
    isDragging.value = false
}

const displayPreviewData = computed(() => {
    if (isDragging.value && dragSourceIndexRef.value !== undefined && dragTargetIndexRef.value !== undefined) {
        const previewDataClone = [...previewData.value];
        const itemToInsert = previewDataClone.splice(dragSourceIndexRef.value, 1)[0]
        previewDataClone.splice(dragTargetIndexRef.value, 0, itemToInsert);
        return previewDataClone
    }
    return previewData.value

})
</script>

<template>
    <template v-if="isLoading">
        <span class="mx-auto loading loading-spinner loading-xl"></span>
    </template>
    <template v-else>
        <h2 class="text-2xl">{{ boardName }}</h2>
        <div v-if="errorMessage" role="alert" class="alert alert-error">
            <CircleX />
            <span>{{ errorMessage }}</span>
        </div>
        <youtube-container v-else
            :class="{ [`xl:grid-cols-3`]: columnCount == '3', [`xl:grid-cols-4`]: columnCount == '4', [`xl:grid-cols-5`]: columnCount == '5', [`xl:grid-cols-6`]: columnCount == '6' }"
            class="grid grid-cols-auto-fill-300 gap-y-[40px] gap-x-[16px] font-medium text-[12px] font-roboto">
            <template v-for="(preview, index) in displayPreviewData">
                <draggable-element draggable="true" @drag="drag" @dragstart="(event: any) => dragStart(event, index)"
                    @dragend="dragEnd" @drop.preventDefault="(event: any) => { drop(event, index); save(); }"
                    @dragover.prevent="dragOver(index)">

                    <YouTubePreview :isGetFromYouTubeEnabled="!frontEndOnly" :imageSrc="getImageSrc(preview)"
                        :title="preview.title" :channelName="preview.channelName"
                        :duplicateEnabled="previewData.length != maxPreviewCount" :moveLeftEnabled="index != 0"
                        :moveRightEnabled="index != previewData.length - 1" :index="index"
                        :isGeneratingPreview="isGeneratingSinglePreview" :isSinglePreviewEnabled="!frontEndOnly"
                        :isHighlighted="isDragging && dragTargetIndexRef === index"
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
                <FileDragDrop v-slot="slotProps"
                    @addImages="(files, updateLoading, cancelLoading) => onChangeTeaserImages(files, updateLoading, cancelLoading)">
                    <YouTubeThumbnailTeaser :isGetFromYouTubeEnabled="!frontEndOnly"
                        :isHighlighted="slotProps.isFileDragging" :isFileUploading="slotProps.isFileUploading"
                        :percentComplete="slotProps.percentComplete" @randomize="randomize(); save();"
                        @changeImage="(event, finishLoading) => onChangeTeaserImage(event.target.files[0], finishLoading)"
                        @getFromYouTube="async (youTubeVideoURL, closeModal, handleError) => { await getFromYouTubeForTeaser(youTubeVideoURL, closeModal, handleError); save(); }" />
                </FileDragDrop>
                <div v-if="previewData.length === 0" class="col-span-2 hidden md:block">
                    <img src="/visualisation.png" class="-translate-x-16" />
                </div>
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