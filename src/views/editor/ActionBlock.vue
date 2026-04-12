<template>
  <div class="form-block-wrapper">
    <div v-if="sourceType !== 'file'" class="sticky-title-wrapper actions-title-wrapper">
      <p>{{ $t(`editorPage.subConfig.actions.label`) }}</p>
      <button
        type="button"
        class="icon-button-reset toggle-button"
        :aria-label="getGlobalCollapseLabel()"
        :title="getGlobalCollapseLabel()"
        @click.stop="setCollapsed(!isCollapsed)"
      >
        <font-awesome-icon
          v-if="isCollapsed"
          class="toggle fa-toggle"
          icon="fa-solid fa-toggle-on "
        />
        <font-awesome-icon
          v-else
          class="toggle fa-toggle"
          icon="fa-solid fa-toggle-off"
        />
      </button>
      <button
        type="button"
        :aria-label="$t(`editorPage.subConfig.basic.nodeActionsHelp`)"
        :title="$t(`editorPage.subConfig.basic.nodeActionsHelp`)"
        @click="popActionsHelp"
      >
        <font-awesome-icon icon="fa-solid fa-circle-question" />
        {{ $t(`editorPage.subConfig.basic.nodeActionsHelp`) }}
      </button>
    </div>
    <Draggable
      v-if="list.length > 0"
      class="list-group"
      tag="ul"
      :component-data="{
        tag: 'ul',
        name: drag ? 'flip-list' : null,
      }"
      :scroll-sensitivity="200"
      :force-fallback="true"
      :scroll="true"
      :list="list"
      :scrollSpeed="8"
      v-bind="{
        animation: 200,
        disabled: false,
        ghostClass: 'ghost',
        chosenClass: 'chosen',
        dragClass: 'dragging',
        delay: 150,
        handle: '.drag-handler',
      }"
      @end="drag = false"
      @start="drag = true"
      item-key="id"
    >
      <template #item="{ element, index }">
        <nut-cell class="list-group-item">
          <div :class="{ 'list-group-item-title': true, 'collapsed': collapsedElements.includes(element.id) }">
            <div class="title-text left">
              <button
                type="button"
                class="icon-button-reset collapsed-toggle"
                :aria-expanded="!collapsedElements.includes(element.id)"
                :aria-label="getCollapseLabel(element)"
                :title="getCollapseLabel(element)"
                @click="toggleElementCollapsed(element.id)"
              >
                <nut-icon v-if="!collapsedElements.includes(element.id)" name="rect-down" size="12px"></nut-icon>
                <nut-icon v-if="collapsedElements.includes(element.id)" name="rect-right" size="12px"></nut-icon>
              </button>
              <div class="input-wrapper">
                <nut-input
                  :id="`action-input-${element.id}`"
                  @click.stop
                  v-model="findEditItemById(element).customName"
                  class="custom-name-input"
                  type="text"
                  :readonly="!findEditItemById(element).isEditing"
                  :placeholder="findEditItemById(element).defaultName"
                  @blur="saveEditName(element)"
                  @keyup.enter="saveEditName(element)"
                  @click="toggleInput(element)"
                >
                  <!-- <template #button>
                    <div class="list-group-item-icons">
                      <template v-if="!findEditItemById(element).isEditing">
                        <font-awesome-icon icon="fa-solid fa-pen-to-square" @click.stop="toggleEditName(element)" />
                      </template>
                      <template v-else>
                        <font-awesome-icon icon="fa-solid fa-floppy-disk" @click.stop="saveEditName(element)" />
                        <font-awesome-icon icon="fa-solid fa-ban" @click.stop="exitEditName(element)" />
                      </template>
                      <font-awesome-icon icon="fa-solid fa-circle-question" @click.stop="pop(element.type, element.tipsDes)" />
                    </div>
                  </template> -->
                </nut-input>
                <!-- <div
                  v-if="!findEditItemById(element).isEditing"
                  class="input-overlay"
                  @click="toggleElementCollapsed(element.id)"
                ></div> -->
              </div>
              <!-- <div class="list-group-item-icons">
                <template v-if="!findEditItemById(element).isEditing">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" @click.stop="toggleEditName(element)" />
                </template>
                <template v-else>
                  <font-awesome-icon icon="fa-solid fa-floppy-disk" @click.stop="saveEditName(element)" />
                  <font-awesome-icon icon="fa-solid fa-ban" @click.stop="exitEditName(element)" />
                </template>
                <font-awesome-icon icon="fa-solid fa-circle-question" @click.stop="pop(element.type, element.tipsDes)" />
              </div> -->
            </div>
            <div class="right">
              <div class="list-group-item-icons icon-button__input">
                <template v-if="!findEditItemById(element).isEditing">
                  <button
                    type="button"
                    class="icon-button-reset"
                    :aria-label="getEditLabel(element)"
                    :title="getEditLabel(element)"
                    @click.stop="toggleEditName(element)"
                  >
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                  </button>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="icon-button-reset"
                    :aria-label="getSaveLabel(element)"
                    :title="getSaveLabel(element)"
                    @click.stop="saveEditName(element)"
                  >
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" />
                  </button>
                  <button
                    type="button"
                    class="icon-button-reset"
                    :aria-label="getCancelEditLabel(element)"
                    :title="getCancelEditLabel(element)"
                    @click.stop="exitEditName(element)"
                  >
                    <font-awesome-icon icon="fa-solid fa-ban" />
                  </button>
                </template>
              </div>
              <div class="action-switch">
                <button
                  type="button"
                  class="native-switch"
                  role="switch"
                  :aria-checked="element.enabled"
                  :aria-label="getEnabledLabel(element)"
                  @click="toggleActionSwitch(element.id)"
                >
                  <span class="native-switch__track" :class="{ active: element.enabled }">
                    <span class="native-switch__thumb"></span>
                  </span>
                </button>
                <button
                  type="button"
                  class="icon-button-reset switch-label-button"
                  :aria-pressed="element.enabled"
                  :aria-label="getEnabledLabel(element)"
                  :title="getEnabledLabel(element)"
                  @click="toggleActionSwitch(element.id)"
                >
                  {{ $t(`editorPage.subConfig.actions.enable`) }}
                </button>
              </div>
              <div class="preview-switch">
                <button
                  type="button"
                  class="native-switch"
                  role="switch"
                  :aria-checked="getItem(element.id)[1]"
                  :aria-label="getPreviewLabel(element)"
                  @click="togglePreviewSwitch(element.id)"
                >
                  <span class="native-switch__track" :class="{ active: getItem(element.id)[1] }">
                    <span class="native-switch__thumb"></span>
                  </span>
                </button>
                <button
                  type="button"
                  class="icon-button-reset switch-label-button"
                  :aria-pressed="getItem(element.id)[1]"
                  :aria-label="getPreviewLabel(element)"
                  :title="getPreviewLabel(element)"
                  @click="togglePreviewSwitch(element.id)"
                >
                  {{ $t(`editorPage.subConfig.basic.previewSwitch`) }}
                </button>
              </div>
              <div class="icon-button">
                <button
                  type="button"
                  class="icon-button-reset"
                  :aria-label="getHelpLabel(element)"
                  :title="getHelpLabel(element)"
                  @click.stop="pop(element.type, element.tipsDes)"
                >
                  <font-awesome-icon icon="fa-solid fa-circle-question" />
                </button>
              </div>
              <div class="icon-button">
                <button
                  type="button"
                  class="icon-button-reset"
                  :aria-label="getCopyLabel(element)"
                  :title="getCopyLabel(element)"
                  @click="copyItem(element)"
                >
                  <font-awesome-icon icon="fa-solid fa-clone"></font-awesome-icon>
                </button>
              </div>
              <div class="delete">
                <button
                  type="button"
                  class="icon-button-reset delete-button"
                  :aria-label="getDeleteLabel(element)"
                  :title="getDeleteLabel(element)"
                  @click="deleteItem(element.id)"
                >
                  <font-awesome-icon icon="fa-solid fa-trash-can" />
                </button>
              </div>
              <div class="drag-handler">
                <font-awesome-icon icon="fa-solid fa-grip" class="fa-lg" />
              </div>
            </div>
          </div>
          <Component v-show="!collapsedElements.includes(element.id)" :is="element.component" :type="element.type" :id="element.id" :sourceType="sourceType"/>
        </nut-cell>
      </template>
    </Draggable>

    <!-- <nut-picker
      v-model:visible="showAddPicker"
      :columns="columns"
      :title="$t(`editorPage.subConfig.actions.addAction.title`)"
      :cancel-text="$t(`editorPage.subConfig.actions.addAction.cancel`)"
      :ok-text="$t(`editorPage.subConfig.actions.addAction.confirm`)"
      @confirm="confirm"
    ></nut-picker> -->

    <!-- <button class="add-action-btn" @click="onClickAddBtn"> -->
    <!-- <span class="add-action-btn"
        ><font-awesome-icon icon="fa-icon fa-plus" />{{
          $t(`editorPage.subConfig.actions.addAction.title`)
        }}</span
      > -->
    <!-- </button> -->

    <nut-cell class="list-group-itemsa">
      <div class="list-group-item-titlesa">
        <!-- <div class="title-text left"> -->
        <span>{{
          $t(`editorPage.subConfig.actions.addAction.title`)
        }}</span>
        <button
          v-if="sourceType !== 'file'"
          type="button"
          class="icon-button-reset add-action-help-button"
          :aria-label="$t(`editorPage.subConfig.basic.nodeActionsHelp`)"
          :title="$t(`editorPage.subConfig.basic.nodeActionsHelp`)"
          @click="popActionsHelp"
        >
          <font-awesome-icon icon="fa-solid fa-circle-question" />
        </button>
      </div>
      <div class="horizontal-button-container">
        <button v-for="(item, index) in columns" :key="index" type="button" @click="onButtonClick(item)" class="custom-button">
          {{ item.text }}
        </button>
        <button type="button" @click="paste" class="custom-button">
          {{ $t(`editorPage.subConfig.actions.pasteAction.label`) }}
        </button>
      </div>
    </nut-cell>
    <nut-form v-if="showPasteboard" class="paste-action">
      <nut-form-item>
        <nut-textarea
          class="textarea-wrapper"
          v-model="pasteboard"
          :autosize="{ maxHeight: 110, minHeight: 50 }"
          :placeholder="$t(`editorPage.subConfig.actions.pasteAction.placeholder`)"
          text-align="center"
        />
        <div class="horizontal-button-container">
          <button type="button" @click="cancelPaste" class="custom-button">
            {{ $t(`editorPage.subConfig.actions.addAction.cancel`) }}
          </button>
          <button type="button" @click="paste" class="custom-button">
            {{ $t(`editorPage.subConfig.actions.pasteAction.label`) }}
          </button>
        </div>
      </nut-form-item>
  </nut-form>
  </div>
