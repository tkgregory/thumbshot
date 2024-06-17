<script setup lang="ts">
import ScreenshotThumbnailBoard from '../components/ScreenshotThumbnailBoard.vue'
import { useRoute } from "vue-router";

const route = useRoute()

const boardId = route.params.boardId as string
let boardIndex: number
if (route.params.boardIndex != null) {
    boardIndex = parseInt(route.params.boardIndex as string)
}
</script>

<template>
    <main class="max-w-screen-xl min-h-screen mx-auto px-8">
        <screenshot-container class="block p-[16px]">
            <div class="flex flex-col gap-8">
                <ScreenshotThumbnailBoard :boardId="boardId" :boardIndex="boardIndex" />
            </div>

            <div class="flex items-center justify-start gap-1 mt-8">
                <img src="/logo.png" alt="logo" width="15" height="15" class="object-fill" />
                <span class="text-sm">thumbshot.io</span>
            </div>
        </screenshot-container>
    </main>
</template>
