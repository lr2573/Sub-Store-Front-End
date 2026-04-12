<template>
  <div class="editor-action-card">
    <template v-if="type === 'Regex Filter'">
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
      </p>
      <div class="native-radio-group three-column" role="radiogroup" :aria-label="$t(`editorPage.subConfig.nodeActions['${type}'].des[1]`)">
        <button
          v-for="(key, index) in opt[type]"
          :key="index"
          type="button"
          class="native-radio-button"
          :class="{ current: mode === key }"
          role="radio"
          :aria-checked="mode === key"
          @click="mode = key"
        >
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`) }}
        </button>
      </div>
    </template>
    <template v-if="type === 'Regex Sort Operator'">
      <p class="des-label">
        {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[1]`) }}
      </p>
      <div class="native-radio-group three-column" role="radiogroup" :aria-label="$t(`editorPage.subConfig.nodeActions['${type}'].des[1]`)">
        <button
          v-for="(key, index) in opt[type]"
          :key="index"
          type="button"
          class="native-radio-button"
          :class="{ current: mode === key }"
          role="radio"
          :aria-checked="mode === key"
          @click="mode = key"
        >
          {{ $t(`editorPage.subConfig.nodeActions['${type}'].options[${index}]`) }}
        </button>
      </div>
    </template>
    <p class="des-label">
      {{ $t(`editorPage.subConfig.nodeActions['${type}'].des[0]`) }}
    </p>
    <div class="tag-wrapper">
      <draggable
        item-key="id"
        v-model="dragData"
        :force-fallback="true"
        :scroll="true"
        v-bind="{
          chosenClass: 'chosentag',
        }"
      >
        <template #item="{ element, index }">
          <nut-tag
            role="button"
            tabindex="0"
            class="tag-item"
            closeable
            @click="onClickTag(index)"
            @keydown="onKeyboardActivate($event, () => onClickTag(index))"
            @close="deleteRegexItem(index)"
          >
            <span>
              {{
                type === 'Regex Rename Operator'
                  ? `${element.value.expr} -> ${element.value.now}`
                  : element.value
              }}
            </span>
          </nut-tag>
        </template>
      </draggable>
    </div>
    <div class="input-wrapper">
      <nut-input
        v-model="input1"
        class="custom-input"
        label=""
        :placeholder="$t(`editorPage.subConfig.nodeActions['${type}'].placeholder[0]`)"
      />
      <nut-input
        v-if="type === 'Regex Rename Operator'"
        v-model="input2"
        label=""
        :placeholder="$t(`editorPage.subConfig.nodeActions['${type}'].placeholder[1]`)"
      />
      <button
        type="button"
        class="icon-button-reset add-item-button"
        aria-label="Add regex item"
        title="Add regex item"
        @click="addItem"
      >
        <font-awesome-icon icon="fa-solid fa-location-arrow" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Dialog } from "@nutui/nutui";
import { computed, inject, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onBeforeRouteLeave } from "vue-router";
import draggable from "vuedraggable";

import { onKeyboardActivate } from "@/hooks/useA11y";

const { t } = useI18n();
const { type, id } = defineProps<{
  type: string;
  id: string;
}>();

const form = inject<Sub | Collection>("form");

const opt = {
  "Regex Filter": [0, 1],
  "Regex Sort Operator": ["asc", "desc", "original"],
};

const input1 = ref("");
const input2 = ref("");
const mode = ref();
const value = ref();
const dragData = computed({
  get() {
    return Array.isArray(value.value)
      ? value.value.map((item, index) => ({
          id: index + JSON.stringify(item),
          value: item,
        }))
      : [];
  },
  set(val) {
    val.map((item, index) => {
      value.value[index] = item.value;
    });
  },
});

const onClickTag = (index) => {
  if (input1.value || input2.value) {
    Dialog({
      title: t("editorPage.subConfig.pop.clickTag.title"),
      content: t("editorPage.subConfig.pop.clickTag.content"),
      popClass: "auto-dialog",
      okText: t("editorPage.subConfig.pop.clickTag.confirm"),
      cancelText: t("editorPage.subConfig.pop.clickTag.cancel"),
      onOk: () => editTag(index),
      closeOnClickOverlay: true,
    });
  } else {
    editTag(index);
  }
};

const editTag = (index) => {
  const oldValue = value.value[index];

  value.value.splice(index, 1);
  if (type === "Regex Rename Operator") {
    input1.value = oldValue.expr;
    input2.value = oldValue.now;
  } else {
    input1.value = oldValue;
  }
};

const deleteRegexItem = (index) => {
  value.value.splice(index, 1);
};

const addItem = () => {
  if (!input1.value) return;
  if (type === "Regex Rename Operator") {
    value.value.push({
      expr: input1.value,
      now: input2.value,
    });
  } else {
    value.value.push(input1.value);
  }
  input1.value = "";
  input2.value = "";
};

onMounted(() => {
  const item = form.process.find((item) => item.id === id);
  if (item) {
    switch (type) {
      case "Regex Filter":
        value.value = item.args.regex;
        mode.value = item.args.keep ? 0 : 1;
        break;
      case "Regex Sort Operator": {
        const order = item.args?.order || "asc";
        let expressions = item.args?.expressions;
        if (Array.isArray(item.args)) {
          expressions = item.args;
        }
        if (!Array.isArray(expressions)) {
          expressions = [];
        }
        item.args = { order, expressions };
        value.value = item.args.expressions;
        mode.value = item.args.order;
        break;
      }
      default:
        value.value = item.args;
        break;
    }
  }
});

watch(mode, () => {
  const item = form.process.find((item) => item.id === id);
  if (item && type === "Regex Filter") {
    item.args.keep = !mode.value;
  }
  if (item && type === "Regex Sort Operator") {
    item.args.order = mode.value;
  }
});

const confirmLeave = () => {
  return new Promise((resolve) => {
    Dialog({
      title: t("editorPage.subConfig.pop.leaveConfirmTitle"),
      content: t("editorPage.subConfig.pop.leaveContent"),
      popClass: "auto-dialog",
      okText: t("editorPage.subConfig.pop.leaveConfirm"),
      cancelText: t("editorPage.subConfig.pop.leaveCancel"),
      onOk: () => {
        resolve(true);
      },
      onCancel: () => resolve(false),
      closeOnClickOverlay: true,
    });
  });
};

onBeforeRouteLeave(async (to, from, next) => {
  if (input1.value || input2.value) {
    const result = await confirmLeave();
    next(result);
    return;
  }
  next();
});
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

.native-radio-group {
  width: 100%;
  display: grid;
  gap: 8px;
}

.native-radio-group.three-column {
  grid-template-columns: 1fr 1fr 1fr;
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

.tag-wrapper {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin-bottom: 12px;
  max-width: 100%;
  cursor: pointer;

  &:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .tag-item {
    max-width: 100%;
    margin-right: 8px;
    margin-bottom: 8px;

    span {
      max-width: 95%;
      min-width: 20px;
      display: -webkit-box;
      white-space: normal !important;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}

.chosentag {
  box-shadow: 0 0 5px var(--primary-color);
  overflow: hidden;
}

.input-wrapper {
  display: flex;
  align-items: center;

  > view.nut-input {
    background: transparent;
    padding: 8px 12px;
    margin-right: 16px;
  }

  .add-item-button {
    width: 20px;
    height: 20px;
    color: var(--primary-color);
    flex: 1;
    padding-right: 12px;
  }
}
</style>
