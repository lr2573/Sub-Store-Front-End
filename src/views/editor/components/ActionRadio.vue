<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des`) }}
    </p>
    <div class="radio-wrapper options-radio">
      <div
        class="native-radio-group three-column"
        role="radiogroup"
        :aria-label="$t(`editorPage.subConfig.nodeActions['${type}'].des`)"
      >
        <button
          v-for="(key, index) in opt[type]"
          :key="index"
          type="button"
          class="native-radio-button"
          :class="{ current: value === key }"
          role="radio"
          :aria-checked="value === key"
          @click="value = key"
        >
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`) }}
        </button>
      </div>
      <div
        v-if="type === 'Resolve Domain Operator' && value === 'Custom'"
        class="input-wrapper custom-value-input"
      >
        <nut-input placeholder="DoH URL" v-model="rdoUrl" />
      </div>
    </div>
    <template v-if="type === 'Resolve Domain Operator' && rdoNewVersion">
      <div class="radio-wrapper options-radio">
        <p class="des-label">EDNS</p>
        <div class="input-wrapper">
          <nut-input placeholder="IP address, default 223.6.6.6" v-model="rdoEdns" />
        </div>
      </div>
      <div class="radio-wrapper options-radio">
        <button type="button" class="des-label info-trigger" @click="rdoTypeInfo">
          Resolve type (IPv6 compatible with IP4P <font-awesome-icon icon="fa-solid fa-circle-question" />)
        </button>
        <div class="native-radio-group two-column" role="radiogroup" aria-label="Resolve type">
          <button
            v-for="(key, index) in rdoTypeOpt"
            :key="index"
            type="button"
            class="native-radio-button"
            :class="{ current: rdoType === key }"
            role="radio"
            :aria-checked="rdoType === key"
            @click="rdoType = key"
          >
            {{ $t(`editorPage.subConfig.nodeActions['${type}'].types[${index}]`) }}
          </button>
        </div>
      </div>

      <div class="radio-wrapper options-radio">
        <p class="des-label">Filter result</p>
        <div class="native-radio-group three-column" role="radiogroup" aria-label="Filter result">
          <button
            v-for="(key, index) in rdoFilterOpt"
            :key="index"
            type="button"
            class="native-radio-button"
            :class="{ current: rdoFilter === key }"
            role="radio"
            :aria-checked="rdoFilter === key"
            @click="rdoFilter = key"
          >
            {{ $t(`editorPage.subConfig.nodeActions['${type}'].filters[${index}]`) }}
          </button>
        </div>
      </div>
      <div class="radio-wrapper options-radio">
        <p class="des-label">Cache</p>
        <div class="native-radio-group two-column" role="radiogroup" aria-label="Cache">
          <button
            v-for="(key, index) in rdoCacheOpt"
            :key="index"
            type="button"
            class="native-radio-button"
            :class="{ current: rdoCache === key }"
            role="radio"
            :aria-checked="rdoCache === key"
            @click="rdoCache = key"
          >
            {{ $t(`editorPage.subConfig.nodeActions['${type}'].cache[${index}]`) }}
          </button>
        </div>
      </div>
    </template>
    <template v-if="type === 'Flag Operator' && foNewVersion && value === 'add'">
      <div class="radio-wrapper options-radio">
        <button type="button" class="des-label flag-operator info-trigger" @click="showTwTips">
          <span>Flag</span>
          <img :src="tw" alt="TW flag" />
          <span>tips</span>
          <nut-icon name="tips" size="12px"></nut-icon>
        </button>
        <div class="native-radio-group three-column" role="radiogroup" aria-label="Flag">
          <button
            v-for="(key, index) in foTwOpt"
            :key="index"
            type="button"
            class="native-radio-button"
            :class="{ current: foTw === key }"
            role="radio"
            :aria-checked="foTw === key"
            @click="foTw = key"
          >
            {{ $t(`editorPage.subConfig.nodeActions['${type}'].twOptions[${index}]`) }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Dialog, Toast } from "@nutui/nutui";
import { inject, onMounted, ref, watch } from "vue";

import tw from "@/assets/icons/tw.png";
import { useAppNotifyStore } from "@/store/appNotify";

const { showNotify } = useAppNotifyStore();

const { type, id } = defineProps<{
  type: string;
  id: string;
}>();

const form = inject<Sub | Collection>("form");

