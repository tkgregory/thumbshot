<script setup lang="ts">
import BoardsDrawer from '../components/BoardsDrawer.vue'
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { ref } from 'vue'
import { Hub } from 'aws-amplify/utils';
import { useRouter } from "vue-router";

const isSignedIn = ref(false)
defineExpose({ isSignedIn })
defineEmits(['selectedBoardUpdated'])

const router = useRouter()
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
            <a class="btn btn-ghost text-xl" href="/"> <img src="/logo.png" alt="logo" width="30" height="30" />
                thumbshot.io</a>
        </div>
        <div class="navbar-end flex gap-4">
            <BoardsDrawer v-if="isSignedIn" ref="boardsDrawer" @selectedBoardUpdated="$emit('selectedBoardUpdated')" />

            <div v-if="isSignedIn" class="btn" @click="signOut(); checkSignInStatus(); router.push('/');">Sign out</div>
            <RouterLink v-else to="/sign-in" class="btn">Sign in</RouterLink>
        </div>
    </div>
</template>