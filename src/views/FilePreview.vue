<template>
  <Teleport to="#app" :disabled="!!url">
    <div
      class="compare-page-wrapper"
      :class="{ 'compare-page-wrapper-overlay': !url }"
      :style="{ height: url ? 'calc(100vh - 80px)' : '100vh' }"
    >
      <header class="compare-page-header">
        <template v-if="url">
          <h1>
            <button
              type="button"
              class="title copy-link-button"
              :aria-label="copyUrlLabel"
              :title="copyUrlLabel"
              @click="copyUrl"
            >
              <font-awesome-icon class="copy" icon="fa-solid fa-clone" />
              <span class="titleText">Click to copy for external use:</span>
            </button>
            <span class="displayName">
              <a class="url" :href="url" target="_blank" rel="noreferrer noopener">{{ url }}</a>
            </span>
          </h1>
        </template>
        <template v-else>
          <h1>
            <font-awesome-icon icon="fa-solid fa-eye" />
            <span class="title">{{ $t(`comparePage.title`) }}</span>
            <span class="displayName">
              <font-awesome-icon icon="fa-solid fa-angles-right" />
              <span class="displayNameText">{{ displayName }}</span>
            </span>
          </h1>
          <div class="btn-groups">
            <button
              v-if="showRefresh"
              type="button"
              class="btn refresh"
              :aria-label="refreshLabel"
              :title="refreshLabel"
              @click="emit('refresh')"
            >
              <font-awesome-icon icon="fa-solid fa-arrows-rotate" />
            </button>
            <button
              type="button"
              class="btn close"
              :aria-label="closeLabel"
              :title="closeLabel"
              @click="clickClose"
            >
              <font-awesome-icon icon="fa-solid fa-circle-xmark" />
            </button>
          </div>
        </template>
      </header>
      <cmView :isReadOnly="false" id="filePreview" />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import axios from "axios";
import { computed, ref, watch, watchEffect } from "vue";
import { useClipboard } from "@vueuse/core";
import useV3Clipboard from "vue-clipboard3";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useAppNotifyStore } from "@/store/appNotify";
import { useCodeStore } from "@/store/codeStore";
import { useSubsStore } from "@/store/subs";
import cmView from "@/views/editCode/cmView.vue";

const cmStore = useCodeStore();
const subsStore = useSubsStore();
const route = useRoute();
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();
const { showNotify } = useAppNotifyStore();
const { locale } = useI18n();

const props = defineProps<{
  previewData: any;
  name: string;
  showRefresh?: boolean;
}>();

const emit = defineEmits(["closePreview", "refresh"]);

const url = computed(() => route.query.url as string | undefined);
const processedData = ref("");
const showRefresh = computed(() => props.showRefresh !== false);
const copyUrlLabel = computed(() =>
  locale.value.startsWith("zh") ? "复制预览链接" : "Copy preview URL",
);
const refreshLabel = computed(() =>
  locale.value.startsWith("zh") ? "刷新预览内容" : "Refresh preview content",
);
const closeLabel = computed(() =>
  locale.value.startsWith("zh") ? "关闭预览" : "Close preview",
);

const displayName = computed(() => {
  if (route.query.name) return route.query.name as string;
  const file = subsStore.getOneFile(props.name);
  return file?.displayName || file?.["display-name"] || props.name;
});

watchEffect(async () => {
  if (url.value) {
    try {
      cmStore.setEditCode("filePreview", "Loading...");
      const response = await axios.get(url.value, {
        responseType: "text",
        transformResponse: [(data) => data],
      });
      processedData.value = response.data;
      cmStore.setEditCode("filePreview", processedData.value || "");
    } catch (error: any) {
      let data = error.response?.data;
      if (data) {
        try {
          data = JSON.stringify(JSON.parse(error.response?.data), null, 2);
        } catch {}
      }
      cmStore.setEditCode(
        "filePreview",
        `Error: ${
          error.response
            ? `${error.response.status} ${error.response.statusText}\n\n${data}`
            : error.message
        }`,
      );
      showNotify({ title: `Load failed: ${error.message}` });
    }
  }
  if (route.query.name) {
    document.title = `${route.query.name} - Sub Store`;
  }
});

watch(
  () => props.previewData?.processed,
  (val) => {
    if (!url.value && val != null) {
      cmStore.setEditCode("filePreview", val);
    }
  },
  { immediate: true },
);

const clickClose = () => {
  emit("closePreview");
};

const copyUrl = async () => {
  if (!url.value) return;
  if (isSupported) {
    await copy(url.value);
  } else {
    await copyFallback(url.value);
  }
  showNotify({ title: `Copied: ${url.value}` });
};
</script>

