<script setup lang="ts">
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { ref } from 'vue'
import { Hub } from 'aws-amplify/utils';
import { useRouter } from "vue-router";
import { CircleUserRound } from 'lucide-vue-next';
import Settings from './Settings.vue'

const isSignedIn = ref(false)
const settings = ref()
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
        <div class="flex-1">
            <a class="flex gap-2 text-xl" href="/">
                <img src="/logo.png" alt="logo" width="30" height="30" />
                thumbshot.io
            </a>
        </div>
        <div class="flex-none gap-2">
            <div v-if="isSignedIn" class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <CircleUserRound :size="36" />
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                    <li><a @click="settings.show()">Settings</a></li>
                    <li><a @click="signOut(); checkSignInStatus(); router.push('/');">Sign out</a></li>
                </ul>
            </div>
            <ul v-else class="menu menu-horizontal px-1">
                <li>
                    <RouterLink to="/sign-in">Sign in</RouterLink>
                </li>
            </ul>
        </div>

    </div>
    <Settings ref="settings" />
</template>