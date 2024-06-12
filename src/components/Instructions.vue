<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
</script>

<template>
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