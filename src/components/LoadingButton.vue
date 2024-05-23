<script setup lang="ts">

defineProps(['disabled', 'isLoading'])
defineEmits(['click'])
</script>

<template>
    <button @click="!isLoading && $emit('click')" class="btn btn-square btn-primary" :disabled="isLoading || disabled">
        <slot v-if="!isLoading"></slot>
        <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
    </button>
</template>