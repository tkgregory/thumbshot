<script setup lang="ts">

import { ref } from 'vue'
import BoardContainer from '../components/BoardContainer.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import { useRoute, useRouter } from "vue-router";
import { getCurrentUser } from 'aws-amplify/auth';

const navBar = ref<InstanceType<typeof NavBar>>()
const route = useRoute()
const router = useRouter()

const boardContainer = ref<InstanceType<typeof BoardContainer>>()

getCurrentUser()
  .then((user) => {
    if (!route.params.boardId && localStorage.getItem(`selectedBoardId-${user.username}`)) {
      router.push(`/boards/${localStorage.getItem(`selectedBoardId-${user.username}`)}`)
    }
  })
</script>

<template>
  <NavBar ref="navBar" @selectedBoardUpdated="boardContainer?.thumbnailBoard?.load()" />

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
      <!-- 10rem=(4rem nav bar + 4rem padding + 4rem nav bar / 2) -->
      <div class="min-h-[calc(100vh-10rem)] flex items-center">
        <div class="flex flex-wrap gap-12">
          <div class="grow lg:basis-2/5 flex flex-col gap-4">
            <h1 class="text-2xl sm:text-4xl font-bold line-clamp-2 text-accent">Compare and share YouTube thumbnail
              ideas</h1>
            <h2 class="text-lg sm:text-2xl line-clamp-3">View video ideas side-by-side, get feedback, & pick a
              winner to make your next video pop.</h2>
            <div class="flex gap-2 mt-1">
              <RouterLink to="/sign-in" class="lg:grow">
                <button class="btn btn-accent sm:btn-lg sm:min-w-40 lg:w-full">Sign up</button>
              </RouterLink>
              <RouterLink to="/trial" class="lg:grow">
                <button class="btn btn-primary sm:btn-lg sm:min-w-40 lg:w-full">Try for free</button>
              </RouterLink>
            </div>
          </div>
          <div class="lg:basis-1/2 flex justify-center">
            <img src="/plane-guy.png" class="max-w-3xl w-full object-contain" />
          </div>
        </div>
      </div>
    </template>
  </main>

  <FooterBar />
</template>