<script setup lang="ts">
import { Authenticator } from "@aws-amplify/ui-vue";
import { Hub } from 'aws-amplify/utils';
import { useRouter } from 'vue-router'
import "@aws-amplify/ui-vue/styles.css";

const router = useRouter()
Hub.listen('auth', (data) => {
    switch (data.payload.event) {
        case 'signedIn':
            router.push('/')
            break
    }
})
</script>

<template>
    <div class="flex justify-center items-center h-svh">
        <authenticator>
            <template v-slot="{ user }">
                You're logged in as: {{ user.username }}
            </template>
        </authenticator>
    </div>
</template>

<style>
:root {
    /* copied from Amplify docs */
    --amplify-colors-red-10: hsl(0, 100%, 15%);
    --amplify-colors-red-20: hsl(0, 100%, 20%);
    --amplify-colors-red-40: hsl(0, 95%, 30%);
    --amplify-colors-red-80: hsl(0, 75%, 75%);
    --amplify-colors-red-90: hsl(0, 75%, 85%);
    --amplify-colors-red-100: hsl(0, 75%, 95%);
    --amplify-colors-orange-10: hsl(30, 100%, 15%);
    --amplify-colors-orange-20: hsl(30, 100%, 20%);
    --amplify-colors-orange-40: hsl(30, 95%, 30%);
    --amplify-colors-orange-80: hsl(30, 75%, 75%);
    --amplify-colors-orange-90: hsl(30, 75%, 85%);
    --amplify-colors-orange-100: hsl(30, 75%, 95%);
    --amplify-colors-yellow-10: hsl(60, 100%, 15%);
    --amplify-colors-yellow-20: hsl(60, 100%, 20%);
    --amplify-colors-yellow-40: hsl(60, 95%, 30%);
    --amplify-colors-yellow-80: hsl(60, 75%, 75%);
    --amplify-colors-yellow-90: hsl(60, 75%, 85%);
    --amplify-colors-yellow-100: hsl(60, 75%, 95%);
    --amplify-colors-green-10: hsl(130, 22%, 23%);
    --amplify-colors-green-20: hsl(130, 27%, 29%);
    --amplify-colors-green-40: hsl(130, 33%, 37%);
    --amplify-colors-green-80: hsl(130, 44%, 63%);
    --amplify-colors-green-90: hsl(130, 60%, 90%);
    --amplify-colors-green-100: hsl(130, 60%, 95%);
    --amplify-colors-teal-10: hsl(190, 100%, 15%);
    --amplify-colors-teal-20: hsl(190, 100%, 20%);
    --amplify-colors-teal-40: hsl(190, 95%, 30%);
    --amplify-colors-teal-80: hsl(190, 70%, 70%);
    --amplify-colors-teal-90: hsl(190, 75%, 85%);
    --amplify-colors-teal-100: hsl(190, 75%, 95%);
    --amplify-colors-blue-10: hsl(220, 100%, 15%);
    --amplify-colors-blue-20: hsl(220, 100%, 20%);
    --amplify-colors-blue-40: hsl(220, 95%, 30%);
    --amplify-colors-blue-80: hsl(220, 70%, 70%);
    --amplify-colors-blue-90: hsl(220, 85%, 85%);
    --amplify-colors-blue-100: hsl(220, 95%, 95%);
    --amplify-colors-purple-10: hsl(300, 100%, 15%);
    --amplify-colors-purple-20: hsl(300, 100%, 20%);
    --amplify-colors-purple-40: hsl(300, 95%, 30%);
    --amplify-colors-purple-80: hsl(300, 70%, 70%);
    --amplify-colors-purple-90: hsl(300, 85%, 85%);
    --amplify-colors-purple-100: hsl(300, 95%, 95%);
    --amplify-colors-pink-10: hsl(340, 100%, 15%);
    --amplify-colors-pink-20: hsl(340, 100%, 20%);
    --amplify-colors-pink-40: hsl(340, 95%, 30%);
    --amplify-colors-pink-80: hsl(340, 70%, 70%);
    --amplify-colors-pink-90: hsl(340, 90%, 85%);
    --amplify-colors-pink-100: hsl(340, 95%, 95%);
    --amplify-colors-neutral-10: hsl(210, 50%, 10%);
    --amplify-colors-neutral-20: hsl(210, 25%, 25%);
    --amplify-colors-neutral-40: hsl(210, 10%, 40%);
    --amplify-colors-neutral-80: hsl(210, 5%, 87%);
    --amplify-colors-neutral-90: hsl(210, 5%, 94%);
    --amplify-colors-neutral-100: hsl(210, 5%, 98%);
    --amplify-colors-black: #fff;
    --amplify-colors-white: #000;
    --amplify-colors-border-secondary: var(--amplify-colors-neutral-20);
    --amplify-colors-border-tertiary: var(--amplify-colors-neutral-10);
    --amplify-colors-overlay-10: hsla(0, 0%, 100%, 0.1);
    --amplify-colors-overlay-20: hsla(0, 0%, 100%, 0.2);
    --amplify-colors-overlay-30: hsla(0, 0%, 100%, 0.3);
    --amplify-colors-overlay-40: hsla(0, 0%, 100%, 0.4);
    --amplify-colors-overlay-50: hsla(0, 0%, 100%, 0.5);
    --amplify-colors-overlay-60: hsla(0, 0%, 100%, 0.6);
    --amplify-colors-overlay-70: hsla(0, 0%, 100%, 0.7);
    --amplify-colors-overlay-80: hsla(0, 0%, 100%, 0.8);
    --amplify-colors-overlay-90: hsla(0, 0%, 100%, 0.9);

    /* custom */
    --amplify-components-button-primary-background-color: #7582ff;
    --amplify-components-button-primary-hover-background-color: #646ee4;
    --amplify-components-button-primary-active-background-color: #646ee4;
    --amplify-components-button-primary-focus-background-color: #646ee4;
    --amplify-components-button-primary-focus-border-color: #646ee4;
    --amplify-components-button-link-color: #7582ff;
    --amplify-components-tabs-item-active-color: #7582ff;
    --amplify-components-tabs-item-active-border-color: #7582ff;
    --amplify-components-button-primary-focus-box-shadow: none;
}
</style>