</template>

<script lang="ts" setup>
// import { useMousePicker } from '@/hooks/useMousePicker';
import i18nFile from '@/locales/zh';
import { Dialog, Toast } from '@nutui/nutui';
import { ref, inject, reactive, watch, nextTick, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Draggable from 'vuedraggable';
import { useClipboard } from '@vueuse/core';
import useV3Clipboard from "vue-clipboard3";
// const { copy, isSupported, text } = useClipboard({ read: true });
const { copy, isSupported } = useClipboard();
const { toClipboard: copyFallback } = useV3Clipboard();

const { t, locale } = useI18n();
const pasteboard = ref("");
const showPasteboard = ref(false);
const drag = ref(true);
const isCollapsed = ref(localStorage.getItem('actions-block-collapsed') === '1');
const collapsedElements = ref([]);
const form = inject<Sub | Collection>('form');
// 列表渲染的数据
// 预览开关数组，数组第一项为 id，对应 list 中的同 id 项目，控制该 id 开启关闭预览
const { checked, list, sourceType } = defineProps<{
  checked: Array<[string, boolean]>;
  list: ActionModuleProps[];
  sourceType?: string;
}>();


// 通过 i18n 构造 picker 选项
// const showAddPicker = ref(false);
// const showAddPicker = ref(true);
const types = Object.keys(i18nFile.editorPage.subConfig.nodeActions);
let items = types.map(type => {
  return {
    text: t(`editorPage.subConfig.nodeActions['${type}'].label`),
    value: type,
  };
});

if (sourceType === 'file') {
  items = items.filter(item => ['Script Operator'].includes(item.value));
}
const columns = ref(items);
// useMousePicker();

if(isCollapsed.value) {
  collapsedElements.value = list.map((item) => item.id);
} else {
  collapsedElements.value = [];
}
const setCollapsed = (v) => {
  isCollapsed.value = v;
  if (v) {
    localStorage.setItem('actions-block-collapsed', '1')
    collapsedElements.value = list.map((item) => item.id);
  } else {
    localStorage.removeItem('actions-block-collapsed')
    collapsedElements.value = [];
  }
};
const getActionName = (element) => {
  const editItem = findEditItemById(element);
  return editItem?.customName || editItem?.defaultName || findNameByType(element.type);
};
const getActionControlLabel = (action: string, element?: ActionModuleProps) => {
  const name = element ? getActionName(element) : t(`editorPage.subConfig.actions.label`);
  const isZh = locale.value.startsWith('zh');
  const labels = {
    collapse: isZh ? `折叠 ${name}` : `Collapse ${name}`,
    expand: isZh ? `展开 ${name}` : `Expand ${name}`,
    enable: isZh ? `切换启用 ${name}` : `Toggle enable ${name}`,
    preview: isZh ? `切换预览 ${name}` : `Toggle preview ${name}`,
    help: isZh ? `查看 ${name} 帮助` : `Open help for ${name}`,
    copy: isZh ? `复制 ${name}` : `Copy ${name}`,
    delete: isZh ? `删除 ${name}` : `Delete ${name}`,
    edit: isZh ? `编辑 ${name} 名称` : `Edit name for ${name}`,
    save: isZh ? `保存 ${name} 名称` : `Save name for ${name}`,
    cancel: isZh ? `取消编辑 ${name} 名称` : `Cancel editing name for ${name}`,
    collapseAll: isZh ? '切换折叠全部操作' : 'Toggle collapse all actions',
  };
  return labels[action];
};
const getCollapseLabel = (element) => {
  return collapsedElements.value.includes(element.id)
    ? getActionControlLabel('expand', element)
    : getActionControlLabel('collapse', element);
};
const getGlobalCollapseLabel = () => getActionControlLabel('collapseAll');
const getEnabledLabel = (element) => getActionControlLabel('enable', element);
const getPreviewLabel = (element) => getActionControlLabel('preview', element);
const getHelpLabel = (element) => getActionControlLabel('help', element);
const getCopyLabel = (element) => getActionControlLabel('copy', element);
const getDeleteLabel = (element) => getActionControlLabel('delete', element);
const getEditLabel = (element) => getActionControlLabel('edit', element);
const getSaveLabel = (element) => getActionControlLabel('save', element);
const getCancelEditLabel = (element) => getActionControlLabel('cancel', element);
const toggleInput = (e) => {
  if (findEditItemById(e).isEditing) {
    return;
  } else {
    toggleElementCollapsed(e.id);
  }
};
const toggleElementCollapsed = (id) => {
  if (collapsedElements.value.includes(id)) {
    collapsedElements.value = collapsedElements.value.filter(item => item !== id);
  } else {
    collapsedElements.value.push(id);
  }
  if(collapsedElements.value.length === list.length) {
    setCollapsed(true)
  } else if(collapsedElements.value.length === 0){
    setCollapsed(false)
  } else {
    isCollapsed.value = false;
  }
};
const onButtonClick = (item) => {
  emit('addAction', [item]);
};

const copyItem = async element => {
  const item = form.process.find(item => item.id === element.id);
  const data = JSON.stringify({ source: sourceType, data: item })
  if (isSupported) {
    await copy(data);
  } else {
    await copyFallback(data);
  }
  Toast.text(`已复制数据 可用于导入`);

};
const cancelPaste = async () => {
  showPasteboard.value = false
  pasteboard.value = ''
}
const paste = async () => {
  try {
    let text = ''
  if (showPasteboard.value) {
    text = pasteboard.value
    showPasteboard.value = false
    pasteboard.value = ''
  } else {
    try {
      text = await navigator.clipboard.readText()
    } catch (e) {
      console.error(e)
      pasteboard.value = ''
      showPasteboard.value = true
      return
    }
  }
  let item
  try {
    item = JSON.parse(text)
  } catch (e) {
    
  }
  // console.log(`item`, item)
  if (item?.data?.id && item?.data?.type) {
    if (item?.source !== sourceType) {
      throw new Error('文件操作与订阅操作不通用')
    }
    const data = [{
      ...item.data,
      value: item.data.type,
    }]
    // console.log(data)
    emit('addAction', data);
  } else {
    throw new Error('数据格式错误')
  }
  } catch (e) {
    console.error(e)
    Toast.text(`导入失败 ${e.message ?? e}`);
  }
};
const emit = defineEmits(['addAction', 'deleteAction', 'updateCustomNameModeFlag', 'toggleAction']);
// 示例数据
// const checked = reactive([
//   ['12839211', true],
// ])

// const list = [
//   {
//     id: '12839211',
//     type: 'Flag Operator',
//     component: ActionRadio as any,
//     tipsDes: '我是第一条提示',
//   },
// ]
const toggleActionSwitch = (id: string) => {
  emit('toggleAction', id);
};
// 获取绑定的对应预览开关
const getItem = (id: string) => {
  return checked.find(item => item[0] === id);
};
const togglePreviewSwitch = (id: string) => {
  const item = getItem(id);
  return item[1] = !item[1];
};

// 删除条目，actionsList 中记录的顺序 和 对应预览开关
const deleteItem = id => {
  Dialog({
    title: t(`editorPage.subConfig.pop.deleteTitle`),
    content: t(`editorPage.subConfig.pop.deleteDes`),
    popClass: 'auto-dialog',
    okText: t(`editorPage.subConfig.pop.deleteConfirm`),
    cancelText: t(`editorPage.subConfig.pop.deleteCancel`),
    onOk: () => {
      emit('deleteAction', id);
    },
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// 确认添加时 向渲染数组和预览数组添加对应项目
// const confirm = ({ _, selectedOptions }) => {
//   emit('addAction', selectedOptions);
// };

// 节点帮助弹窗
const popActionsHelp = () => {
  Dialog({
    title: t(`editorPage.subConfig.pop.helpTitle`),
    content: t(`editorPage.subConfig.pop.helpContent`),
    popClass: 'auto-dialog',
    noCancelBtn: true,
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// tips 弹窗
const pop = (type: string, tipsDes: string) => {
  Dialog({
    title: t(`editorPage.subConfig.nodeActions['${type}'].tipsTitle`),
    content: tipsDes,
    popClass: 'auto-dialog',
    noCancelBtn: true,
    // @ts-ignore
    closeOnClickOverlay: true,
  });
};

// 操作名称自定义
const findNameByType = (type) => items.find((item) => item.value === type).text;
const generateEditNameItem = (element) => {
  const { tipsDes, component, ...values } = element;
  return {
    defaultName: findNameByType(values.type),
    oldCustomName: values.customName,
    isEditing: false,
    ...values,
  };
};
const editNameList = reactive(list.map(generateEditNameItem));
const inCustomNameEditMode = computed(() =>
  editNameList.map((item) => item.isEditing).includes(true),
);

watch(() => list, (newV: ActionModuleProps[]) => {
  if (editNameList.length > newV.length) {
    // delete
    const elementsToDelete = editNameList.filter(
      (item) => !newV.some((newItem) => newItem.id === item.id),
    );
    elementsToDelete.forEach((element) => {
      const index = editNameList.findIndex((item) => item.id === element.id);
      if (index !== -1) {
        editNameList.splice(index, 1);
      }
    });
  } else {
    // add
    const elementsToAdd = newV.filter(
      (newItem) => !editNameList.some((item) => item.id === newItem.id),
    );
    elementsToAdd.forEach((element) => {
      editNameList.push(generateEditNameItem(element));
    });
  }
}, { deep: true }); // https://cn.vuejs.org/guide/essentials/watchers

watch(inCustomNameEditMode, (newV) => {
  emit('updateCustomNameModeFlag', newV);
});

const findEditItemById = (target) =>
  editNameList.find((item) => item.id === target.id);

const saveEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editItem.isEditing = false;
  if (/^\s*$/.test(editItem.customName)) {
    editItem.customName = "";
  }
  // stash
  editItem.oldCustomName = editItem.customName;
  form.process.find((item) => item.id === element.id).customName =
    editItem.customName;
};

const exitEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editItem.isEditing = false;
  if (editItem.oldCustomName !== editItem.customName) {
    editItem.customName = editItem.oldCustomName;
  }
};

const exitAllEditName = () => {
  editNameList.forEach((item) => {
    if (item.isEditing) {
      exitEditName(item);
    }
  });
};

// 操作名称编辑
const toggleEditName = (element) => {
  const editItem = editNameList.find((item) => item.id === element.id);
  editNameList.forEach((item) => {
    if (item.isEditing && item.id !== editItem.id) {
      // exit others
      exitEditName(item);
    }
  });
  editItem.isEditing = true;
  nextTick(() => {
    const inputWrapper = document.getElementById(`action-input-${element.id}`);
    const inputEl = inputWrapper?.querySelector('input');
    if (inputEl) {
      inputEl.focus();
    }
  });
};

defineExpose({ exitAllEditName });
</script>

<style lang="scss" scoped>
.paste-action {
  background-color: var(--dialog-color);
  box-shadow: 0 1px 40px var(--background-color);
  border-radius: var(--item-card-radios);
  border: solid 1px var(--divider-color);
  position: fixed;
  width: 300px;
  height: 140px;
  left: calc(50vw - 150px);
  top: calc(50vh - 70px);
}
.add-action-btn {
  font-size: 14px;
  width: 100%;
  height: 44px;
  border-radius: var(--item-card-radios);
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;

  span {
    display: inline-flex;
    align-items: center;

    svg {
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
}

.qa-info {
  padding: 8px 12px;
}

.list-group-item {
  display: flex;
  flex-direction: column;
  box-shadow: none;

  .list-group-item-title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 12px;
    color: var(--comment-text-color);
    border-bottom: 1px solid var(--divider-color);
    width: 100%;

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      margin-right: 2px;
      .custom-name-input {
        font-size: 12px;
        font-weight: bold;
        background: transparent;
        color: var(--second-text-color);
        padding: 0;
        border: none;
        outline: 2px solid transparent;
        text-overflow: ellipsis;
        :deep(.nut-input) {
          width: 100%;
          color: var(--second-text-color);
          text-overflow: ellipsis;

        }
        &:focus-within {
          outline-color: var(--primary-color);
          outline-offset: 2px;
          border-radius: 4px;
        }
        &.nut-input-readonly,
        &.nut-input-disabled {
          :deep(.input-text) {
            cursor: pointer;
            color: var(--second-text-color);
            text-overflow: ellipsis;
          }
        }
      }

      .input-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: transparent;
        z-index: 1;
      }
    }

    .list-group-item-icons {
      display: flex;
      align-items: center;
      gap: 4px;
      button {
        color: inherit;
      }
    }

    &.collapsed {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }

    .left {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      flex: 1;
      padding-right: 5px;
      .collapsed-toggle {
        margin-right: 6px;
        color: inherit;
      }

      svg {
        color: var(--unimportant-icon-color);
      }
    }

    .right {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      .action-switch {
        display: flex;
        align-items: center;
        padding-right: 8px;

        .toggle {
          color: var(--unimportant-icon-color);
        }
        .switch-label-button {
          font-weight: normal;
          font-size: 12px;
          flex-shrink: 0;
          color: inherit;
        }
        .native-switch {
          border: 0;
          background: transparent;
          padding: 0;
          margin-right: 4px;
        }
        .native-switch__track {
          width: 36px;
          height: 20px;
          border-radius: 999px;
          background: var(--divider-color);
          display: inline-flex;
          align-items: center;
          padding: 2px;
          transition: background-color 0.2s ease;
        }
        .native-switch__track.active {
          background: linear-gradient(
            to right,
            var(--primary-color),
            var(--primary-color-end)
          );
        }
        .native-switch__thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 3px rgb(0 0 0 / 25%);
          transform: translateX(0);
          transition: transform 0.2s ease;
        }
        .native-switch__track.active .native-switch__thumb {
          transform: translateX(16px);
        }
      }
      .preview-switch {
        -webkit-user-select: none;
        user-select: none;
        display: flex;
        align-items: center;
        // margin-right: 12px;
        padding-right: 5px;

        .switch-label-button {
          // margin-right: 8px;
          flex-shrink: 0;
          font-weight: normal;
          font-size: 12px;
          color: inherit;
        }
      }
      .icon-button {
        padding: 0 8px;
        &__input {
          padding-right: 20px;
        }
      }
      .delete {
        padding: 0 8px;
        color: var(--danger-color);
      }

      .delete-button {
        color: inherit;
      }

      .drag-handler {
        padding-left: 8px;
        color: var(--lowest-text-color);
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
      }

      .drag-handler:active {
          cursor: grabbing;
          cursor: -moz-grabbing;
          cursor: -webkit-grabbing;
      }
  
    }
  }
}

.list-group-itemsa {
  display: flex;
  flex-direction: column;
  box-shadow: none;

  .list-group-item-titlesa {
    color: var(--comment-text-color);
    border-bottom: 1px solid var(--divider-color);
    padding: 1px 0 12px 12px;
    display: flex;
    align-items: center;

    span {
      margin-right: 6px;
    }

    svg {
      color: var(--unimportant-icon-color);
    }
  }
}

.actions-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .toggle {
    margin: 0;
  }

  .toggle-button {
    margin-left: 18px;
    margin-right: auto;
    color: inherit;
  }

  button {
    background: none;
    border: none;
    font-weight: normal;
    font-size: 12px;
    padding: 0;
    color: var(--comment-text-color);

    svg {
      margin-right: 4px;
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  .light-mode & {
    background: #c8ebfb !important;
  }

  .dark-mode & {
    background: #202f3c !important;
  }
}

/*选中样式*/
.chosen {
  border: solid 1px var(--primary-color) !important;
  opacity: 0.92 !important;
}

.list-group {
  min-height: 20px;
}

.add-action-help-button {
  color: inherit;
}

// .list-group-item {
//   cursor: move;
// }

.list-group-item li {
  cursor: pointer;
}

.custom-button {
  background-color: var(--divider-color);
  color: var(--second-text-color);
  padding: 9px 15px;
  border-radius: 18px;
  border: none;
  font-weight: normal;
  cursor: pointer;
  display: flex;
  flex: 1 1 132px;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  min-width: 0;
  line-height: 1.35;
  text-align: center;
}

.horizontal-button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  background-color: var(--card-color);
  margin: 10px;
  border-radius: 15px;
}
</style>
