<script setup lang="ts">

import { ref } from 'vue'
import BoardContainer from '../components/BoardContainer.vue'
import ThumbnailGame from '../components/ThumbnailGame.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import { useRoute, useRouter } from "vue-router";
import { getCurrentUser } from 'aws-amplify/auth';
import BoardsDrawer from '../components/BoardsDrawer.vue'

const navBar = ref<InstanceType<typeof NavBar>>()
const route = useRoute()
const router = useRouter()
const boardContainer = ref<InstanceType<typeof BoardContainer>>()
const boardsDrawerComponent = ref()

getCurrentUser()
  .then((user) => {
    if (!route.params.boardId && localStorage.getItem(`selectedBoardId-${user.username}`)) {
      router.push(`/boards/${localStorage.getItem(`selectedBoardId-${user.username}`)}`)
    }
  })
</script>

<template>
  <NavBar ref="navBar" @selectedBoardUpdated="boardContainer?.thumbnailBoard?.load()" />

  <main class="min-h-[calc(100vh-4rem)] mx-auto py-4 px-4 sm:px-8">
    <template v-if="navBar?.isSignedIn">
      <div class="relative min-h-[calc(100vh-4rem)]">
        <div class="absolute right-0">
          <BoardsDrawer @selectedBoardUpdated="$emit('selectedBoardUpdated')" ref="boardsDrawerComponent" />
        </div>
        <template v-if="route.params.boardId">
          <BoardContainer :boardId="route.params.boardId" ref="boardContainer" />
        </template>
        <template v-else>
          <div class="w-2/3">
            Create or select a <a class="link" @click="boardsDrawerComponent.open()">thumbnail board</a> to get
            started.
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <!-- 10rem=(4rem nav bar + 4rem padding + 4rem nav bar / 2) -->
      <div class="min-h-[calc(100vh-10rem)] max-w-screen-xl mx-auto flex items-center">
        <div class="flex flex-wrap gap-12">
          <div class="grid lg:grid-cols-2 gap-12">
            <div class="grow lg:basis-2/5 flex flex-col justify-center gap-4">
              <h1 class="text-2xl sm:text-4xl font-bold line-clamp-2">Compare and share YouTube thumbnail
                ideas</h1>
              <h2 class="text-lg sm:text-2xl line-clamp-3">View video ideas side-by-side, get feedback, & pick a
                winner to make your next video pop.</h2>
              <div class="flex gap-2 mt-1">
                <RouterLink to="/sign-in" class="lg:grow">
                  <button class="btn btn-accent sm:btn-lg sm:min-w-40 lg:w-1/2">Sign up for free</button>
                </RouterLink>
              </div>
            </div>
            <ThumbnailGame />
          </div>
        </div>
      </div>
    </template>
  </main>
  <FooterBar />
</template>