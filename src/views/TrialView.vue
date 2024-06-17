<script setup lang="ts">

import Instructions from '../components/Instructions.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import ThumbnailBoard from '../components/ThumbnailBoard.vue'
</script>

<template>
  <NavBar ref="navBar" />

  <main class="max-w-screen-xl min-h-[calc(100vh-4rem)] mx-auto py-4 px-8">
    <ThumbnailBoard :isTrial="true" />
  </main>

  <FooterBar />
  <Instructions />
</template>