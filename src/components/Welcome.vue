<script lang="ts">
const validExtensions = ['jpg', 'jpeg', 'png']

export default {
  data() {
    return {
      title: "I made these 23 websites (and earned $562,943)",
      file: '',
      errors: []
    }
  },
  methods: {
    onChangeImage(event: any) {
      if (!event.target.files[0]) {
        return
      }
      const errors: string[] = this.errors
      if (validExtensions.indexOf(event.target.files[0].name.split('.').pop().toLowerCase()) == -1) {
        errors.push(`Image must be one of these types: ${validExtensions.join(", ")}`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = function () {
        var image = new Image()
        image.src = reader.result as string
        image.onload = function () {
          if (image.width / image.height != 16 / 9) {
            errors.push("Image aspect ratio must be 16:9")
            return
          }
          if (image.width < 1280 || image.height < 720) {
            errors.push("Image size must be at least 1280x720 pixels")
            return
          }
          var output = document.getElementById("output") as HTMLImageElement
          output.setAttribute("src", reader.result as string)
          errors.length = 0
        }
      }
      reader.readAsDataURL(event.target.files[0])
    }
  },
}
</script>

<template>
  <div class="mb-8 flex flex-col gap-2">
    <label class="input input-bordered flex items-center gap-2">
      Title
      <input v-model="title" name="title" type="text" class="grow" placeholder="Your video title" />
    </label>
    <input name="thumbnail" type="file" @change="onChangeImage($event)" class="file-input file-input-bordered w-full" />
    <template v-if="errors.length">
      <div role="alert" class="alert alert-warning">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>
    </template>
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
            src="https://yt3.ggpht.com/X0qndfJx9whZBlyyCwVvJw6vUk6wi7GdhemvveYlAUXyMBR_YrEMV-9U64m0T7h9qQ3OE46R=s88-c-k-c0x00ffffff-no-rj" />
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
