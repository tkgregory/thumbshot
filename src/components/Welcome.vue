<script lang="ts">
export default {
  data() {
    return {
      title: ""
    }
  },
}
</script>

<template>
  <input v-model="title" placeholder="Video title" />

  <div>
    <p>{{ title }}</p>
  </div>
</template>
