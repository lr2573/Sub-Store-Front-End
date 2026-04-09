<template>
  <p class="sr-only" aria-live="polite" aria-atomic="true">
    {{ announcement }}
  </p>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useA11y } from "@/hooks/useA11y";

const route = useRoute();
const { t, locale } = useI18n();
const { getA11yText } = useA11y();

const announcement = ref("");

const getRouteTitle = () => {
  const metaTitle = route.meta?.title;

  if (!metaTitle) {
    return "Sub Store";
  }

  return t(`navBar.pagesTitle.${metaTitle}`);
};

watch(
  [() => route.fullPath, () => route.meta?.title, () => locale.value],
  async () => {
    announcement.value = "";
    await nextTick();
    announcement.value = `${getA11yText("routeChanged")}: ${getRouteTitle()}`;
  },
  { immediate: true },
);
</script>
