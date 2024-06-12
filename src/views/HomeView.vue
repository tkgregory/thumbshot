<script setup lang="ts">

import { ref } from 'vue'
import BoardContainer from '../components/BoardContainer.vue'
import Instructions from '../components/Instructions.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import { useRoute } from "vue-router";

const navBar = ref()
const route = useRoute()
const boardContainer = ref<InstanceType<typeof BoardContainer>>()
</script>

<template>
  <NavBar ref="navBar" @selectedBoardUpdated="boardContainer?.thumbnailBoard?.loadBoard()" />

  <main class="max-w-screen-xl min-h-screen mx-auto py-4 px-8">
    <template v-if="navBar?.isSignedIn">
      <template v-if="route.params.boardId">
        <BoardContainer :boardId="route.params.boardId" ref="boardContainer" />
      </template>
      <template v-else>
        Create or select a thumbnail board to get started.
      </template>
    </template>
    <template v-else>
      Sign in to get started.
    </template>
  </main>

  <FooterBar />
  <Instructions />
</template>