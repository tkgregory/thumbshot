<script setup lang="ts">
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { ref, onMounted } from 'vue'
import Container from '../components/Container.vue'

let showInstructions = ref(localStorage.getItem('showInstructions') !== 'false')
onMounted(() => {
  if (showInstructions.value) {
    (document.getElementById('instructions_modal') as HTMLFormElement).showModal()
  }
})

function hideInstructions() {
  (document.getElementById('instructions_modal') as HTMLFormElement).close()
  localStorage.setItem('showInstructions', 'false')
}

import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

const isSignedIn = ref(false)

checkSignInStatus()
function checkSignInStatus() {
  getCurrentUser()
    .then(() => {
      isSignedIn.value = true
    })
    .catch(() => {
      isSignedIn.value = false
    })
}

Hub.listen('auth', (data) => {
  console.log('auth event : ', data.payload.event);
  switch (data.payload.event) {
    case 'signedOut':
      checkSignInStatus()
      break
  }
})
</script>

<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <a class="btn btn-ghost text-xl"> <img src="/logo.png" alt="logo" width="30" height="30" /> thumbshot.io</a>
    </div>
    <div class="navbar-end">
      <div v-if="isSignedIn" class="btn" @click="signOut(); checkSignInStatus();">Sign out</div>
      <RouterLink v-else to="/sign-in" class="btn">Sign in</RouterLink>
    </div>
  </div>

  <main class="max-w-screen-xl min-h-screen mx-auto py-4 px-8">
    <Container />
  </main>
  <footer class="flex flex-col max-w-screen-xl mx-auto items-center gap-4 mt-8 py-16 px-8 text-sm">
    <div>Created with ❤️ by <a href="mailto:tom@tomgregory.com">Tom Gregory</a>.</div>
    <RouterLink to="/terms-and-conditions">
      Terms and conditions
    </RouterLink>
  </footer>
  <dialog v-if="showInstructions" id="instructions_modal" class="modal">
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