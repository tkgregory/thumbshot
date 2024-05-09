<script setup lang="ts">
import EditableText from './EditableText.vue';
import { CircleMinus } from 'lucide-vue-next';
import { CirclePlus } from 'lucide-vue-next';
import { CircleArrowLeft } from 'lucide-vue-next';
import { CircleArrowRight } from 'lucide-vue-next';
import { Upload } from 'lucide-vue-next';
</script>


<script lang="ts">
const validExtensions = ['jpg', 'jpeg', 'png']

export default {
  data() {
    return {
      file: '',
      error: null as string | null
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
      const fileName = event.target.files[0].name
      if (validExtensions.indexOf(fileName.split('.').pop().toLowerCase()) == -1) {
        this.showError(event, `Image must be one of these types: ${validExtensions.join(", ")}`)
        return
      }

      var self = this;
      const reader = new FileReader()
      reader.onloadend = function () {
        var image = new Image()
        image.src = reader.result as string
        image.onload = function () {
          if (image.width / image.height != 16 / 9) {
            self.showError(event, "Image aspect ratio must be 16:9")
            return
          }
          if (image.width < 1280 || image.height < 720) {
            self.showError(event, "Image size must be at least 1280x720 pixels")
            return
          }
          self.$emit("changeImageSrc", reader.result as string, fileName)
        }
      }
      reader.readAsDataURL(event.target.files[0])
    },
    showError(event: any, errorMessage: string) {
      this.error = errorMessage
      if (document) {
        console.log("Showing modal");
        (document.getElementById('error_modal') as HTMLFormElement).showModal();
      }
      event.target.value = null
    }
  },
}
</script>

<template>
  <div class="mx-[8px] mb-10">
    <div class="sm:w-[300px] md:w-[400px] font-medium text-[12px] font-roboto">
      <div class="relative">
        <div class="relative group">
          <img class="rounded-xl object-cover group-hover:brightness-[.30] transition duration-200 cursor-pointer"
            :src="imageSrc" id="output" />
          <div class="absolute bottom-0 right-0 rounded bg-[#00000099] m-[8px] px-[4px] py-[1px]">
            10:08
          </div>
          <div
            class="absolute hidden group-hover:flex items-center gap-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div class="tooltip w-[32px]" :data-tip="moveLeftEnabled ? 'Move left' : undefined">
              <CircleArrowLeft :size="32" :class="{ [`clickable`]: moveLeftEnabled, [`disabled`]: !moveLeftEnabled }"
                @click="moveLeftEnabled && $emit('moveLeft')" />
            </div>
            <div class="tooltip w-[32px]" :data-tip="deleteEnabled ? 'Delete this preview' : undefined">
              <CircleMinus :size="32" :class="{ [`clickable`]: deleteEnabled, [`disabled`]: !deleteEnabled }"
                @click="deleteEnabled && $emit('deletePreview')" />
            </div>
            <div class="tooltip w-[32px]" data-tip="Change thumbnail">
              <label>
                <Upload :size="32" class="clickable" />
                <input name="thumbnail" type="file" accept="image/*" @change="onChangeImage($event)" class="hidden" />
              </label>
            </div>
            <div class="tooltip w-[32px]" :data-tip="addEnabled ? 'Add new preview' : undefined">
              <CirclePlus :size="32" :class="{ [`clickable`]: addEnabled, [`disabled`]: !addEnabled }"
                @click="addEnabled && $emit('addPreview')" />
            </div>
            <div class="tooltip w-[32px]" :data-tip="moveRightEnabled ? 'Move right' : undefined">
              <CircleArrowRight :size="32" :class="{ [`clickable`]: moveRightEnabled, [`disabled`]: !moveRightEnabled }"
                @click="moveRightEnabled && $emit('moveRight')" />
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

  <Teleport to="body">
    <dialog id="error_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Ooops</h3>
        <p>{{ error }}</p>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </Teleport>
</template>
