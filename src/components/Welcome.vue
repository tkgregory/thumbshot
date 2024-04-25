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
  <input v-model="title" type="text" placeholder="Video title" class="input input-bordered w-full max-w-xs" />

  <div class="max-w-sm">
    <div class="flex">
      <div class="mt-[12px] mr-[12px]">
        <img class="rounded-full w-[48px] h-[48px]"
          src="https://yt3.ggpht.com/KQZLfAGbguh1mszeZvkqLMkDHd-eDtFBPFMd3fMV_HuVTRQrTtK60sdqG7P7wlh8AvI0N1MjYg=s68-c-k-c0x00ffffff-no-rj" />
      </div>
      <div class="text-youtube-parent font-roboto">
        <div class="font-medium text-youtube text-[#F1F1F1] leading-youtube mt-[12px] mb-[4px] overflow-ellipsis">
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
    </div>
  </div>
</template>
