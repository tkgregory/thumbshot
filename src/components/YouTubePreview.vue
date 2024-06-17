<script setup lang="ts">
import EditableText from './EditableText.vue';
import YouTubeThumbnail from './YouTubeThumbnail.vue';

defineProps({
  title: {
    required: true,
    type: String
  },
  channelName: {
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
  duplicateEnabled: {
    type: Boolean,
    default: false
  },
  moveLeftEnabled: {
    type: Boolean,
    default: false
  },
  moveRightEnabled: {
    type: Boolean,
    default: false
  },
  index: {
    required: true,
    type: Number
  },
  showNumbers: {
    type: Boolean,
    default: false
  },
  isGeneratingPreview: {
    type: Boolean,
    default: false
  },
  isSinglePreviewEnabled: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['changeTitle', 'changeChannelName', 'changeImage', 'deletePreview', 'duplicatePreview', 'moveLeft', 'moveRight', 'generatePreview'])
</script>

<template>
  <youtube-preview class="block text-youtube-parent">
    <div v-if="showNumbers" class="text-youtube mb-1">Option {{ index + 1 }}</div>
    <YouTubeThumbnail :imageSrc="imageSrc" :moveLeftEnabled="moveLeftEnabled" :moveRightEnabled="moveRightEnabled"
      :duplicateEnabled="duplicateEnabled" :isGeneratingPreview="isGeneratingPreview"
      :generateSinglePreviewEnabled="isSinglePreviewEnabled" @duplicatePreview="$emit('duplicatePreview')"
      @deletePreview="$emit('deletePreview')" @changeImage="(event) => emit('changeImage', event)" @moveLeft="
        $emit('moveLeft')" @moveRight="$emit('moveRight')" @generatePreview="$emit('generatePreview')" />
    <youtube-metadata class="flex">
      <youtube-channel-image class="mt-[12px] mr-[12px] shrink-0">
        <div class="rounded-full bg-gray-400 w-[48px] h-[48px]"></div>
      </youtube-channel-image>
      <youtube-metadata-text class="grow">
        <div
          class="font-medium text-youtube text-[#F1F1F1] leading-youtube mt-[12px] mb-[4px] overflow-ellipsis overflow-hidden line-clamp-2">
          <EditableText name="title" :value="title" placeholder="Your video title"
            @changeValue="(title: string) => $emit('changeTitle', title)" />
        </div>
        <div class="flex flex-col text-[#AAAAAA] font-normal text-youtube">
          <EditableText name="channelName" :value="channelName" placeholder="Your channel name"
            @changeValue="(channelName: string) => $emit('changeChannelName', channelName)" />
          <div>
            <span>13K views</span>
            <span class="before:content-['•'] before:mx-1">3 days ago</span>
          </div>
        </div>
      </youtube-metadata-text>
    </youtube-metadata>
  </youtube-preview>
</template>
