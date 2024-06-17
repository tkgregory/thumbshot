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

  <main class="max-w-screen-xl min-h-[calc(100vh-4rem)] mx-auto py-4 px-8">
    <template v-if="navBar?.isSignedIn">
      <div class="min-h-[calc(100vh-4rem)]">
        <template v-if="route.params.boardId">
          <BoardContainer :boardId="route.params.boardId" ref="boardContainer" />
        </template>
        <template v-else>
          Create or select a thumbnail board to get started.
        </template>
      </div>
    </template>
    <template v-else>
      <div class="min-h-[calc(100vh-8rem)] flex flex-col gap-6 justify-center items-center">
        <h1 class="text-4xl">Compare and share YouTube thumbnail ideas</h1>
        <div class="flex gap-2">
          <RouterLink to="/sign-in">
            <button class="btn btn-accent lg:btn-lg lg:min-w-40">Sign up</button>
          </RouterLink>
          <button class="btn btn-primary lg:btn-lg lg:min-w-40">Try it for free</button>
        </div>
      </div>
    </template>
  </main>

  <FooterBar />
  <Instructions />
</template>