<style lang="scss" scoped>
.type-tag {
  padding: 1px 4px;
  line-height: 1;
  margin-right: 3px;
  color: var(--compare-tag-text-color);
  background: var(--compare-tag-background-color);
}

.item-true {
  color: var(--primary-color);
}

.item-false {
  width: 8px;
  height: 1px;
  border-radius: 2px;
  background: var(--lowest-text-color);
}

.name-wrapper {
  display: flex;
  flex-direction: column;
}

.compare-table-body {
  width: 100%;

  .processed-tr {
    padding-top: 20px;
    padding-bottom: 0;
  }

  .original-tr {
    padding-top: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--divider-color);
  }
}

.compare-table-row {
  padding: 0 var(--safe-area-side);
}

.compare-table-head {
  padding: 10px var(--safe-area-side);
}

.compare-table-head,
.compare-table-row {
  margin: 0;
  display: grid;
  grid-template-columns: 46% 1fr 1fr 1fr 1fr;

  li,
  td {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  li:first-child,
  td:first-child {
    justify-content: start;
  }
}

.compare-table-head {
  position: sticky;
  z-index: 7;
  top: 114px;
  border-bottom: 1px solid var(--divider-color);
  font-weight: bold;
  background: var(--background-color);
  color: var(--comment-text-color);

  &.filter-table-head {
    top: 84px;
  }
}

.processed-item,
.original-item {
  display: flex;
  align-items: center;

  &::before {
    content: "";
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 10px;
    background: var(--primary-color);
  }
}

.indicator {
  margin-right: 24px;
}

.processed-item::before {
  background: var(--third-color);
  flex-shrink: 0;
}

.block-wrapper {
  position: relative;
  background: var(--compare-item-background-color);

  .compare-title {
    padding: 0 var(--safe-area-side);
    z-index: 9;
    margin-top: 0;
    top: 56px;
    background: var(--background-color);
  }

  .compare-des {
    padding: 6px var(--safe-area-side);
    z-index: 8;
    display: flex;
    position: sticky;
    top: 84px;
    background: var(--background-color);
    color: var(--comment-text-color);
  }
}

.compare-page-body {
  font-size: 12px;
  background: inherit;
  color: var(--comment-text-color);
}

.compare-page-header {
  padding: env(safe-area-inset-top) var(--safe-area-side) 0;
  position: sticky;
  top: 0;
  z-index: 19;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  min-height: var(--compare-header-offset);
  box-sizing: border-box;
  border-bottom: 1px solid;
  color: var(--primary-text-color);
  background: var(--background-color);
  border-color: var(--divider-color);
  width: 100%;

  .title {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    min-width: 0;

    .titleText {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .copy-link-button {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .displayName {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
    flex: 1;

    .displayNameText,
    .url {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .displayNameText,
    .url {
      display: block;
    }

    > svg {
      flex-shrink: 0;
    }

    .copy {
      cursor: pointer;
      font-size: 16px;
      flex-shrink: 0;
    }

    .url {
      text-decoration: underline;
    }
  }

  h1 {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 20px;
    line-height: 1;
    font-weight: 500;

    > svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    span {
      font-size: 14px;
      color: var(--second-text-color);

      > svg {
        color: var(--comment-text-color);
      }
    }
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 20px;
    padding: 8px;
    color: var(--lowest-text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;

    &.refresh {
      font-size: 18px;
    }
  }

  .btn-groups {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;
  }
}

.compare-page-wrapper {
  --compare-header-height: 56px;
  --compare-header-offset: calc(var(--compare-header-height) + env(safe-area-inset-top));
  width: 100%;
  height: 100vh;
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--background-color);

  .cmviewRef {
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 85%;
      max-width: 800px;
    }
  }

  @media screen and (min-width: 900px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 80%;
      max-width: 900px;
    }
  }

  @media screen and (min-width: 1200px) {
    .compare-page-header,
    .compare-page-body,
    .cmviewRef {
      width: 75%;
      max-width: 1000px;
    }
  }
}

.compare-page-wrapper-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
}

.divider,
.divider::before,
.divider::after {
  color: var(--lowest-text-color);
  border-color: var(--lowest-text-color);
}

.input-wrapper {
  display: flex;
  align-items: center;

  > view.nut-textarea {
    background: transparent;
    padding: 8px 12px;
    color: var(--second-text-color);
    border-color: var(--lowest-text-color);

    :deep(textarea) {
      color: inherit;
    }
  }
}
</style>
