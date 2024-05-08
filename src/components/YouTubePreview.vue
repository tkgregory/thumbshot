<script setup lang="ts">
import EditableText from './EditableText.vue';
import { CircleMinus } from 'lucide-vue-next';
import { CirclePlus } from 'lucide-vue-next';
import { CircleArrowLeft } from 'lucide-vue-next';
import { CircleArrowRight } from 'lucide-vue-next';
</script>


<script lang="ts">
const validExtensions = ['jpg', 'jpeg', 'png']

export default {
  data() {
    return {
      file: '',
      errors: [],
    }
  },
  props: {
    title: {
      required: true,
      type: String
    },
    imageSrc: {
      required: true,
      type: String
    },
    fileName: {
      required: true,
      type: String
    },
    deleteEnabled: {
      required: true,
      type: Boolean
    },
    addEnabled: {
      required: true,
      type: Boolean
    },
    moveLeftEnabled: {
      required: true,
      type: Boolean
    },
    moveRightEnabled: {
      required: true,
      type: Boolean
    }
  },
  emits: ['changeTitle', 'changeImageSrc', 'deletePreview', 'addPreview', 'moveLeft', 'moveRight'],
  methods: {
    onChangeImage(event: any) {

      if (!event.target.files[0]) {
        return
      }
      const errors: string[] = this.errors
      const fileName = event.target.files[0].name
      if (validExtensions.indexOf(fileName.split('.').pop().toLowerCase()) == -1) {
        errors.push(`Image must be one of these types: ${validExtensions.join(", ")}`)
        return
      }


      var self = this;
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
          errors.length = 0
          self.$emit("changeImageSrc", reader.result as string, fileName)
        }
      }
      reader.readAsDataURL(event.target.files[0])
    }
  },
}
</script>

<template>
  <div class="mx-[8px] mb-10">
    <div class="mb-8 flex flex-col gap-2">
      <div class="file-input file-input-bordered w-full flex items-center">
        <label class="flex items-center gap-4 p-2">
          <div class="btn btn-neutral btn-sm uppercase">Choose File</div>
          <div v-if="fileName">{{ fileName }}</div>
          <input name="thumbnail" type="file" accept="image/*" @change="onChangeImage($event)" class="hidden" />
        </label>
      </div>

      <template v-if="errors.length">
        <div role="alert" class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </div>
      </template>
    </div>
    <div class="sm:w-[300px] md:w-[400px] font-medium text-[12px] font-roboto">
      <div class="relative">
        <div class="relative group">
          <img class="rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer"
            :src="imageSrc" id="output" />
          <div class="absolute bottom-0 right-0 rounded bg-[#00000099] m-[8px] px-[4px] py-[1px]">
            10:08
          </div>
          <div class="absolute hidden group-hover:flex gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="w-[32px]">
              <div class="tooltip" :data-tip="moveLeftEnabled ? 'Move left' : undefined">
                <CircleArrowLeft :size="32" :class="{ [`clickable`]: moveLeftEnabled, [`disabled`]: !moveLeftEnabled }"
                  @click="moveLeftEnabled && $emit('moveLeft')" />
              </div>
            </div>
            <div class="w-[32px]">
              <div class="tooltip" :data-tip="deleteEnabled ? 'Delete this preview' : undefined">
                <CircleMinus :size="32" :class="{ [`clickable`]: deleteEnabled, [`disabled`]: !deleteEnabled }"
                  @click="deleteEnabled && $emit('deletePreview')" />
              </div>
            </div>
            <div class="w-[32px]">
              <div class="tooltip" :data-tip="addEnabled ? 'Add new preview' : undefined">
                <CirclePlus :size="32" :class="{ [`clickable`]: addEnabled, [`disabled`]: !addEnabled }"
                  @click="addEnabled && $emit('addPreview')" />
              </div>
            </div>
            <div class="w-[32px]">
              <div class="tooltip" :data-tip="moveRightEnabled ? 'Move right' : undefined">
                <CircleArrowRight :size="32"
                  :class="{ [`clickable`]: moveRightEnabled, [`disabled`]: !moveRightEnabled }"
                  @click="moveRightEnabled && $emit('moveRight')" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex">
          <div class="mt-[12px] mr-[12px] shrink-0">
            <div class="rounded-full bg-gray-400 w-[48px] h-[48px]" />
          </div>
          <div class="text-youtube-parent grow">
            <div
              class="font-medium text-youtube text-[#F1F1F1] leading-youtube mt-[12px] mb-[4px] overflow-ellipsis overflow-hidden line-clamp-2">
              <EditableText :value="title" @changeTitle="(title: string) => $emit('changeTitle', title)" />
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
  </div>
</template>
