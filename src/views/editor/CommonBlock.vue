<template>
  <div class="form-block-wrapper">
    <div class="sticky-title-wrapper">
      <button type="button" class="title icon-button-reset" :aria-expanded="!isFold" @click="toggleFold">
        <p>
          {{ $t(`editorPage.subConfig.commonOptions.label`) }}
        </p>
        <nut-icon v-if="!isFold" name="rect-down" size="12px"></nut-icon>
        <nut-icon v-else name="rect-right" size="12px"></nut-icon>
      </button>
    </div>
    <nut-form v-if="!isFold" class="form">
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.useless.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <div
            class="native-radio-group two-column"
            role="radiogroup"
            :aria-label="$t(`editorPage.subConfig.commonOptions.useless.label`)"
          >
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.useless === item[2] }"
              role="radio"
              :aria-checked="quick.args.useless === item[2]"
              @click="quick.args.useless = item[2]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.useless.disabled`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.useless === item[1] }"
              role="radio"
              :aria-checked="quick.args.useless === item[1]"
              @click="quick.args.useless = item[1]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.useless.enabled`) }}
            </button>
          </div>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.udp.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <div
            class="native-radio-group"
            role="radiogroup"
            :aria-label="$t(`editorPage.subConfig.commonOptions.udp.label`)"
          >
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.udp === item[0] }"
              role="radio"
              :aria-checked="quick.args.udp === item[0]"
              @click="quick.args.udp = item[0]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.udp.default`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.udp === item[1] }"
              role="radio"
              :aria-checked="quick.args.udp === item[1]"
              @click="quick.args.udp = item[1]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.udp.enabled`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.udp === item[2] }"
              role="radio"
              :aria-checked="quick.args.udp === item[2]"
              @click="quick.args.udp = item[2]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.udp.disabled`) }}
            </button>
          </div>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.scert.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <div
            class="native-radio-group"
            role="radiogroup"
            :aria-label="$t(`editorPage.subConfig.commonOptions.scert.label`)"
          >
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.scert === item[0] }"
              role="radio"
              :aria-checked="quick.args.scert === item[0]"
              @click="quick.args.scert = item[0]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.scert.default`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.scert === item[1] }"
              role="radio"
              :aria-checked="quick.args.scert === item[1]"
              @click="quick.args.scert = item[1]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.scert.enabled`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.scert === item[2] }"
              role="radio"
              :aria-checked="quick.args.scert === item[2]"
              @click="quick.args.scert = item[2]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.scert.disabled`) }}
            </button>
          </div>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions.tfo.label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <div
            class="native-radio-group"
            role="radiogroup"
            :aria-label="$t(`editorPage.subConfig.commonOptions.tfo.label`)"
          >
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.tfo === item[0] }"
              role="radio"
              :aria-checked="quick.args.tfo === item[0]"
              @click="quick.args.tfo = item[0]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.tfo.default`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.tfo === item[1] }"
              role="radio"
              :aria-checked="quick.args.tfo === item[1]"
              @click="quick.args.tfo = item[1]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.tfo.enabled`) }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args.tfo === item[2] }"
              role="radio"
              :aria-checked="quick.args.tfo === item[2]"
              @click="quick.args.tfo = item[2]"
            >
              {{ $t(`editorPage.subConfig.commonOptions.tfo.disabled`) }}
            </button>
          </div>
        </div>
      </nut-form-item>
      <nut-form-item>
        <p class="options-label">
          {{ $t(`editorPage.subConfig.commonOptions['vmess aead'].label`) }}
        </p>
        <div class="radio-wrapper options-radio">
          <div
            class="native-radio-group"
            role="radiogroup"
            :aria-label="$t(`editorPage.subConfig.commonOptions['vmess aead'].label`)"
          >
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args['vmess aead'] === item[0] }"
              role="radio"
              :aria-checked="quick.args['vmess aead'] === item[0]"
              @click="quick.args['vmess aead'] = item[0]"
            >
              {{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].default`)
              }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args['vmess aead'] === item[1] }"
              role="radio"
              :aria-checked="quick.args['vmess aead'] === item[1]"
              @click="quick.args['vmess aead'] = item[1]"
            >
              {{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].enabled`)
              }}
            </button>
            <button
              type="button"
              class="native-radio-button"
              :class="{ current: quick.args['vmess aead'] === item[2] }"
              role="radio"
              :aria-checked="quick.args['vmess aead'] === item[2]"
              @click="quick.args['vmess aead'] = item[2]"
            >
              {{
                $t(`editorPage.subConfig.commonOptions['vmess aead'].disabled`)
              }}
            </button>
          </div>
        </div>
      </nut-form-item>
    </nut-form>
  </div>
  <!--<div class="form-block-wrapper">-->
  <!--  <div class="sticky-title-wrapper">-->
  <!--    <p>-->
  <!--      {{ $t(`editorPage.subConfig.surgeOptions.label`) }}-->
  <!--    </p>-->
  <!--  </div>-->
  <!--  <nut-form class="form">-->
  <!--    <nut-form-item>-->
  <!--      <p class="options-label">-->
  <!--        {{ $t(`editorPage.subConfig.surgeOptions.hybrid.label`) }}-->
  <!--      </p>-->
  <!--      <div class="radio-wrapper options-radio">-->
  <!--        <nut-radiogroup-->
  <!--          direction="horizontal"-->
  <!--          v-model="options['surge-hybrid']"-->
  <!--        >-->
  <!--          <nut-radio label="DEFAULT"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.default`) }}-->
  <!--          </nut-radio>-->
  <!--          <nut-radio label="FORCE_OPEN"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.open`) }}-->
  <!--          </nut-radio>-->
  <!--          <nut-radio label="FORCE_CLOSE"-->
  <!--            >{{ $t(`editorPage.subConfig.surgeOptions.hybrid.close`) }}-->
  <!--          </nut-radio>-->
  <!--        </nut-radiogroup>-->
  <!--      </div>-->
  <!--    </nut-form-item>-->
  <!--  </nut-form>-->
  <!--</div>-->
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { inject, watchEffect, ref } from 'vue';
  const route = useRoute();

  const storageKey = 'common-block-fold';

  function getFoldState() {
    let states = []
    try {
      let raw = localStorage.getItem(storageKey)
      states = raw ? JSON.parse(raw) : []
      if (!Array.isArray(states)) {
        states = []
      }
    } catch (e) {}

    

    return states.find(item => item.path === route.path)?.isFold ? true : false;
  }
  function setFoldState(isFold) {
    let states = []
    try {
      let raw = localStorage.getItem(storageKey)
      states = raw ? JSON.parse(raw) : []
      if (!Array.isArray(states)) {
        states = []
      }
    } catch (e) {}
    states = states.filter((state) => state.path !== route.path && state.isFold);
    if (isFold) {
      states.unshift({ path: route.path, isFold: 1 });
      if (states.length > 50) {
        states.pop();
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(states));
  }
  const isFold = ref(getFoldState());

  const item = ['DEFAULT', 'ENABLED', 'DISABLED'];
  const createDefaultQuickArgs = () => ({
    useless: 'DISABLED',
    udp: 'DEFAULT',
    scert: 'DEFAULT',
    tfo: 'DEFAULT',
    'vmess aead': 'DEFAULT',
  });

  const form = inject<Sub | Collection>('form');
  if (!Array.isArray(form.process)) {
    form.process = [];
  }
  const quick = form.process.find(
    item => item.type === 'Quick Setting Operator'
  ) || (() => {
    const item = {
      type: 'Quick Setting Operator',
      args: createDefaultQuickArgs(),
    };
    form.process.unshift(item);
    return item;
  })();
  const toggleFold = () => {
    isFold.value = !isFold.value;
    setFoldState(isFold.value)
  };
  watchEffect(() => {
    if (!quick.args) {
      quick.args = createDefaultQuickArgs();
    }
  });
</script>

<style lang="scss" scoped>
  .form-block-wrapper {
    .sticky-title-wrapper {
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        p {
          margin-right: 6px;
        }
        :deep(.nut-icon) {
          // transform: rotate(270deg);
          font-size: 12px;
          height: 12px;
        }
      }
    }
  }
  .options-label {
    font-size: 12px;
    margin-bottom: 16px;
    color: var(--comment-text-color);
  }

  .radio-wrapper.options-radio {
    justify-content: start;

    .native-radio-group {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }

    .native-radio-group.two-column {
      grid-template-columns: 1fr 1fr;
    }
  }

  .radio-wrapper {
    display: flex;
    justify-content: flex-end;
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
