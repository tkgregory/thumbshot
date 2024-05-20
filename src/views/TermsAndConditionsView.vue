<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
</script>

<template>
    <main class="max-w-screen-md min-h-screen mx-auto px-8 pt-8">
        <RouterLink to="/">
            <button class="btn btn-neutral">
                <ArrowLeft />
                Back
            </button>
        </RouterLink>
        <h2 class="text-4xl py-8">Terms and conditions</h2>
        <ol class="p-4 list-decimal text-lg">
            <li>This site does not use cookies</li>
            <li>Any thumbnails uploaded to thumbshot.io are deleted after 7 days</li>
            <li>thumbshot.io is owned and run by Tom Gregory Limited</li>
        </ol>
    </main>
</template>
