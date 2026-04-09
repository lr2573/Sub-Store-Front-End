<template>
  <nut-empty
    :image="image"
    :image-size="imageSize"
    :description="description"
  >
    <template #image>
      <slot name="image">
        <img
          v-if="imageUrl"
          class="accessible-empty-image"
          :src="imageUrl"
          alt=""
          aria-hidden="true"
        >
      </slot>
    </template>
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
    <slot />
  </nut-empty>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  image?: string;
  imageSize?: number | string;
  description?: string;
}>(), {
  image: "empty",
  imageSize: "",
  description: "",
});

const defaultStatus: Record<string, string> = {
  empty: "https://static-ftcms.jd.com/p/files/61a9e3183985005b3958672b.png",
  error: "https://ftcms.jd.com/p/files/61a9e33ee7dcdbcc0ce62736.png",
  network: "https://static-ftcms.jd.com/p/files/61a9e31de7dcdbcc0ce62734.png",
};

const imageUrl = computed(() => {
  if (!props.image) {
    return "";
  }

  if (/^(https?:)?\/\//.test(props.image)) {
    return props.image;
  }

  return defaultStatus[props.image] || props.image;
});
</script>

<style lang="scss" scoped>
.accessible-empty-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}
</style>
