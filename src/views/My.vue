<template>
  <div class="my-page-wrapper">
    <div class="profile-block">
      <div class="radio-wrapper" >
        <button
          v-for="i in [{value: 'gist'}, {value:'manual'}]"
          :key="i.value"
          type="button"
          class="storage-tag icon-button-reset"
          :class="{ 'tag': true, 'current': i.value === storageType }"
          :aria-pressed="i.value === storageType"
          @click="setTag(i.value)"
        >{{$t(`myPage.storage.${i.value}.label`) }}</button>
        <p class="storage-info">{{ $t(`myPage.storage.${storageType}.info`) }}</p>
      </div>

      <div class="info">
        <div v-if="storageType === 'manual'" class="avatar-wrapper">
          <nut-avatar
            v-if="remoteAvatarUrl"
            :key="avatarDisplayKey"
            size="72"
            bg-color="var(--card-color)"
            :url="remoteAvatarUrl"
            alt=""
            @on-error="handleAvatarError"
          />
          <div v-else class="avatar-fallback-shell" aria-hidden="true">
            <img :src="avatar" alt="" class="avatar-fallback-image">
          </div>
          <div class="name">
            <p class="title">
              {{ $t(`myPage.storage.manual.label`) }}
            </p>
            <p class="des">
              <span class="des-line1">{{ $t(`myPage.storage.manual.desc`) }}</span>
              <!-- <span class="des-line2" v-if="desText.length === 2">
                {{ desText[1] }}
              </span> -->
            </p>
          </div>
        </div>
        <div v-else class="avatar-wrapper">
          <nut-avatar
            v-if="remoteAvatarUrl"
            :key="avatarDisplayKey"
            size="72"
            bg-color="var(--card-color)"
            :url="remoteAvatarUrl"
            alt=""
            @on-error="handleAvatarError"
          />
          <div v-else class="avatar-fallback-shell" aria-hidden="true">
            <img :src="avatar" alt="" class="avatar-fallback-image">
          </div>
          <div class="name">
            <p class="title">
              {{ githubUser || $t(`myPage.placeholder.name`) }}
            </p>
            <p class="des">
              <span class="des-line1">{{ desText[0] }}</span>
              <span class="des-line2" v-if="desText.length === 2">
                {{ desText[1] }}
              </span>
            </p>
          </div>
        </div>
        <div v-if="storageType === 'manual'" class="actions">
          <!-- <input type="file" @change="uploadFile" /> -->
          <!-- accept="application/json,text/json,.json"  -->
          <input type="file" ref="fileInput" @change="fileChange" style="display: none">
          <nut-button
            class="upload-btn"
            plain
            type="primary"
            :disabled="restoreIsLoading"
            size="small"
            :loading="restoreIsLoading"
            @click="upload()"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-up"
              v-if="!uploadIsLoading"
            />
            {{ $t(`myPage.storage.manual.restore`) }}
          </nut-button>
          <a :href="host + '/api/storage'" target="_blank" rel="noreferrer noopener">
            <nut-button
              class="download-btn"
              type="primary"
              size="small"
            >
              <font-awesome-icon
                icon="fa-solid fa-cloud-arrow-down"
              />
              {{ $t(`myPage.storage.manual.backup`) }}
            </nut-button>
          </a>
        </div>
        <div v-else class="actions">
          <nut-button
            class="upload-btn"
            plain
            type="primary"
            :disabled="syncIsDisabled"
            size="small"
            :loading="uploadIsLoading"
            @click="uploadBtn"
          >
            <font-awesome-icon
              icon="fa-solid fa-cloud-arrow-up"
              v-if="!uploadIsLoading"
            />
            {{ $t(`myPage.btn.upload`) }}
          </nut-button>
          <nut-button
            class="download-btn"
            type="primary"
            size="small"
            :disabled="syncIsDisabled"
            :loading="downloadIsLoading"
            @click="downloadBtn"
          >
            <font-awesome-icon
              v-if="!downloadIsLoading"
              icon="fa-solid fa-cloud-arrow-down"
            />
            {{ $t(`myPage.btn.download`) }}
          </nut-button>
        </div>
      </div>
      <div class="config-card" v-if="storageType !== 'manual'" >
        <div class="title-wrapper">
          <h2 class="config-heading">
            <button
              type="button"
              class="title-toggle"
              :aria-expanded="isGitHubConfigEditing"
              @click="isGitHubConfigEditing ? exitEditMode('github') : toggleEditMode('github')"
            >
              {{ $t(`myPage.githubConfig`) }}
            </button>
          </h2>
          <div class="config-btn-wrapper">
            <nut-button
              v-if="isGitHubConfigEditing"
              class="cancel-btn"
              plain
              type="info"
              size="mini"
              @click.stop="exitEditMode('github')"
              :disabled="isEditLoading"
            >
              <font-awesome-icon icon="fa-solid fa-ban" />
              {{ $t(`myPage.btn.cancel`) }}
            </nut-button>
            <nut-button
              v-if="isGitHubConfigEditing"
              class="save-btn"
              type="primary"
              size="mini"
              @click.stop="toggleEditMode('github')"
              :loading="isEditLoading"
            >
              <font-awesome-icon
                v-if="!isGitHubConfigEditing"
                icon="fa-solid fa-pen-to-square"
              />
              <font-awesome-icon
                v-else-if="!isEditLoading && isGitHubConfigEditing"
                icon="fa-solid fa-floppy-disk"
              />
              {{ !isGitHubConfigEditing ? $t(`myPage.btn.edit`) : $t(`myPage.btn.save`) }}
            </nut-button>
            <nut-icon v-else class="right-icon" name="right"></nut-icon>
          </div>
        </div>
        <div class="config-input-wrapper" v-if="isGitHubConfigEditing">
          <nut-input
            ref="githubUserInputRef"
            class="input"
            v-model="userInput"
            :disabled="!isGitHubConfigEditing"
            :placeholder="$t(`myPage.placeholder.githubUser`)"
            type="text"
            input-align="left"
            :left-icon="iconUser"
          >
            <!-- <template #button>
              <nut-button :disabled="!isGitHubConfigEditing" :plain="!isGitHubConfigEditing" size="mini" :type="isGitHubConfigEditing ? 'primary' : 'info' " @click="toggleSyncPlatform">{{ syncPlatformInput === 'gitlab' ? ( isGitHubConfigEditing ?'切换回 Gist' : 'GitLab Snippet (β)') : ( isGitHubConfigEditing ?'切换到 GitLab Snippet (β)' : 'Gist') }}</nut-button>
            </template> -->
          </nut-input>
          <nut-input
            ref="gistTokenInputRef"
            class="input"
            v-model="tokenInput"
            :disabled="!isGitHubConfigEditing"
            :placeholder="$t(`myPage.placeholder.gistToken`)"
            type="text"
            input-align="left"
            :left-icon="iconKey"
          />
          <div class="input-with-help">
            <nut-input
              ref="githubProxyInputRef"
              class="input"
              v-model="githubProxyInput"
              :disabled="!isGitHubConfigEditing"
              :placeholder="$t(`myPage.placeholder.githubProxy`)"
              type="text"
              input-align="left"
              :left-icon="icongithubProxy"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isGitHubConfigEditing"
              :aria-label="githubProxyHelpLabel"
              :title="githubProxyHelpLabel"
              @click="githubProxyTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="githubProxyRegexInputRef"
              class="input"
              v-model="githubProxyRegexInput"
              :disabled="!isGitHubConfigEditing"
              :placeholder="$t(`myPage.placeholder.githubProxyRegex`)"
              type="text"
              input-align="left"
              :left-icon="icongithubProxy"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isGitHubConfigEditing"
              :aria-label="githubProxyRegexHelpLabel"
              :title="githubProxyRegexHelpLabel"
              @click="githubProxyRegexTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          
        </div>
      </div>
      <div class="config-card">
        <div class="title-wrapper">
          <h2 class="config-heading">
            <button
              type="button"
              class="title-toggle"
              :aria-expanded="isRequestConfigEditing"
              @click="isRequestConfigEditing ? exitEditMode('request') : toggleEditMode('request')"
            >
              {{ $t(`myPage.requestConfig`) }}
            </button>
          </h2>
          <div class="config-btn-wrapper">
            <nut-button
              v-if="isRequestConfigEditing"
              class="cancel-btn"
              plain
              type="info"
              size="mini"
              @click.stop="exitEditMode('request')"
              :disabled="isEditLoading"
            >
              <font-awesome-icon icon="fa-solid fa-ban" />
              {{ $t(`myPage.btn.cancel`) }}
            </nut-button>
            <nut-button
             v-if="isRequestConfigEditing"
              class="save-btn"
              type="primary"
              size="mini"
              @click.stop="toggleEditMode('request')"
              :loading="isEditLoading"
            >
              <font-awesome-icon
                v-if="!isRequestConfigEditing"
                icon="fa-solid fa-pen-to-square"
              />
              <font-awesome-icon
                v-else-if="!isEditLoading && isRequestConfigEditing"
                icon="fa-solid fa-floppy-disk"
              />
              {{ !isRequestConfigEditing ? $t(`myPage.btn.edit`) : $t(`myPage.btn.save`) }}
            </nut-button>
             <nut-icon v-else class="right-icon" name="right"></nut-icon>
          </div>
        </div>
        <div class="config-input-wrapper" v-if="isRequestConfigEditing">
          <div class="input-with-help">
            <nut-input
              ref="defaultProxyInputRef"
              class="input"
              v-model="proxyInput"
              :disabled="!isRequestConfigEditing"
              :placeholder="$t(`myPage.placeholder.defaultProxy`)"
              type="text"
              input-align="left"
              :left-icon="iconProxy"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isRequestConfigEditing"
              :aria-label="defaultProxyHelpLabel"
              :title="defaultProxyHelpLabel"
              @click="proxyTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="defaultUserAgentInputRef"
              class="input"
              v-model="uaInput"
              :disabled="!isRequestConfigEditing"
              :placeholder="$t(`myPage.placeholder.defaultUserAgent`)"
              type="text"
              input-align="left"
              :left-icon="iconUA"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isRequestConfigEditing"
              :aria-label="defaultUserAgentHelpLabel"
              :title="defaultUserAgentHelpLabel"
              @click="uaTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="defaultTimeoutInputRef"
              class="input"
              v-model="timeoutInput"
              :disabled="!isRequestConfigEditing"
              :placeholder="$t(`myPage.placeholder.defaultTimeout`)"
              type="number"
              input-align="left"
              :left-icon="iconTimeout"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isRequestConfigEditing"
              :aria-label="defaultTimeoutHelpLabel"
              :title="defaultTimeoutHelpLabel"
              @click="timeoutTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="config-card">
        <div class="title-wrapper">
          <h2 class="config-heading">
            <button
              type="button"
              class="title-toggle"
              :aria-expanded="isCacheConfigEditing"
              @click="isCacheConfigEditing ? exitEditMode('cache') : toggleEditMode('cache')"
            >
              {{ $t(`myPage.cacheConfig`) }}
            </button>
          </h2>
          <div class="config-btn-wrapper">
            <nut-button
              v-if="isCacheConfigEditing"
              class="cancel-btn"
              plain
              type="info"
              size="mini"
              @click.stop="exitEditMode('cache')"
              :disabled="isEditLoading"
            >
              <font-awesome-icon icon="fa-solid fa-ban" />
              {{ $t(`myPage.btn.cancel`) }}
            </nut-button>
            <nut-button
              v-if="isCacheConfigEditing"
              class="save-btn"
              type="primary"
              size="mini"
              @click.stop="toggleEditMode('cache')"
              :loading="isEditLoading"
            >
              <font-awesome-icon
                v-if="!isCacheConfigEditing"
                icon="fa-solid fa-pen-to-square"
              />
              <font-awesome-icon
                v-else-if="!isEditLoading && isCacheConfigEditing"
                icon="fa-solid fa-floppy-disk"
              />
              {{ !isCacheConfigEditing ? $t(`myPage.btn.edit`) : $t(`myPage.btn.save`) }}
            </nut-button>
            <nut-icon v-else class="right-icon" name="right"></nut-icon>
          </div>
        </div>
        <div class="config-input-wrapper" v-if="isCacheConfigEditing">
        
          <div class="input-with-help">
            <nut-input
              ref="cacheThresholdInputRef"
              class="input"
              v-model="cacheThresholdInput"
              :disabled="!isCacheConfigEditing"
              :placeholder="$t(`myPage.placeholder.cacheThreshold`)"
              type="number"
              input-align="left"
              :left-icon="iconMax"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isCacheConfigEditing"
              :aria-label="cacheThresholdHelpLabel"
              :title="cacheThresholdHelpLabel"
              @click="cacheThresholdTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="resourceCacheTtlInputRef"
              class="input"
              v-model="resourceCacheTtlInput"
              :disabled="!isCacheConfigEditing"
              :placeholder="$t(`myPage.placeholder.resourceCacheTtl`)"
              type="number"
              input-align="left"
              :left-icon="iconResourceCacheTtl"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isCacheConfigEditing"
              :aria-label="resourceCacheTtlHelpLabel"
              :title="resourceCacheTtlHelpLabel"
              @click="resourceCacheTtlTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="headersCacheTtlInputRef"
              class="input"
              v-model="headersCacheTtlInput"
              :disabled="!isCacheConfigEditing"
              :placeholder="$t(`myPage.placeholder.headersCacheTtl`)"
              type="number"
              input-align="left"
              :left-icon="iconHeadersCacheTtl"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isCacheConfigEditing"
              :aria-label="headersCacheTtlHelpLabel"
              :title="headersCacheTtlHelpLabel"
              @click="headersCacheTtlTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="scriptCacheTtlInputRef"
              class="input"
              v-model="scriptCacheTtlInput"
              :disabled="!isCacheConfigEditing"
              :placeholder="$t(`myPage.placeholder.scriptCacheTtl`)"
              type="number"
              input-align="left"
              :left-icon="iconScriptCacheTtl"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isCacheConfigEditing"
              :aria-label="scriptCacheTtlHelpLabel"
              :title="scriptCacheTtlHelpLabel"
              @click="scriptCacheTtlTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="config-card">
        <div class="title-wrapper">
          <h2 class="config-heading">
            <button
              type="button"
              class="title-toggle"
              :aria-expanded="isFrontEndConfigEditing"
              @click="isFrontEndConfigEditing ? exitEditMode('frontEnd') : toggleEditMode('frontEnd')"
            >
              {{ $t(`myPage.frontEndConfig`) }}
            </button>
          </h2>
          <div class="config-btn-wrapper">
            <nut-button
              v-if="isFrontEndConfigEditing"
              class="cancel-btn"
              plain
              type="info"
              size="mini"
              @click.stop="exitEditMode('frontEnd')"
              :disabled="isEditLoading"
            >
              <font-awesome-icon icon="fa-solid fa-ban" />
              {{ $t(`myPage.btn.cancel`) }}
            </nut-button>
            <nut-button
              v-if="isFrontEndConfigEditing"
              class="save-btn"
              type="primary"
              size="mini"
              @click.stop="toggleEditMode('frontEnd')"
              :loading="isEditLoading"
            >
              <font-awesome-icon
                v-if="!isFrontEndConfigEditing"
                icon="fa-solid fa-pen-to-square"
              />
              <font-awesome-icon
                v-else-if="!isEditLoading && isFrontEndConfigEditing"
                icon="fa-solid fa-floppy-disk"
              />
              {{ !isFrontEndConfigEditing ? $t(`myPage.btn.edit`) : $t(`myPage.btn.save`) }}
            </nut-button>
            <nut-icon v-else class="right-icon" name="right"></nut-icon>
          </div>
        </div>
        <div class="config-input-wrapper" v-if="isFrontEndConfigEditing">
        
          <div class="input-with-help">
            <nut-input
              ref="concurrencyInputRef"
              class="input"
              v-model="concurrencyInput"
              :disabled="!isFrontEndConfigEditing"
              :placeholder="$t(`myPage.placeholder.concurrency`)"
              type="number"
              input-align="left"
              :left-icon="iconConcurrency"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isFrontEndConfigEditing"
              :aria-label="concurrencyHelpLabel"
              :title="concurrencyHelpLabel"
              @click="concurrencyTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
          <div class="input-with-help">
            <nut-input
              ref="apiCheckTimeoutInputRef"
              class="input"
              v-model="apiCheckTimeoutInput"
              :disabled="!isFrontEndConfigEditing"
              :placeholder="$t(`myPage.placeholder.apiCheckTimeout`)"
              type="number"
              input-align="left"
              :left-icon="iconTimeout"
            />
            <button
              type="button"
              class="input-help-button"
              :disabled="!isFrontEndConfigEditing"
              :aria-label="apiCheckTimeoutHelpLabel"
              :title="apiCheckTimeoutHelpLabel"
              @click="apiCheckTimeoutTips"
            >
              <nut-icon name="tips"></nut-icon>
            </button>
          </div>
        
        </div>
      </div>

      <div v-if="shareBtnVisible" class="settings-nav-group">
        <button
          type="button"
          class="settings-nav-button"
          @click="onClickShareManage"
        >
          <span>{{ $t(`moreSettingPage.shareManageTitle`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
        <button
          v-if="archiveVisible"
          type="button"
          class="settings-nav-button"
          @click="onClickArchive"
        >
          <span>{{ $t(`moreSettingPage.archiveTitle`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
      </div>
      <div v-else-if="archiveVisible" class="settings-nav-group">
        <button
          type="button"
          class="settings-nav-button"
          @click="onClickArchive"
        >
          <span>{{ $t(`moreSettingPage.archiveTitle`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
      </div>
      <div class="settings-nav-group">
        <button
          type="button"
          class="settings-nav-button"
          @click="onClickAPISetting"
        >
          <span>{{ $t(`apiSettingPage.apiSettingTitle`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
        <button
          type="button"
          class="settings-nav-button"
          @click="onClickMore"
        >
          <span>{{ $t(`moreSettingPage.moreSettingTitle`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
        <button
          type="button"
          class="settings-nav-button"
          @click="onClickAbout"
        >
          <span>{{ $t(`navBar.pagesTitle.aboutUs`) }}</span>
          <nut-icon name="right"></nut-icon>
        </button>
      </div>
    </div>

    <div class="env-block">
      <img v-if="icon" :src="displayBackendIcon" :alt="`${env.backend} backend`" class="auto-reverse" />
      <a
        v-if="env.hasNewVersion"
        target="_blank"
        rel="noreferrer noopener"
        :href="
          env.backend === 'Node'
            ? 'https://github.com/sub-store-org/Sub-Store/releases'
            : 'https://github.com/sub-store-org/Sub-Store/tree/master/config'
        "
      >
        <nut-badge value="NEW">v{{ env.version }}</nut-badge>
      </a>
      <p v-else>v{{ env.version }}</p>
      <p>{{ env.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_NAME || env.backend }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSettingsApi } from "@/api/settings";
import avatar from "@/assets/icons/avatar.svg?url";
import iconKey from "@/assets/icons/key-solid.png";
import iconUser from "@/assets/icons/user-solid.png";
import iconProxy from "@/assets/icons/proxy.svg";
import icongithubProxy from "@/assets/icons/githubProxy.svg";
import iconUA from "@/assets/icons/user-agent.svg";
import iconMax from "@/assets/icons/max.svg";
import iconHeadersCacheTtl from "@/assets/icons/headersCacheTtl.svg";
import iconResourceCacheTtl from "@/assets/icons/resourceCacheTtl.svg";
import iconScriptCacheTtl from "@/assets/icons/scriptCacheTtl.svg";
import iconTimeout from "@/assets/icons/timeout.svg";
import iconConcurrency from "@/assets/icons/concurrency.svg";
import { useAppNotifyStore } from "@/store/appNotify";
import { useGlobalStore } from "@/store/global";
import { useSettingsStore } from "@/store/settings";
import { butifyDate } from "@/utils/butifyDate";
import { createGithubProxyUrlRewriter } from "@/utils/githubProxy";
import { initStores } from "@/utils/initApp";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useBackend } from "@/hooks/useBackend";
import { useHostAPI } from '@/hooks/useHostAPI';
import { syncInnerInputA11y } from '@/hooks/useA11y';
import { Dialog, Toast } from '@nutui/nutui';

const { t, locale } = useI18n();

// const route = useRoute();
const router = useRouter();
const { showNotify } = useAppNotifyStore();
const { currentUrl: host } = useHostAPI();
const settingsStore = useSettingsStore();
const { githubUser, gistToken, syncTime, avatarUrl, defaultUserAgent, defaultProxy, defaultTimeout, cacheThreshold, resourceCacheTtl, headersCacheTtl, scriptCacheTtl, syncPlatform, githubProxy, githubProxyRegex, gistUpload } =
  storeToRefs(settingsStore);

const HTTP_URL_RE = /^https?:\/\//i;
const avatarLoadFailed = ref(false);
const avatarRenderNonce = ref(0);

const applyGithubAvatarProxy = (candidateUrl?: string | null) => {
  const normalizedUrl = candidateUrl?.trim();
  const proxyBaseUrl = githubProxy.value?.trim().replace(/\/+$/, "");

  if (!normalizedUrl || !proxyBaseUrl || !HTTP_URL_RE.test(normalizedUrl)) {
    return normalizedUrl || "";
  }

  if (normalizedUrl.startsWith(`${proxyBaseUrl}/`)) {
    return normalizedUrl;
  }

  return `${proxyBaseUrl}/${normalizedUrl}`;
};

const fallbackGithubAvatarUrl = computed(() => {
  const normalizedGithubUser = githubUser.value?.trim();

  if (!normalizedGithubUser) {
    return "";
  }

  return `https://github.com/${encodeURIComponent(normalizedGithubUser)}.png`;
});

const remoteAvatarUrl = computed(() => {
  if (!githubUser.value?.trim() || avatarLoadFailed.value) {
    return "";
  }

  return applyGithubAvatarProxy(avatarUrl.value || fallbackGithubAvatarUrl.value);
});

const avatarDisplayKey = computed(() => {
  return `${remoteAvatarUrl.value || "fallback"}:${avatarRenderNonce.value}`;
});

const resetAvatarState = (forceRerender = false) => {
  avatarLoadFailed.value = false;

  if (forceRerender) {
    avatarRenderNonce.value += 1;
  }
};

const handleAvatarError = () => {
  if (!remoteAvatarUrl.value) {
    return;
  }

  avatarLoadFailed.value = true;
  avatarRenderNonce.value += 1;
};

watch([githubUser, githubProxy, githubProxyRegex, avatarUrl], () => {
  resetAvatarState(true);
});

const { icon, env } = useBackend();
const githubUrlRewriter = computed(() => {
  return createGithubProxyUrlRewriter(githubProxy.value, githubProxyRegex.value);
});
const displayBackendIcon = computed(() => {
  return githubUrlRewriter.value(
    env.value?.meta?.node?.env?.SUB_STORE_BACKEND_CUSTOM_ICON || icon.value,
  ) || icon.value;
});

const shareBtnVisible = computed(() => {
  return env.value?.feature?.share;
});
const archiveVisible = computed(() => {
  return env.value?.feature?.archive;
});

const onClickAPISetting = () => {
  router.push(`/settings/api`);
};

const onClickShareManage = () => {
  router.push(`/shares`);
};
const onClickArchive = () => {
  router.push(`/archives`);
};
const onClickMore = () => {
  router.push(`/settings/more`);
};
const onClickAbout = () => {
  router.push(`/aboutUs`);
};


// 编辑 更新
const syncPlatformInput = ref("");
const userInput = ref("");
const tokenInput = ref("");
const githubProxyInput = ref("");
const githubProxyRegexInput = ref("");
const uaInput = ref("");
const proxyInput = ref("");
const timeoutInput = ref("");
const cacheThresholdInput = ref("");
const resourceCacheTtlInput = ref("");
const headersCacheTtlInput = ref("");
const scriptCacheTtlInput = ref("");
const concurrencyInput = ref("");
const apiCheckTimeoutInput = ref("");
const isGitHubConfigEditing = ref(false);
const isRequestConfigEditing = ref(false);
const isCacheConfigEditing = ref(false);
const isFrontEndConfigEditing = ref(false);
const isEditLoading = ref(false);
const isInit = ref(false);
const storageType = ref('gist');
const fileInput = ref(null);
const githubUserInputRef = ref(null);
const gistTokenInputRef = ref(null);
const githubProxyInputRef = ref(null);
const githubProxyRegexInputRef = ref(null);
const defaultProxyInputRef = ref(null);
const defaultUserAgentInputRef = ref(null);
const defaultTimeoutInputRef = ref(null);
const cacheThresholdInputRef = ref(null);
const resourceCacheTtlInputRef = ref(null);
const headersCacheTtlInputRef = ref(null);
const scriptCacheTtlInputRef = ref(null);
const concurrencyInputRef = ref(null);
const apiCheckTimeoutInputRef = ref(null);

const createHelpLabel = (key: string) => computed(() => {
  const label = t(key);
  return locale.value.startsWith('zh') ? `查看${label}帮助` : `Open help for ${label}`;
});

const githubProxyHelpLabel = createHelpLabel(`myPage.placeholder.githubProxy`);
const githubProxyRegexHelpLabel = createHelpLabel(`myPage.placeholder.githubProxyRegex`);
const defaultProxyHelpLabel = createHelpLabel(`myPage.placeholder.defaultProxy`);
const defaultUserAgentHelpLabel = createHelpLabel(`myPage.placeholder.defaultUserAgent`);
const defaultTimeoutHelpLabel = createHelpLabel(`myPage.placeholder.defaultTimeout`);
const cacheThresholdHelpLabel = createHelpLabel(`myPage.placeholder.cacheThreshold`);
const resourceCacheTtlHelpLabel = createHelpLabel(`myPage.placeholder.resourceCacheTtl`);
const headersCacheTtlHelpLabel = createHelpLabel(`myPage.placeholder.headersCacheTtl`);
const scriptCacheTtlHelpLabel = createHelpLabel(`myPage.placeholder.scriptCacheTtl`);
const concurrencyHelpLabel = createHelpLabel(`myPage.placeholder.concurrency`);
const apiCheckTimeoutHelpLabel = createHelpLabel(`myPage.placeholder.apiCheckTimeout`);

const updateInputA11y = async () => {
  await nextTick();
  syncInnerInputA11y(githubUserInputRef.value, { label: t(`myPage.placeholder.githubUser`) });
  syncInnerInputA11y(gistTokenInputRef.value, { label: t(`myPage.placeholder.gistToken`) });
  syncInnerInputA11y(githubProxyInputRef.value, { label: t(`myPage.placeholder.githubProxy`) });
  syncInnerInputA11y(githubProxyRegexInputRef.value, { label: t(`myPage.placeholder.githubProxyRegex`) });
  syncInnerInputA11y(defaultProxyInputRef.value, { label: t(`myPage.placeholder.defaultProxy`) });
  syncInnerInputA11y(defaultUserAgentInputRef.value, { label: t(`myPage.placeholder.defaultUserAgent`) });
  syncInnerInputA11y(defaultTimeoutInputRef.value, { label: t(`myPage.placeholder.defaultTimeout`) });
  syncInnerInputA11y(cacheThresholdInputRef.value, { label: t(`myPage.placeholder.cacheThreshold`) });
  syncInnerInputA11y(resourceCacheTtlInputRef.value, { label: t(`myPage.placeholder.resourceCacheTtl`) });
  syncInnerInputA11y(headersCacheTtlInputRef.value, { label: t(`myPage.placeholder.headersCacheTtl`) });
  syncInnerInputA11y(scriptCacheTtlInputRef.value, { label: t(`myPage.placeholder.scriptCacheTtl`) });
  syncInnerInputA11y(concurrencyInputRef.value, { label: t(`myPage.placeholder.concurrency`) });
  syncInnerInputA11y(apiCheckTimeoutInputRef.value, { label: t(`myPage.placeholder.apiCheckTimeout`) });
};

const toggleEditMode = async (type) => {
  isEditLoading.value = true;
  try {
    if ((type === 'github' && isGitHubConfigEditing.value) || (type === 'request' && isRequestConfigEditing.value) || (type === 'cache' && isCacheConfigEditing.value)) {
      const saveSucceeded = await settingsStore.changeSettings({
        syncPlatform: syncPlatformInput.value,
        githubUser: userInput.value,
        gistToken: tokenInput.value,
        githubProxy: githubProxyInput.value,
        githubProxyRegex: githubProxyRegexInput.value,
        defaultUserAgent: uaInput.value,
        defaultProxy: proxyInput.value,
        defaultTimeout: timeoutInput.value,
        cacheThreshold: cacheThresholdInput.value,
        resourceCacheTtl: resourceCacheTtlInput.value,
        headersCacheTtl: headersCacheTtlInput.value,
        scriptCacheTtl: scriptCacheTtlInput.value,
      });

      if (saveSucceeded && type === 'github') {
        resetAvatarState(true);
        await settingsStore.fetchSettings();
        resetAvatarState(true);
      }

      if (saveSucceeded) {
        setDisplayInfo();
      }
    } else {
      syncPlatformInput.value = syncPlatform.value;
      userInput.value = githubUser.value;
      tokenInput.value = gistToken.value;
      githubProxyInput.value = githubProxy.value;
      githubProxyRegexInput.value = githubProxyRegex.value;
      uaInput.value = defaultUserAgent.value;
      proxyInput.value = defaultProxy.value;
      timeoutInput.value = defaultTimeout.value;
      cacheThresholdInput.value = cacheThreshold.value;
      resourceCacheTtlInput.value = resourceCacheTtl.value;
      headersCacheTtlInput.value = headersCacheTtl.value;
      scriptCacheTtlInput.value = scriptCacheTtl.value;
    }
    if (type === 'frontEnd' && isFrontEndConfigEditing.value) {
      const apiCheckTimeout = Number(apiCheckTimeoutInput.value);
      if (!isNaN(apiCheckTimeout)) {
        if (apiCheckTimeout > 0) {
          console.log(`设置超时 ${apiCheckTimeout}`)
          localStorage.setItem('timeout', apiCheckTimeout.toString());
        } else {
          console.log(`清除超时设置`)
          localStorage.removeItem('timeout');
        }
      }else {
        console.log(`清除超时设置`)
        localStorage.removeItem('timeout');
      }
      const concurrency = parseInt(concurrencyInput.value, 10);
      if (!isNaN(concurrency)) {
        if (concurrency >= 1) {
          console.log(`设置并发数 ${concurrency}`)
          localStorage.setItem('concurrency', concurrency.toString());
        } else {
          console.log(`清除并发数设置`)
          localStorage.removeItem('concurrency');
        }
      } else {
        console.log(`清除并发数设置`)
        localStorage.removeItem('concurrency');
      }
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      const storedTimeout = localStorage.getItem('timeout');
      if (storedTimeout) {
        apiCheckTimeoutInput.value = storedTimeout;
      } else {
        apiCheckTimeoutInput.value = '';
      }
      const storedConcurrency = localStorage.getItem('concurrency');
      if (storedConcurrency) {
        concurrencyInput.value = storedConcurrency;
      } else {
        concurrencyInput.value = '';
      }
    }
    if (type === 'github' && !isGitHubConfigEditing.value) {
      isGitHubConfigEditing.value = !isGitHubConfigEditing.value;
    } else if (type === 'cache' && !isCacheConfigEditing.value) {
      isCacheConfigEditing.value = !isCacheConfigEditing.value;
    } else if (type === 'request' && !isRequestConfigEditing.value) {
      isRequestConfigEditing.value = !isRequestConfigEditing.value;
    } else if (type === 'frontEnd' && !isFrontEndConfigEditing.value) {
      isFrontEndConfigEditing.value = !isFrontEndConfigEditing.value;
    }
  } catch (e) {
    showNotify({
      title: `更新配置失败`,
      type: "danger",
    });
    console.error(e);
  } finally {
    isEditLoading.value = false;
  }
};

const exitEditMode = (type) => {
  setDisplayInfo();
  if (type === 'github') {
    isGitHubConfigEditing.value = false;
  } else if (type === 'cache') {
    isCacheConfigEditing.value = false;
  } else if (type === 'request') {
    isRequestConfigEditing.value = false;
  } else {
    isFrontEndConfigEditing.value = false;
  }
  isEditLoading.value = false;
};
const toggleSyncPlatform = () => {
  if (syncPlatformInput.value === 'gitlab') {
    syncPlatformInput.value = ''
    Toast.text(`已切换到 ${syncPlatformInput.value === 'gitlab' ? 'GitLab Snippet' : 'Gist'}`);
  } else {
      Dialog({
        title: '切换同步平台',
        content: 'GitLab Snippet 正在测试中, 相关文案仍然是 Gist, 请备份数据后使用',
        popClass: 'auto-dialog',
        okText: `使用 ${syncPlatformInput.value === 'gitlab' ? 'Gist' : ' Snippet'}`,
        cancelText: '取消',
        onOk: () => {
          if (syncPlatformInput.value === 'gitlab') {
            syncPlatformInput.value = ''
          } else {
            syncPlatformInput.value = 'gitlab'
          }
          Toast.text(`已切换到 ${syncPlatformInput.value === 'gitlab' ? 'GitLab Snippet' : 'Gist'}`);
        },
        closeOnPopstate: true,
        lockScroll: false,
      });
  }

  
};
const setDisplayInfo = () => {
  syncPlatformInput.value = syncPlatform.value || "";
  userInput.value = githubUser.value || "";
  githubProxyInput.value = githubProxy.value || "";
  githubProxyRegexInput.value = githubProxyRegex.value || "";
  tokenInput.value = gistToken.value || "";
  uaInput.value = defaultUserAgent.value || "";
  proxyInput.value = defaultProxy.value || "";
  timeoutInput.value = defaultTimeout.value || "";
  cacheThresholdInput.value = cacheThreshold.value || "";
  resourceCacheTtlInput.value = resourceCacheTtl.value || "";
  headersCacheTtlInput.value = headersCacheTtl.value || "";
  scriptCacheTtlInput.value = scriptCacheTtl.value || "";
};

// 同步 上传
const downloadIsLoading = ref(false);
const uploadIsLoading = ref(false);
const restoreIsLoading = ref(false);
const syncIsDisabled = computed(() => {
  return (
    uploadIsLoading.value ||
    downloadIsLoading.value ||
    !gistToken.value ||
    !githubUser.value
  );
});

const desText = computed(() => {
  if (!gistToken.value || !githubUser.value) {
    return [t(`myPage.placeholder.des`), ""];
  } else {
    if (!syncTime.value) return [t(`myPage.placeholder.haveNotDownload`), ""];
    return [t(`myPage.placeholder.uploadTime`), butifyDate(syncTime.value)];
  }
});
const fileChange = async (event) => {
  const file = event.target.files[0];
  if(!file) return
  try {
    restoreIsLoading.value = true;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      
      const res = await useSettingsApi().restoreSettings({ content: String(reader.result) });
      if (res?.data?.status === "success") {
        await initStores(false, true, true);
        showNotify({
          type: "success",
          title: t(`myPage.notify.restore.succeed`),
        });

        if ("serviceWorker" in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
          }
        }
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          for (let cacheName of cacheNames) {
            await caches.delete(cacheName);
          }
        }
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('restore failed')
      }
    }

    reader.onerror = e => {
      throw e
    }
    
  } catch (e) {
    showNotify({
      type: "danger",
      title: t(`myPage.notify.restore.failed`),
    });
    console.error(e);
  } finally {
    restoreIsLoading.value = false;
  }
};
const upload = async() => {
  try {
    fileInput.value.click()
  } catch (e) {
    console.error(e);
  }
}

const sync = async (query: "download" | "upload", options?: { keep?: string[], encode?: 'base64' | 'plaintext' }) => {
  switch (query) {
    case "download":
      downloadIsLoading.value = true;
      break;
    case "upload":
      uploadIsLoading.value = true;
      break;
  }

  const res = await useSettingsApi().syncSettings(query, options);

  if (res?.data?.status === "success") {
    switch (query) {
      case "download":
        await initStores(false, true, true);
        break;
      case "upload":
        await useSettingsStore().fetchSettings();
        break;
    }
    showNotify({
      type: "success",
      title: t(`myPage.notify.${query}.succeed`),
    });
    if (query === "download") {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (let cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  downloadIsLoading.value = false;
  uploadIsLoading.value = false;
};

const uploadBtn = () => {
  const encode = gistUpload.value || 'base64';
  sync('upload', { encode });
  // Dialog({
  //   title: '请选择',
  //   content: '若选择明文, 将不会保留 GitHub Token. 若选择 Base64 编码, 将完整保留数据(后端版本必须 >= 2.19.85)',
  //   footerDirection: 'vertical',
  //   onCancel: () => {
  //     sync('upload', {
  //       encode: 'plaintext'
  //     });
  //   },
  //   cancelText: '明文(将不会保留 GitHub Token)',
  //   okText: 'Base64 编码上传',
  //   onOk: () => {
  //     sync('upload', {
  //       encode: 'base64'
  //     });
  //   },
  //   popClass: "auto-dialog",
  //   closeOnPopstate: true,
  //   lockScroll: false,
  // });
}
const downloadBtn = () => {
  Dialog({
    title: '请选择',
    content: '若想保留本地当前已设置的 GitHub Token, 请选择保留(后端版本必须 >= 2.19.83)',
    footerDirection: 'vertical',
    onCancel: () => {
      sync('download');
    },
    okText: '保留当前 Token, 覆盖其他数据',
    cancelText: '覆盖(可能需重新设置 Token)',
    onOk: () => {
      sync('download', {
        keep: ['settings.gistToken']
      });
    },
    popClass: "auto-dialog",
    closeOnPopstate: true,
    lockScroll: false,
  });
}
const githubProxyTips = () => {
  Dialog({
      title: '请填写完整 GitHub 加速代理地址',
      content: '后端需 >= 2.21.75 才可完整使用下方正则匹配能力\n\n1. 该代理仍用于上传/下载 Gist 和获取 GitHub 头像\n\n2. 请填写完整地址, 如 https://a.com\n\n3. 需支持代理 https://api.github.com/users/* 和 https://api.github.com/gists\n\n4. 若同时配置下方的 GitHub 加速代理匹配正则, 匹配的所有远程资源 URL 会改写为\nhttps://a.com/原始URL\n\n测试方式:\n浏览器打开\nhttps://a.com/https://api.github.com/gists?per_page=1&page=1\n和\nhttps://a.com/https://api.github.com/users/xream\n有正常的响应\n\n5. 使用此方式时, 自行注意安全隐私问题',
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const githubProxyRegexExample = '^https?:\\/\\/.+\\.(githubusercontent|github)\\.com($|\\/)';
const githubProxyRegexTips = () => {
  Dialog({
      title: '按正则匹配下载链接',
      content: `后端需 >= 2.21.75\n\n1. 需先配置上方 GitHub 加速代理, 本项才会生效\n\n2. 影响所有远程资源 URL, 不影响上面的 Gist 和头像代理逻辑\n\n3. 默认忽略大小写, 例如\n${githubProxyRegexExample}\n\n4. 会把匹配的下载地址改写为\nhttps://a.com/原始URL\n\n5. 使用此方式时, 自行注意安全隐私问题`,
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      cancelText: '填入示例正则',
      onCancel: () => {
        githubProxyRegexInput.value = githubProxyRegexExample;
        Toast.text('已填入示例正则，请自行保存', { duration: 3000 });
      },
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const proxyTips = () => {
  Dialog({
      title: '通过代理/节点/策略进行下载',
      content: '1. Surge/Egern(参数 policy/policy-descriptor)\n\n可设置节点代理 例: Test = snell, 1.2.3.4, 80, psk=password, version=4\n\n或设置策略/节点 例: 国外加速\n\n2. Loon(参数 node)\n\nLoon 官方文档: \n\n指定该请求使用哪一个节点或者策略组（可以是节点名称、策略组名称，也可以是一个 Loon 格式的节点描述，如：shadowsocksr,example.com,1070,chacha20-ietf,"password",protocol=auth_aes128_sha1,protocol-param=test,obfs=plain,obfs-param=edge.microsoft.com）\n\n3. Stash(参数 headers["X-Surge-Policy"])/Shadowrocket(参数 headers.X-Surge-Policy)/QX(参数 opts.policy)\n\n可设置策略/节点\n\n4. Node.js 版(http/https/socks5):\n\n例: socks5://a:b@127.0.0.1:7890\n\n※ 优先级由高到低: 单条订阅, 组合订阅, 默认配置',
      popClass: 'auto-dialog',
      textAlign: 'left',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const uaTips = () => {
  Dialog({
      title: '默认为 clash.meta',
      content: '可尝试设置为 clash-verge/v2.4.6, v2rayNG 等客户端的 User-Agent 让机场后端下发更多协议(可根据实际情况改成最新版本号)',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const timeoutTips = () => {
  Dialog({
      title: '可尝试设置为 3000~4000',
      content: '防止拉取结果的总时长超过代理 app 加载外部资源的最大等待时长, 确保拉取成功',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const cacheThresholdTips = () => {
  Dialog({
      title: '可尝试设置为 1024',
      content: '下载资源过大时\n若要写入缓存\n代理 app 可能会崩溃重启\n可尝试设置此值',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const resourceCacheTtlTips = () => {
  Dialog({
      title: '资源缓存时间 (秒)',
      content: '主要涉及下载订阅/下载脚本/域名解析等功能',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const headersCacheTtlTips = () => {
  Dialog({
      title: '响应头缓存时间 (秒)',
      content: '主要涉及订阅流量信息等功能',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const scriptCacheTtlTips = () => {
  Dialog({
      title: '脚本缓存时间 (秒)',
      content: '主要涉及在脚本中使用的 scriptResourceCache 缓存',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const concurrencyTips = () => {
  Dialog({
      title: '并发数',
      content: 'Shadowrocket 并发可能会爆内存, 可设为 1',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
const apiCheckTimeoutTips = () => {
  Dialog({
      title: 'API 检测超时',
      content: '某些版本的 Mac 上 QX https://sub.store/api/utils/env 可能会超时, JS 一直活跃中, 可设为 8000',
      popClass: 'auto-dialog',
      okText: 'OK',
      noCancelBtn: true,
      closeOnPopstate: true,
      lockScroll: false,
    });
};
// store 刷新数据完成后 复制内容给 input 绑定
const { isLoading: storeIsLoading, env: backendEnv } = storeToRefs(useGlobalStore());
watchEffect(() => {
  if (!storeIsLoading.value && !isInit.value) {
    setDisplayInfo();
    isInit.value = true;
  }
});
watch(
  [isGitHubConfigEditing, isRequestConfigEditing, isCacheConfigEditing, isFrontEndConfigEditing],
  () => {
    updateInputA11y();
  },
);
onMounted(() => {
  updateInputA11y();
});
const setTag = (current) => {
  storageType.value = current
};
</script>

<style lang="scss" scoped>
.my-page-wrapper {
  min-height: 100%;
  padding: var(--safe-area-side);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .profile-block {
    width: 100%;

    .radio-wrapper {
      display: flex;
      align-items: center;
      

      .tag {
        font-size: 12px;
        color: var(--second-text-color);
        margin: 0px 5px;
        padding: 7.5px 2.5px 4px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
        flex-shrink: 0;
      }
      .storage-tag {
        border: none;
        background: none;
        color: inherit;
      }
      .current {
        border-bottom: 1px solid var(--primary-color);
        color: var(--primary-color);
      }
      .storage-info {
        margin-left: auto;
        font-size: 12px;
        color: var(--lowest-text-color);
      }

    }

    .config-card {
      margin-top: 10px;
      width: 100%;
      padding: 6px 12px 6px 6px;
      border-radius: var(--item-card-radios);
      color: var(--second-text-color);
      background: var(--card-color);

      .title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 0 0 0 10px;
      }

      .config-heading {
        flex: 1;
        min-width: 0;
        margin: 0;
      }

      .title-toggle {
        width: 100%;
        padding: 8px 0 2px 0;
        border: 0;
        background: transparent;
        color: var(--primary-text-color);
        text-align: left;
        cursor: pointer;
        border-radius: 10px;
      }

      .title-toggle:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      h1,
      h2 {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .config-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .input-with-help {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-help-button {
          width: 32px;
          height: 32px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--lowest-text-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;

          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          &:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
          }
        }

        .input.nut-input-disabled {
          :deep(input):disabled {
            -webkit-text-fill-color: var(--lowest-text-color);
          }
        }

        .input {
          flex: 1;
          background: transparent;
          padding: 12px;
          color: var(--second-text-color);

          :deep(img) {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            opacity: 0.2;
            filter: brightness(var(--img-brightness));
          }
          :deep(.nut-icon-tips:before) {
            cursor: pointer;
          }

        }
      }

      .config-btn-wrapper {
        display: flex;
        justify-content: flex-end;

        .cancel-btn {
          background: transparent;
        }

        .save-btn {
          margin-left: 8px;
        }
      }
    }

    .info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0 0 0;
      margin-bottom: 20px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        max-width: 64%;

        :deep(.nut-avatar) {
          background: var(--card-color);
        }

        .avatar-fallback-shell {
          width: 72px;
          height: 72px;
          flex-shrink: 0;
          border-radius: 50%;
          background: var(--card-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-fallback-image {
          width: 72%;
          height: 72%;
          object-fit: contain;
        }

        .name {
          margin-left: 12px;
          font-size: 18px;
          font-weight: bold;
          max-width: 64%;
          display: flex;
          flex-direction: column;

          p.title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--primary-text-color);
          }

          .des {
            margin-top: 6px;
            font-size: 12px;
            font-weight: normal;
            display: flex;
            flex-direction: column;
            color: var(--comment-text-color);
          }
        }
      }

      .actions {
        margin-left: 12px;
        display: flex;
        flex-direction: column;

        svg {
          margin-right: 4px;
        }

        .upload-btn,
        .download-btn {
          padding: 0 10px;
          width: 116px;
        }

        .upload-btn {
          background: transparent;
        }

        .download-btn {
          margin-top: 12px;
        }
      }
    }

    .settings-nav-group {
      margin-top: 10px;
      border-radius: var(--item-card-radios);
      overflow: hidden;
      background: var(--card-color);
    }

    .settings-nav-button {
      width: 100%;
      min-height: 56px;
      padding: 0 16px;
      border: 0;
      background: transparent;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid var(--divider-color);
      }

      :deep(.nut-icon) {
        color: var(--comment-text-color);
      }

      &:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
    }
  }

  .env-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: var(--lowest-text-color);

    img {
      opacity: 0.4;
      width: 54px;
      height: 54px;
    }
  }
}

.nut-icon {
  color: var(--lowest-text-color);
}
</style>
