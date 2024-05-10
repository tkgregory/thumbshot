<script setup lang="ts">
import { onMounted } from 'vue'
import Container from '../components/Container.vue'

onMounted(() => {
  if (!localStorage.getItem('hideInstructions')) {
    (document.getElementById('instructions_modal') as HTMLFormElement).showModal()
  }
})

function hideInstructions() {
  (document.getElementById('instructions_modal') as HTMLFormElement).close()
  localStorage.setItem('hideInstructions', 'true')
}
</script>

<template>
  <header class="flex max-w-screen-xl mx-auto items-center gap-2 py-4 px-8">
    <img src="/logo.png" alt="logo" width="30" height="30" />
    <span class="text-2xl">ThumbShot</span>
  </header>
  <main class="max-w-screen-xl min-h-screen mx-auto py-4 px-8">
    <Container />
  </main>
  <footer class="flex flex-col max-w-screen-xl mx-auto items-center gap-4 mt-8 py-16 px-8 text-sm">
    <div>Created with ❤️ by <a href="mailto:tom@tomgregory.com">Tom Gregory</a>.</div>
  </footer>
  <dialog id="instructions_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Compare and share YouTube title & thumbnail ideas!</h3>
      <ol class="p-4 list-decimal text-lg">
        <li>Add your next video's title & thumbnail variations</li>
        <li>Screenshot the best ones to get feedback from friends</li>
        <li>Pick the winner that'll make your video pop</li>
      </ol>
      <div class="modal-action justify-center">
        <form method="dialog">
          <button class="btn btn-primary btn-wide">Compare My Thumbnails</button>
        </form>
      </div>
      <div class="flex justify-center mt-2">
        <button class="btn btn-ghost btn-wide text-xs" @click="hideInstructions">Don't show again</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
