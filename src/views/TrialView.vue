<script setup lang="ts">

import Instructions from '../components/Instructions.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import ThumbnailBoard from '../components/ThumbnailBoard.vue'
import { accountLimits } from '../composables/data'
</script>

<template>
  <NavBar ref="navBar" />

  <main class="max-w-screen-xl min-h-[calc(100vh-4rem)] mx-auto py-4 px-8">
    <ThumbnailBoard :frontEndOnly="true" :maxPreviewCount="accountLimits.trial.previewLimit">
      <template #previewLimit>
        <p>You reached the {{ accountLimits.trial.previewLimit }} thumbnail limit.</p>
        <p>Create a <RouterLink to="/sign-in" class="link-primary">free account</RouterLink> to add more.</p>
      </template>
    </ThumbnailBoard>
  </main>

  <FooterBar />
  <Instructions />
</template>