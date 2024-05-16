<script setup lang="ts">
import ScreenshotYouTubeContainer from '../components/SreenshotYouTubeContainer.vue'
</script>

<template>
    <main class="max-w-screen-xl min-h-screen mx-auto px-8">
        <screenshot-container class="block p-[16px]">
            <ScreenshotYouTubeContainer />

            <div class="flex items-center justify-start gap-1 mt-8">
                <img src="/logo.png" alt="logo" width="15" height="15" class="object-fill" />
                <span class="text-sm">thumbshot.io</span>
            </div>
        </screenshot-container>
    </main>
</template>
