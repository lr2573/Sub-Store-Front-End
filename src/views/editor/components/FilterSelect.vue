<template>
  <div class="editor-action-card">
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
    </p>
    <div class="native-radio-group two-column" role="radiogroup" :aria-label="$t(`editorPage.subConfig.nodeActions['${type}'].des[1]`)">
      <button
        v-for="(key, index) in opt[type].mode"
        :key="index"
        type="button"
        class="native-radio-button"
        :class="{ current: mode === key }"
        role="radio"
        :aria-checked="mode === key"
        @click="mode = key"
      >{{
          $t(`editorPage.subConfig.nodeActions['${type}'].modeOptions[${index}]`)
        }}
      </button>
    </div>
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
    </p>
    <div class="checkbox-group" role="group" :aria-label="$t(`editorPage.subConfig.nodeActions['${type}'].des[0]`)">
      <label
        v-for="(item, index) in opt[type].value"
        :key="item"
        class="checkbox-option"
        :class="{ current: value.includes(item) }"
      >
        <input
          type="checkbox"
          :checked="value.includes(item)"
          @change="toggleOption(item)"
        />
        <span class="checkbox-indicator" aria-hidden="true"></span>
        <span class="item" v-if="type === 'Region Filter' && item === 'TW'">
          <img :src="tw" alt="TW flag">&nbsp;{{ item }}
        </span>
        <span v-else>{{ $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`) }}</span>
      </label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref, watch, onMounted } from 'vue';
  import tw from '@/assets/icons/tw.png';
  import semverGt from 'semver/functions/gt';
  import { useAppNotifyStore } from '@/store/appNotify';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';

  const globalStore = useGlobalStore();
  const { env } = storeToRefs(globalStore);

  const { showNotify } = useAppNotifyStore();

  const { type, id } = defineProps<{
    type: string;
    id: string;
  }>();

  const form = inject<Sub | Collection>('form');

  // 此处 key 需要与 i18n 的 actions 中的 key 相同
  // 值的次序需要与该选项的 options 值 顺序相同
  const opt = {
    'Region Filter': {
      mode: [0, 1],
      value: ['HK', 'TW', 'SG', 'JP', 'UK', 'US', 'DE', 'KR']
    },
    'Type Filter': {
      mode: [0, 1],
      value: [
        'ss',
        'ssr',
        'vmess',
        'vless',
        'trojan',
        'http',
        'socks5',
        'snell',
        'tuic',
        'hysteria',
        'hysteria2',
        'juicity',
        'mieru',
        'sudoku',
        'masque',
        'anytls',
        'trusttunnel',
        'tailscale',
        'wireguard',
        'ssh',
        'external',
        'direct'
      ]
    },
  };

  const value = ref([]);
  const mode = ref();

  // try {
  //   if(!semverGt(env.value.version, '2.16.63')) {
  //     showNotify({
  //       title: `请更新后端, 版本应大于 2.16.63`,
  //       type: 'danger',
  //     });
  //   }
  // } catch (e) {}

  // 挂载时将 value 值指针指向 form 对应的数据
  onMounted(() => {
    const item = form.process.find(item => item.id === id);
    if (item) {
      let v = item.args?.value || item.args;
      if (!Array.isArray(v)){
        v = [];
      }
      const keep = item.args?.keep ?? true;
      item.args = { keep, value: v };
      value.value = item.args.value;
      mode.value = item.args.keep ? 0 : 1;
    }
  });

  watch(mode, () => {
    const item = form.process.find(item => item.id === id);
    item.args.keep = !mode.value;
  });
  const toggleOption = (option) => {
    const current = Array.isArray(value.value) ? [...value.value] : [];
    const index = current.indexOf(option);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(option);
    }
    value.value = current;
  };
</script>

<style lang="scss" scoped>
  .des-label {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--comment-text-color);

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
  .checkbox-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 8px;

    .checkbox-option {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--second-text-color);
    }

    .checkbox-option input {
      position: absolute;
      opacity: 0;
      width: 1px;
      height: 1px;
    }

    .checkbox-indicator {
      width: 16px;
      height: 16px;
      border: 1px solid var(--lowest-text-color);
      border-radius: 4px;
      flex-shrink: 0;
      position: relative;
    }

    .checkbox-option.current .checkbox-indicator {
      border-color: var(--primary-color);
      background: var(--primary-color);
    }

    .checkbox-option.current .checkbox-indicator::after {
      content: "";
      position: absolute;
      left: 5px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-option input:focus-visible + .checkbox-indicator {
      outline: 3px solid var(--primary-color);
      outline-offset: 3px;
    }

    .item {
      display: flex;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
    }

  }

  .native-radio-group {
    width: 100%;
    display: grid;
    gap: 8px;
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
</style>
