<template>
  <aside class="side-bar-wrapper" :class="{ 'is-expanded': isExpanded }">
    <div class="sidebar-content">
      <nav class="menu-items" :aria-label="a11yText.mainNavigation">
        <button
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 0 }" 
          :aria-current="activeTab === 0 ? 'page' : undefined"
          :aria-label="$t('tabBar.sub')"
          :title="$t('tabBar.sub')"
          @click="router.push('/subs')"
        >
          <nut-icon name="link" size="22px" />
          <span class="label" v-show="isExpanded">{{ $t('tabBar.sub') }}</span>
        </button>

        <button 
          v-show="!appearanceSetting.istabBar2"
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 1 }" 
          :aria-current="activeTab === 1 ? 'page' : undefined"
          :aria-label="$t('tabBar.file')"
          :title="$t('tabBar.file')"
          @click="router.push('/files')"
        >
          <nut-icon name="category" size="22px" />
          <span class="label" v-show="isExpanded">{{ $t('tabBar.file') }}</span>
        </button>

        <button 
          v-show="!appearanceSetting.istabBar"
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 2 }" 
          :aria-current="activeTab === 2 ? 'page' : undefined"
          :aria-label="$t('tabBar.sync')"
          :title="$t('tabBar.sync')"
          @click="router.push('/sync')"
        >
          <nut-icon name="refresh2" size="22px" />
          <span class="label" v-show="isExpanded">{{ $t('tabBar.sync') }}</span>
        </button>

        <button 
          v-show="env?.feature?.share"
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 3 }" 
          :aria-current="activeTab === 3 ? 'page' : undefined"
          :aria-label="$t('tabBar.share')"
          :title="$t('tabBar.share')"
          @click="router.push('/shares')"
        >
          <font-awesome-icon aria-hidden="true" icon="fa-solid fa-share-nodes" style="font-size: 20px; width: 22px; height: 22px;" />
          <span class="label" v-show="isExpanded">{{ $t('tabBar.share') }}</span>
        </button>

        <button 
          v-show="env?.feature?.archive"
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 4 }" 
          :aria-current="activeTab === 4 ? 'page' : undefined"
          :aria-label="$t('tabBar.archive')"
          :title="$t('tabBar.archive')"
          @click="router.push('/archives')"
        >
          <font-awesome-icon aria-hidden="true" icon="fa-solid fa-box-archive" style="font-size: 20px; width: 22px; height: 22px;" />
          <span class="label" v-show="isExpanded">{{ $t('tabBar.archive') }}</span>
        </button>

        <button 
          type="button"
          class="menu-item" 
          :class="{ active: activeTab === 5 }" 
          :aria-current="activeTab === 5 ? 'page' : undefined"
          :aria-label="$t('tabBar.my')"
          :title="$t('tabBar.my')"
          @click="router.push('/my')"
        >
          <div class="icon-container">
            <nut-icon name="setting" size="22px" />
            <div v-if="env.hasNewVersion" class="nut-badge__content sup is-dot"></div>
          </div>
          <span class="label" v-show="isExpanded">{{ $t('tabBar.my') }}</span>
        </button>
      </nav>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/store/global';
import { useSettingsStore } from '@/store/settings';
import { useSystemStore } from "@/store/system";
import { SIDEBAR_EXPANDED_BREAKPOINT } from "@/store/system";
import { useA11y } from "@/hooks/useA11y";
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWindowSize } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const { a11yText } = useA11y();
const routeList = ['/subs', '/files', '/sync', '/shares', '/archives', '/my'];
const activeTab = ref(routeList.indexOf(route.path));

watch(
  () => route.path,
  (newPath) => {
    let matchedIndex = routeList.indexOf(newPath);
    if (matchedIndex === -1) {
      if (newPath.includes('/files')) matchedIndex = 1;
      else if (newPath.includes('/subs')) matchedIndex = 0;
      else if (newPath.includes('/sync')) matchedIndex = 2;
      else if (newPath.includes('/shares')) matchedIndex = 3;
      else if (newPath.includes('/archives')) matchedIndex = 4;
      else if (newPath.includes('/my')) matchedIndex = 5;
    }
    if (matchedIndex !== -1) {
      activeTab.value = matchedIndex;
    }
  },
  { immediate: true }
);

const { width: windowWidth } = useWindowSize();

const isExpanded = computed(() => {
  return windowWidth.value >= SIDEBAR_EXPANDED_BREAKPOINT;
});

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const systemStore = useSystemStore();

const { appearanceSetting } = storeToRefs(settingsStore);
const { env } = storeToRefs(globalStore);
const { navBarHeight } = storeToRefs(systemStore);

</script>

<style lang="scss" scoped>
.side-bar-wrapper {
  display: none; // Hidden by default, shown on medium+ screens

  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    height: max-content;
    top: calc(v-bind(navBarHeight) + 16px);
    width: 60px;
    padding: 8px 0;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 101;
    
    // User requested border & card background
    background: var(--tab-bar-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--item-card-radios, 20px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(var(--tab-bar-blur, 20px));
    -webkit-backdrop-filter: blur(var(--tab-bar-blur, 20px));

    // Anchor purely to the left of the .page-body
    left: calc(50vw - 315px);
    transform: translateX(-100%);
  }

  @media screen and (min-width: 900px) {
    left: calc(50vw - 350px);
  }

  @media screen and (min-width: 1200px) {
    left: calc(50vw - 450px);
  }

  &.is-expanded {
    width: 160px;
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .menu-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .menu-item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    color: var(--lowest-text-color);
    width: 100%;
    padding: 14px 24px;
    transition: color 0.2s, background 0.2s;
    border: 0;
    background: transparent;
    text-align: left;

    &.active {
      color: var(--primary-color);
    }

    &:hover:not(.active) {
      color: var(--primary-text-color);
    }

    .icon-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label {
      margin-left: 14px;
      font-weight: 600;
      white-space: nowrap;
      font-size: 14px;
      line-height: 1;
    }
  }

  // Adjustments for collapsed icon-only mode
  &:not(.is-expanded) {
    .menu-item {
      padding: 14px 0;
      justify-content: center;
    }
  }

  .nut-badge__content.is-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--nut-badge-background-color, #e2231a);
  }
}
</style>
