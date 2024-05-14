<script setup lang="ts">
import YouTubeContainer from '../components/YouTubeContainer.vue'
</script>

<template>
    <main class="max-w-screen-xl min-h-screen mx-auto px-8">
        <screenshot-container class="block p-[16px]">
            <YouTubeContainer />

            <div class="flex items-center justify-start gap-2 mt-8">
                <img src="/logo.png" alt="logo" width="20" height="20" class="object-fill" />
                <span class="text-xl">thumbshot.io</span>
            </div>
        </screenshot-container>
    </main>
</template>
