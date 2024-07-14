<script setup lang="ts">

import { ref, computed } from 'vue'
import BoardContainer from '../components/BoardContainer.vue'
import FooterBar from '../components/FooterBar.vue'
import NavBar from '../components/NavBar.vue'
import { useRoute, useRouter } from "vue-router";
import { getCurrentUser } from 'aws-amplify/auth';
import BoardsDrawer from '../components/BoardsDrawer.vue'
import YouTubePreview from '../components/YouTubePreview.vue'
import { validateImage } from '../composables/image'

const navBar = ref<InstanceType<typeof NavBar>>()
const route = useRoute()
const router = useRouter()

const boardContainer = ref<InstanceType<typeof BoardContainer>>()
const boardsDrawerComponent = ref()

const title = ref()
const channelTitle = ref()
const thumbnailURL = ref()
const error = ref()
const isSetTitle = ref(false)
const isSetChannelTitle = ref(false)
const isSetThumbnailURL = ref(false)
const isGameStarted = ref(false)

getCurrentUser()
  .then((user) => {
    if (!route.params.boardId && localStorage.getItem(`selectedBoardId-${user.username}`)) {
      router.push(`/boards/${localStorage.getItem(`selectedBoardId-${user.username}`)}`)
    }
  })

random()
async function random() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/youtube/videos`)
  if (response.status !== 200) {
    throw new Error(`Invalid response with status ${response.status}`)
  }
  const json = await response.json()

  randomise(json, 2)
}

async function randomise(json: any, index: number) {
  title.value = json.items[index].snippet.title
  channelTitle.value = json.items[index].snippet.channelTitle
  thumbnailURL.value = json.items[index].snippet.thumbnails.maxres.url

  const timeout = 2000
  if (index < 4 && index + 1 < json.items.length) {
    setTimeout(() => { randomise(json, index + 1) }, timeout)
  } else {
    setTimeout(() => {
      title.value = 'Enter your video title'
      channelTitle.value = 'Enter your channel name'
      thumbnailURL.value = undefined
      isGameStarted.value = true
    }, timeout);
  }
}

async function onChangeImage(file: any, finishLoading: () => void) {
  try {
    thumbnailURL.value = await validateImage(file)
  } catch (error: any) {
    showError(error.message)
  }
  isSetThumbnailURL.value = true
  finishLoading()
}

function showError(errorMessage: string) {
  error.value = errorMessage
  if (document) {
    (document.getElementById('youtube_container_home_error_modal') as HTMLFormElement).showModal();
  }
}

const progress = computed(() => {
  return (isSetTitle.value ? 1 : 0) + (isSetChannelTitle.value ? 1 : 0) + (isSetThumbnailURL.value ? 1 : 0)
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
            <div v-if="title != undefined" class="mockup-browser bg-base-300 w-full">
              <div class="mockup-browser-toolbar">
                <div class="input">youtube.com</div>
              </div>
              <div class="bg-base-200 flex flex-col justify-center px-16 py-8 gap-8">
                <YouTubePreview :isGetFromYouTubeEnabled="false" :title="title" :channelName="channelTitle"
                  :imageSrc="thumbnailURL" :index="0" :isHoverControlsEnabled="false"
                  @changeTitle="(newTitle) => { title = newTitle; isSetTitle = true; }"
                  @changeChannelName="(newChannelName) => { channelTitle = newChannelName; isSetChannelTitle = true; }"
                  @changeImage="(file, cancelLoading) => { onChangeImage(file, cancelLoading); }" />
                <progress v-if="isGameStarted" class="progress progress-primary w-full" :value="progress" max="3"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
  <FooterBar />
  <Teleport to="body">
    <dialog id="youtube_container_home_error_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Ooops</h3>
        <p>{{ error }}</p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </Teleport>
</template>