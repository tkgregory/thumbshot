<script lang="ts">
export default {
  data() {
    return {
      title: "Enter title here to see how it looks in YouTube"
    }
  },
}
</script>

<template>
  <input v-model="title" placeholder="Video title" />
  <div class="text-youtube-parent font-roboto">
    <div class="font-medium text-youtube text-[#F1F1F1] leading-youtube mt-3 mb-1 overflow-ellipsis">
      {{ title }}
    </div>
    <div class="flex flex-col text-[#AAAAAA] font-normal text-youtube">
      <div>Some Channel Name</div>
      <div>
        <span>13K views</span>
        <span class="before:content-['•'] before:mx-1">3 days ago</span>
      </div>
    </div>
  </div>
</template>
