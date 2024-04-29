<script lang="ts">
export default {
  data() {
    return {
      title: "Enter title here to see how it looks in YouTube even when the title is too long to fit on the screen",
      file: ''
    }
  },
  methods: {
    onChangeImage(event: any) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = function () {
          var output = document.getElementById("output") as HTMLImageElement;
          output.setAttribute("src", reader.result as string);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    }
  },
}
</script>

<template>
  <div class="mb-8 flex flex-col gap-2">
    <label class="input input-bordered flex items-center gap-2">
      Title
      <input v-model="title" type="text" class="grow" placeholder="Your video title" />
    </label>
    <input type="file" @change="onChangeImage($event)" class="file-input file-input-bordered w-full" />
  </div>
  <div class="w-[400px] mx-2 mb-10 font-medium text-[12px] font-roboto">
    <div class="relative">
      <img class="rounded-xl object-cover"
        src="https://i.ytimg.com/vi/hCMEGQfLIEM/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCMpxw60a6wuygbengcJqCViJOFnQ"
        id="output" />
      <div class="absolute bottom-0 right-0 rounded bg-[#00000099] m-[8px] px-[4px] py-[1px]">
        10:08
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex">
        <div class="mt-[12px] mr-[12px] shrink-0">
          <img class="rounded-full w-[48px] h-[48px]"
            src="https://yt3.ggpht.com/KQZLfAGbguh1mszeZvkqLMkDHd-eDtFBPFMd3fMV_HuVTRQrTtK60sdqG7P7wlh8AvI0N1MjYg=s68-c-k-c0x00ffffff-no-rj" />
        </div>
        <div class="text-youtube-parent">
          <div
            class="font-medium text-youtube text-[#F1F1F1] leading-youtube mt-[12px] mb-[4px] overflow-ellipsis overflow-hidden line-clamp-2">
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
  </div>
</template>
