<script setup lang="ts">
import BoardsDrawer from '../components/BoardsDrawer.vue'
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { ref } from 'vue'
import { Hub } from 'aws-amplify/utils';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

const isSignedIn = ref(false)
defineExpose({ isSignedIn })
defineEmits(['selectedBoardUpdated'])

Amplify.configure(awsconfig);
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
        <div class="navbar-end flex gap-4">
            <BoardsDrawer ref="boardsDrawer" @selectedBoardUpdated="$emit('selectedBoardUpdated')" />

            <div v-if="isSignedIn" class="btn" @click="signOut(); checkSignInStatus();">Sign out</div>
            <RouterLink v-else to="/sign-in" class="btn">Sign in</RouterLink>
        </div>
    </div>
</template>