const opt = {
  "Flag Operator": ["add", "remove"],
  "Sort Operator": ["asc", "desc", "random"],
  "Resolve Domain Operator": ["Google", "IP-API", "Cloudflare", "Ali", "Tencent", "Custom"],
};

const foTwOpt = ["cn", "ws", "tw"];
const rdoTypeOpt = ["IPv4", "IPv6"];
const rdoFilterOpt = ["disabled", "removeFailed", "IPOnly", "IPv4Only", "IPv6Only"];
const rdoCacheOpt = ["enabled", "disabled"];

const value = ref();
const rdoNewVersion = ref(true);
const foNewVersion = ref(true);
const foTw = ref("cn");
const rdoType = ref("IPv4");
const rdoFilter = ref("disabled");
const rdoCache = ref("enabled");
const rdoUrl = ref("");
const rdoEdns = ref("");

const showTwTips = () => {
  Toast.text("Emoji flag replacement only affects display.");
};
const rdoTypeInfo = () => {
  Dialog({
    title: "IP4P format",
    content:
      "When IPv6 is selected, IP4P addresses are converted automatically. See NATMap documentation for details.",
    popClass: "auto-dialog",
    okText: "More",
    cancelText: "Cancel",
    closeOnClickOverlay: true,
    onOk: async () => {
      window.open("https://github.com/heiher/natmap/wiki/faq#%E5%9F%9F%E5%90%8D%E8%AE%BF%E9%97%AE%E6%98%AF%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E7%9A%84");
    },
    closeOnPopstate: true,
    lockScroll: false,
  });
};

onMounted(() => {
  const item = form.process.find((item) => item.id === id);

  if (item) {
    switch (type) {
      case "Flag Operator":
        value.value = item.args?.mode ?? "add";
        foTw.value = item.args?.tw ?? "cn";
        break;
      case "Sort Operator":
        value.value = item.args ?? "asc";
        break;
      case "Resolve Domain Operator":
        value.value = item.args?.provider ?? "Google";
        rdoType.value = item.args?.type ?? "IPv4";
        if (rdoType.value === "IP4P") {
          rdoType.value = "IPv6";
        }
        rdoFilter.value = item.args?.filter ?? "disabled";
        rdoCache.value = item.args?.cache ?? "enabled";
        rdoUrl.value = item.args?.url ?? "";
        rdoEdns.value = item.args?.edns;
        break;
    }
  }
});

watch([value, rdoFilter, rdoCache, rdoUrl, rdoEdns, rdoType, foTw], () => {
  if (["IPv6", "IP4P"].includes(rdoType.value) && ["IP-API"].includes(value.value)) {
    showNotify({
      title: `${value.value} does not support ${rdoType.value}`,
      type: "danger",
    });
  }
  const item = form.process.find((item) => item.id === id);
  switch (type) {
    case "Flag Operator":
      item.args = {
        mode: value.value,
        tw: foTw.value,
      };
      break;
    case "Sort Operator":
      item.args = value.value;
      break;
    case "Resolve Domain Operator":
      item.args = {
        provider: value.value,
        type: rdoType.value,
        filter: rdoFilter.value,
        cache: rdoCache.value,
        url: rdoUrl.value,
        edns: rdoEdns.value,
      };
      break;
  }
});
</script>

<style lang="scss" scoped>
.des-label {
  font-size: 12px;
  margin-bottom: 8px;
  color: var(--comment-text-color);

  &.info-trigger {
    background: none;
    border: none;
    padding: 0;
    text-align: left;
  }

  &.flag-operator {
    display: flex;
    align-items: center;

    img {
      width: 14px;
      height: 14px;
    }

    span {
      margin: 0 4px;
    }
  }
}

.native-radio-group {
  width: 100%;
  display: grid;
  gap: 8px;
}

.native-radio-group.three-column {
  grid-template-columns: 1fr 1fr 1fr;
}

.native-radio-group.two-column {
  grid-template-columns: 1fr 1fr;
}

.native-radio-button {
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 7px 10px;
  background: var(--divider-color);
  color: var(--second-text-color);
  text-align: center;
}

.native-radio-button.current {
  border-color: var(--primary-color);
  background: transparent;
  color: var(--primary-color);
}

.input-wrapper {
  display: flex;
  align-items: center;

  > view.nut-input {
    background: transparent;
    padding: 8px 12px;
    margin-right: 16px;
    border-bottom: 1px solid var(--lowest-text-color);
    color: var(--second-text-color);
  }
}

.custom-value-input {
  margin-top: 12px;
}
</style>
