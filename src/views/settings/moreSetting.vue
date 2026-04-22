<template>
  <div class="page-wrapper">
    <!-- <p class="More-title">
      {{ $t(`themeSettingPage.themeSettingTitle`) }}
    </p> -->

    <nut-cell-group>
      <nut-cell :title="$t(`moreSettingPage.simple`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="SimpleSwitch"
            :aria-label="$t(`moreSettingPage.simple`)"
            @click="setSimpleMode(!SimpleSwitch)"
          >
            <span class="native-switch-track" :class="{ active: SimpleSwitch }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isSimpleReicon`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awSimpleReicon"
            :aria-label="$t(`moreSettingPage.isSimpleReicon`)"
            @click="setSimpleReicon(!awSimpleReicon)"
          >
            <span class="native-switch-track" :class="{ active: awSimpleReicon }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isSimpleShowRemarks`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awSimpleShowRemark"
            :aria-label="$t(`moreSettingPage.isSimpleShowRemarks`)"
            @click="setSimpleShowRemark(!awSimpleShowRemark)"
          >
            <span class="native-switch-track" :class="{ active: awSimpleShowRemark }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>
      <nut-cell :title="$t(`moreSettingPage.isDefaultIcon`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awIsDefaultIcon"
            :aria-label="$t(`moreSettingPage.isDefaultIcon`)"
            @click="setIsDefaultIcon(!awIsDefaultIcon)"
          >
            <span class="native-switch-track" :class="{ active: awIsDefaultIcon }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isShowIcon`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awIsShowIcon"
            :aria-label="$t(`moreSettingPage.isShowIcon`)"
            @click="setIsShowIcon(!awIsShowIcon)"
          >
            <span class="native-switch-track" :class="{ active: awIsShowIcon }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>

      <nut-cell :title="$t(`moreSettingPage.islr`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="LeftRight"
            :aria-label="$t(`moreSettingPage.islr`)"
            @click="setLeftRight(!LeftRight)"
          >
            <span class="native-switch-track" :class="{ active: LeftRight }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>


      <nut-cell :title="$t(`moreSettingPage.isSubItemMenuFold`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awIsSubItemMenuFold"
            :aria-label="$t(`moreSettingPage.isSubItemMenuFold`)"
            @click="setIsSubItemMenuFold(!awIsSubItemMenuFold)"
          >
            <span class="native-switch-track" :class="{ active: awIsSubItemMenuFold }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>



      <button
        type="button"
        class="cell-item setting-action-row"
        :aria-label="`${$t(`moreSettingPage.subProgress.title`)} ${subProgressStyleName}`"
        @click="showSubProgressPicker = true"
      >
        <span class="setting-action-content">
          <span>{{ $t(`moreSettingPage.subProgress.title`) }}</span>
          <small>{{ subProgressStyleName }}</small>
        </span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
      <DesktopPicker v-model="subProgressStyleValue" v-model:visible="showSubProgressPicker" :columns="[
        { text: $t(`moreSettingPage.subProgress.hidden`), value: 'hidden' },
        { text: $t(`moreSettingPage.subProgress.background`), value: 'background' }
      ]" :title="$t(`moreSettingPage.subProgress.title`)" @confirm="subProgressStyleConfirm">
      </DesktopPicker>


      <nut-cell :title="$t(`moreSettingPage.displayPreviewInWebPage`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awDisplayPreviewInWebPage"
            :aria-label="$t(`moreSettingPage.displayPreviewInWebPage`)"
            @click="setDisplayPreviewInWebPage(!awDisplayPreviewInWebPage)"
          >
            <span class="native-switch-track" :class="{ active: awDisplayPreviewInWebPage }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.isEditorCommon`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awEditorCommon"
            :aria-label="$t(`moreSettingPage.isEditorCommon`)"
            @click="setEditorCommon(!awEditorCommon)"
          >
            <span class="native-switch-track" :class="{ active: awEditorCommon }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-cell-group v-if="shareBtnVisible">
      <nut-cell :title="$t(`moreSettingPage.invalidShareFakeNode`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="invalidShareFakeNode"
            :aria-label="$t(`moreSettingPage.invalidShareFakeNode`)"
            @click="setInvalidShareFakeNode(!invalidShareFakeNode)"
          >
            <span class="native-switch-track" :class="{ active: invalidShareFakeNode }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-cell-group>
      <button
        type="button"
        class="cell-item setting-action-row"
        :aria-label="`${$t(`moreSettingPage.createItemPosition.title`)} ${createItemPositionName}`"
        @click="showCreateItemPositionPicker = true"
      >
        <span class="setting-action-content">
          <span>{{ $t(`moreSettingPage.createItemPosition.title`) }}</span>
          <small>{{ createItemPositionName }}</small>
        </span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
      <DesktopPicker v-model="createItemPositionValue" v-model:visible="showCreateItemPositionPicker" :columns="[
        { text: $t(`moreSettingPage.createItemPosition.top`), value: 'top' },
        { text: $t(`moreSettingPage.createItemPosition.bottom`), value: 'bottom' }
      ]" :title="$t(`moreSettingPage.createItemPosition.title`)" @confirm="createItemPositionConfirm">
      </DesktopPicker>
      <nut-cell :title="$t(`moreSettingPage.showFloatingAddButton`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awShowFloatingAddButton"
            :aria-label="$t(`moreSettingPage.showFloatingAddButton`)"
            @click="setShowFloatingAddButton(!awShowFloatingAddButton)"
          >
            <span class="native-switch-track" :class="{ active: awShowFloatingAddButton }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.showFloatingRefreshButton`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awShowFloatingRefreshButton"
            :aria-label="$t(`moreSettingPage.showFloatingRefreshButton`)"
            @click="setShowFloatingRefreshButton(!awShowFloatingRefreshButton)"
          >
            <span class="native-switch-track" :class="{ active: awShowFloatingRefreshButton }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.tabBar2`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awtabBar2"
            :aria-label="$t(`moreSettingPage.tabBar2`)"
            @click="settabBar2(!awtabBar2)"
          >
            <span class="native-switch-track" :class="{ active: awtabBar2 }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
      <nut-cell :title="$t(`moreSettingPage.tabBar`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="awtabBar"
            :aria-label="$t(`moreSettingPage.tabBar`)"
            @click="settabBar(!awtabBar)"
          >
            <span class="native-switch-track" :class="{ active: awtabBar }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>
    </nut-cell-group>
    <nut-cell-group>
      <button
        type="button"
        class="cell-item setting-action-row"
        :aria-label="`${$t(`moreSettingPage.gistUpload.title`)} ${gistUploadName}`"
        @click="showGistUploadPicker = true"
      >
        <span class="setting-action-content">
          <span>{{ $t(`moreSettingPage.gistUpload.title`) }}</span>
          <small>{{ gistUploadName }}</small>
        </span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
      <DesktopPicker v-model="gistUploadValue" v-model:visible="showGistUploadPicker" :columns="[
        { text: $t(`moreSettingPage.gistUpload.base64`), value: 'base64' },
        { text: $t(`moreSettingPage.gistUpload.plaintext`), value: 'plaintext' }
      ]" :title="$t(`moreSettingPage.gistUpload.title`)" @confirm="gistUploadConfirm">
      </DesktopPicker>
    </nut-cell-group>

    <nut-cell-group>
      <nut-cell :title="$t(`themeSettingPage.auto`)" class="cell-item">
        <template v-slot:link>
          <button
            type="button"
            class="native-switch-button"
            role="switch"
            :aria-checked="autoSwitch"
            :aria-label="$t(`themeSettingPage.auto`)"
            @click="autoSwitchIsChange(!autoSwitch)"
          >
            <span class="native-switch-track" :class="{ active: autoSwitch }">
              <span class="native-switch-thumb"></span>
            </span>
          </button>
        </template>
      </nut-cell>

      <template v-if="theme.auto">
        <button
          type="button"
          class="cell-item setting-action-row"
          :aria-label="`${$t(`themeSettingPage.dark`)} ${themeDes.darkDes}`"
          @click="openPicker('dark')"
        >
          <span class="setting-action-content">
            <span>{{ $t(`themeSettingPage.dark`) }}</span>
            <small>{{ themeDes.darkDes }}</small>
          </span>
          <nut-icon name="rect-right"></nut-icon>
        </button>

        <button
          type="button"
          class="cell-item setting-action-row"
          :aria-label="`${$t(`themeSettingPage.light`)} ${themeDes.lightDes}`"
          @click="openPicker('light')"
        >
          <span class="setting-action-content">
            <span>{{ $t(`themeSettingPage.light`) }}</span>
            <small>{{ themeDes.lightDes }}</small>
          </span>
          <nut-icon name="rect-right"></nut-icon>
        </button>
      </template>

      <button
        v-else
        type="button"
        class="cell-item setting-action-row"
        :aria-label="`${$t(`themeSettingPage.themeSettingTitle`)} ${themeDes.nameDes}`"
        @click="openPicker('name')"
      >
        <span class="setting-action-content">
          <span>{{ $t(`themeSettingPage.themeSettingTitle`) }}</span>
          <small>{{ themeDes.nameDes }}</small>
        </span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
    </nut-cell-group>
    <DesktopPicker v-model="selectedValue" v-model:visible="showThemePicker" :columns="pickerColumn"
      :title="$t(`themeSettingPage.themePicker.title`)" :cancel-text="$t(`themeSettingPage.themePicker.cancel`)"
      :ok-text="$t(`themeSettingPage.themePicker.confirm`)" @confirm="confirm" />
    <nut-cell-group>
      <button
        type="button"
        class="change-themes setting-action-row"
        @click.stop="clearFrontEndData"
      >
        <span>{{ $t(`moreSettingPage.clearFrontEndData.label`) }}</span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
      <button
        type="button"
        class="change-themes setting-action-row"
        @click.stop="clearData"
      >
        <span>{{ $t(`moreSettingPage.clearData.label`) }}</span>
        <nut-icon name="rect-right"></nut-icon>
      </button>
    </nut-cell-group>

  </div>
</template>

<script lang="ts" setup>
  import DesktopPicker from '@/components/DesktopPicker.vue';
  import { initStores } from "@/utils/initApp";
  import { Dialog, Toast } from '@nutui/nutui';
  import { useSettingsStore } from '@/store/settings';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/store/global';
  import { useThemes } from '@/hooks/useThemes';
  import { computed, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useAppNotifyStore } from "@/store/appNotify";
  import { useSettingsApi } from "@/api/settings";
  import { useBackend } from "@/hooks/useBackend";
  // import { Dialog } from '@nutui/nutui';

  const { t } = useI18n();
  const settingsStore = useSettingsStore();
  const globalStore = useGlobalStore();
  const {
    // env,
    // isSimpleMode,
    // isLeftRight,
    ishostApi,
    // isIconColor,
    // isDefaultIcon,
    // isEditorCommon,
    // isSimpleReicon,
    // showFloatingRefreshButton,
    // istabBar,
    // istabBar2,
    // subProgressStyle,
  } = storeToRefs(globalStore);
  // 外观设置
  const { changeAppearanceSetting, changeSettings } = settingsStore;
  const { appearanceSetting, gistUpload } = storeToRefs(settingsStore);
  const { showNotify } = useAppNotifyStore();
  const { icon, env } = useBackend();
  const InputHostApi = ref('');
  const autoSwitchSync = ref(false);
  const SimpleSwitch = ref(false);
  const LeftRight = ref(false);
  const awIsDefaultIcon = ref(false);
  const awIsShowIcon = ref(true);
  const awIsSubItemMenuFold = ref(true);
  const awEditorCommon = ref(false);
  const awSimpleReicon = ref(true);
  const awSimpleShowRemark = ref(false);
  const awShowFloatingRefreshButton = ref(false);
  const awShowFloatingAddButton = ref(true);
  const createItemPositionValue = ref<CreateItemPosition[]>(['bottom']);
  const awDisplayPreviewInWebPage = ref(true);
  const invalidShareFakeNode = ref(false);
  const awtabBar = ref(true);
  const awtabBar2 = ref(true);
  // const isEditing = ref(false);
  const isInit = ref(false);
  const subProgressStyleValue = ref(['hidden']);
  const gistUploadValue = ref(['base64']);

  const pickerType = ref('');
  const autoSwitch = ref(false);
  const showThemePicker = ref(false);
  // const isEditLoading = ref(false);
  const showSubProgressPicker = ref(false);
  const showCreateItemPositionPicker = ref(false);
  const shareBtnVisible = computed(() => {
    return env.value?.feature?.share;
  });
  const subProgressStyleName = computed(() => {
    return t(`moreSettingPage.subProgress.${subProgressStyleValue.value}`)
  })
  const subProgressStyleConfirm = ({ selectedValue }) => {
    // globalStore.setSubProgressStyle(selectedValue[0]);
    const data = {
      ...appearanceSetting.value,
      subProgressStyle: selectedValue[0]
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };
  const showGistUploadPicker = ref(false);

  const gistUploadName = computed(() => {
    return t(`moreSettingPage.gistUpload.${gistUploadValue.value}`)
  })
  const gistUploadConfirm = ({ selectedValue }) => {
    changeSettings({
      gistUpload: selectedValue[0]
    });
  };
  const createItemPositionName = computed(() => {
    return t(`moreSettingPage.createItemPosition.${createItemPositionValue.value[0]}`);
  });
  const createItemPositionConfirm = ({ selectedValue }) => {
    const data = {
      ...appearanceSetting.value,
      createItemPosition: selectedValue[0]
    }
    changeAppearanceSetting({ appearanceSetting: data });
  };
  const updateAppearanceToggle = async (
    key: keyof typeof appearanceSetting.value,
    value: boolean,
    stateRef: { value: boolean }
  ) => {
    const previousValue = stateRef.value;
    stateRef.value = value;
    const success = await changeAppearanceSetting({
      appearanceSetting: {
        ...appearanceSetting.value,
        [key]: value,
      },
    });
    if (!success) {
      stateRef.value = previousValue;
    }
  };

  const setSimpleMode = (isSimpleMode: boolean) =>
    updateAppearanceToggle("isSimpleMode", isSimpleMode, SimpleSwitch);

  const setLeftRight = (isLeftRight: boolean) =>
    updateAppearanceToggle("isLeftRight", isLeftRight, LeftRight);

  const setIsDefaultIcon = (isDefaultIcon: boolean) =>
    updateAppearanceToggle("isDefaultIcon", isDefaultIcon, awIsDefaultIcon);

  const setIsShowIcon = (isShowIcon: boolean) =>
    updateAppearanceToggle("isShowIcon", isShowIcon, awIsShowIcon);

  const setIsSubItemMenuFold = (isSubItemMenuFold: boolean) =>
    updateAppearanceToggle("isSubItemMenuFold", isSubItemMenuFold, awIsSubItemMenuFold);

  const setEditorCommon = (isEditorCommon: boolean) =>
    updateAppearanceToggle("isEditorCommon", isEditorCommon, awEditorCommon);

  const setSimpleReicon = (isSimpleReicon: boolean) =>
    updateAppearanceToggle("isSimpleReicon", isSimpleReicon, awSimpleReicon);

  const setSimpleShowRemark = (isSimpleShowRemark: boolean) =>
    updateAppearanceToggle("isSimpleShowRemark", isSimpleShowRemark, awSimpleShowRemark);

  const setShowFloatingRefreshButton = (showFloatingRefreshButton: boolean) =>
    updateAppearanceToggle("showFloatingRefreshButton", showFloatingRefreshButton, awShowFloatingRefreshButton);

  const setShowFloatingAddButton = (showFloatingAddButton: boolean) =>
    updateAppearanceToggle("showFloatingAddButton", showFloatingAddButton, awShowFloatingAddButton);

  const setDisplayPreviewInWebPage = (displayPreviewInWebPage: boolean) =>
    updateAppearanceToggle("displayPreviewInWebPage", displayPreviewInWebPage, awDisplayPreviewInWebPage);

  const setInvalidShareFakeNode = (isInvalidShareFakeNode: boolean) =>
    updateAppearanceToggle("invalidShareFakeNode", isInvalidShareFakeNode, invalidShareFakeNode);

  const settabBar = (istabBar: boolean) =>
    updateAppearanceToggle("istabBar", istabBar, awtabBar);

  const settabBar2 = (istabBar2: boolean) =>
    updateAppearanceToggle("istabBar2", istabBar2, awtabBar2);

  
  
  // 主题设置 
  const { changeTheme } = settingsStore;
  const { theme } = storeToRefs(settingsStore);
  const { pickerList, pickerLightList, pickerDarkList, isAuto } = useThemes();
  const selectedValue = ref(['dark']);

  const themeDes = computed(() => {
    const lightItem = pickerLightList.value.find(
      item => item.value === theme.value.light
    );
    const darkItem = pickerDarkList.value.find(
      item => item.value === theme.value.dark
    );
    const nameItem = pickerList.value.find(
      item => item.value === theme.value.name
    );

    return {
      lightDes: lightItem ? lightItem.text : '',
      darkDes: darkItem ? darkItem.text : '',
      nameDes: nameItem ? nameItem.text : '',
    };
  });
  const openPicker = (type: 'dark' | 'light' | 'name') => {
    showThemePicker.value = true;
    pickerType.value = type;
    selectedValue.value = [toRaw(theme.value[type])];
  };

  const pickerColumn = computed(() => {
    switch (pickerType.value) {
      case 'dark':
        return toRaw(pickerDarkList.value);
      case 'light':
        return toRaw(pickerLightList.value);
      case 'name':
        return toRaw(pickerList.value);
    }
  });

  const confirm = ({ selectedValue }) => {
    const data = { ...theme.value };
    data[pickerType.value] = selectedValue[0] ?? pickerColumn.value[0].value;
    changeTheme({ theme: data });
  };

  const autoSwitchIsChange = (val: boolean) => {
    const data = { ...theme.value };
    data.auto = val;
    changeTheme({ theme: data });
  };

  const setDisplayInfo = () => {
    InputHostApi.value = ishostApi.value
      ? ishostApi.value.slice(0, 9) + '************'
      : t(`moreSettingPage.yhostapi`);
  };
  const clearData = () => {
    Dialog({
      title: t('moreSettingPage.clearData.title'),
      content: t('moreSettingPage.clearData.content'),
      onCancel: () => {},
      onOk: async () => {
        try {
            const res = await useSettingsApi().restoreSettings({ content: JSON.stringify({
              settings: {
                istabBar2: false
              }
            }) });
            if (res?.data?.status === "success") {
              await initStores(false, true, true);
              showNotify({
                type: "success",
                title: t(`moreSettingPage.clearData.succeed`),
              });
            } else {
              throw new Error('clear data failed')
            }
        } catch (e) {
          showNotify({
            type: "danger",
            title: t(`moreSettingPage.clearData.failed`),
          });
          console.error(e);
        } 
      },
      popClass: 'auto-dialog',
      cancelText: t('moreSettingPage.clearData.cancel'),
      okText: t('moreSettingPage.clearData.conform'),
      closeOnPopstate: true,
      lockScroll: false,
    });
  };
  const clearFrontEndData = () => {
    Dialog({
      title: t('moreSettingPage.clearFrontEndData.title'),
      content: t('moreSettingPage.clearFrontEndData.content'),
      onCancel: () => {},
      onOk: async () => {
        try {
          localStorage.clear()
          window.location.reload()
        } catch (e) {
          showNotify({
            type: "danger",
            title: t(`moreSettingPage.clearFrontEndData.failed`),
          });
          console.error(e);
        } 
      },
      popClass: 'auto-dialog',
      cancelText: t('moreSettingPage.clearFrontEndData.cancel'),
      okText: t('moreSettingPage.clearFrontEndData.conform'),
      closeOnPopstate: true,
      lockScroll: false,
    });
  };

  // const exitEditMode = () => {
  //   setDisplayInfo();
  //   isEditing.value = false;
  //   isEditLoading.value = false;
  // };

  // const toggleEditMode = async () => {
  //   isEditLoading.value = true;
  //   console.log(`location.protocol`, location.protocol);
  //   console.log(`InputHostApi`, InputHostApi.value);
  //   if (
  //     location.protocol === 'https:' &&
  //     !/^(https):\/\/\S+$|^http:\/\/(localhost|127\.0\.0\.1)/.test(
  //       InputHostApi.value
  //     ) &&
  //     isEditing.value &&
  //     InputHostApi.value !== ''
  //   ) {
  //     console.log('InputHostApi失败');
  //     Dialog({
  //       title: t(`moreSettingPage.InputHostApi.title`),
  //       content: t(`moreSettingPage.InputHostApi.content`),
  //       popClass: 'auto-dialog',
  //       noCancelBtn: true,
  //       okText: t(`editorPage.subConfig.pop.errorBtn`),
  //       closeOnClickOverlay: true,
  //     });
  //     isEditing.value = false;
  //     isEditLoading.value = false;
  //     setDisplayInfo();
  //   } else {
  //     if (isEditing.value) {
  //       globalStore.sethostApi(InputHostApi.value);
  //       setDisplayInfo();
  //     } else {
  //       InputHostApi.value = ishostApi.value;
  //     }
  //     isEditLoading.value = false;
  //     isEditing.value = !isEditing.value;
  //   }
  // };

  // const clearEditor = () => {
  //   Dialog({
  //     title: t('editorPage.subConfig.pop.clearTitle'),
  //     content: t('editorPage.subConfig.pop.clearDes'),
  //     popClass: 'auto-dialog',
  //     okText: t(`editorPage.subConfig.pop.clearConfirm`),
  //     cancelText: t(`editorPage.subConfig.pop.clearCancel`),
  //     onOk: () => {
  //       InputHostApi.value = '';
  //     },
  //     closeOnClickOverlay: true,
  //   });
  // };

  watchEffect(() => {
    SimpleSwitch.value = appearanceSetting.value.isSimpleMode;
    LeftRight.value = appearanceSetting.value.isLeftRight;
    awIsDefaultIcon.value = appearanceSetting.value.isDefaultIcon;
    awIsShowIcon.value = appearanceSetting.value.isShowIcon;
    awIsSubItemMenuFold.value = appearanceSetting.value.isSubItemMenuFold;
    awEditorCommon.value = appearanceSetting.value.isEditorCommon;
    awSimpleReicon.value = appearanceSetting.value.isSimpleReicon;
    awSimpleShowRemark.value = appearanceSetting.value.isSimpleShowRemark;
    awShowFloatingRefreshButton.value = appearanceSetting.value.showFloatingRefreshButton;
    awShowFloatingAddButton.value = appearanceSetting.value.showFloatingAddButton;
    createItemPositionValue.value = [appearanceSetting.value.createItemPosition || 'bottom'];
    awDisplayPreviewInWebPage.value = appearanceSetting.value.displayPreviewInWebPage;
    invalidShareFakeNode.value = appearanceSetting.value.invalidShareFakeNode;
    awtabBar.value = appearanceSetting.value.istabBar;
    awtabBar2.value = appearanceSetting.value.istabBar2;
    subProgressStyleValue.value = [appearanceSetting.value.subProgressStyle];
    gistUploadValue.value = [gistUpload.value];
    // SimpleSwitch.value = isSimpleMode.value;
    // LeftRight.value = isLeftRight.value;
    // awIconColor.value = isIconColor.value;
    // awIsDefaultIcon.value = isDefaultIcon.value;
    // awEditorCommon.value = isEditorCommon.value;
    // awEditorCommon.value = isEditorCommon.value;
    // awSimpleReicon.value = isSimpleReicon.value;
    // awShowFloatingRefreshButton.value = showFloatingRefreshButton.value;
    // awtabBar.value = istabBar.value;
    // awtabBar2.value = istabBar2.value;
    // subProgressStyleValue.value = [subProgressStyle.value];
    autoSwitch.value = isAuto();
    if (!isInit.value) {
      setDisplayInfo();
      isInit.value = true;
    }
  });
</script>

<style lang="scss" scoped>
  .page-wrapper {
    min-height: 100%;
    padding: 0 var(--safe-area-side);
    // padding: var(--safe-area-side);
    // display: flex;
    // min-width: 100%;
    flex-direction: column;
    align-items: center;
    //margin-bottom: 80px;

    .cell-item {
      box-shadow: none;
      background: var(--card-color);

      border-radius: var(--item-card-radios);
      font-weight: bold;
      display: flex;
      align-items: center;

      :deep(.nut-cell__value) {
        font-weight: normal;
        color: var(--lowest-text-color);
      }
    }

    .cell-group {
      width: 100%;

      :deep(.nut-cell-group__warp) {
        border-radius: var(--item-card-radios);
        overflow: hidden;
      }
    }
  }

  .desc-title {
    // display: block;
    padding: 0 10px;
    color: var(--comment-text-color);
    font-size: 12px;
    // line-height: 20px;
    margin-top: 8px;
    margin-bottom: 20px;
    text-align: left;
  }

  .desc-about {
    // width: 100%;
    // display: block;
    padding: 100px 5px 320px;
    color: var(--comment-text-color);
    font-size: 12px;
    // line-height: 20px;
    margin-top: 8px;
    margin-bottom: 20px;
    text-align: left;
  }

  .desc-about span {
    display: inline-block;
    padding: 6px 0 0 0;
  }

  .desc-title a,
  .desc-about a {
    color: var(--primary-color);
  }

  .env-block {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: var(--lowest-text-color);
    opacity: 0.3;
  }

  .More-title {
    border-radius: var(--item-card-radios);
    padding: 0 13px;
    color: var(--comment-text-color);
    font-size: 14px;
    line-height: 16px;
    margin-top: 16px;
    // margin-bottom: 30px;
    text-align: left;
    font-weight: bold;
  }

  .More-title:not(:first-child) {
    margin-top: 36px;
  }

  .profile-block {
    width: 100%;

    .config-card {
      margin-top: 10px;
      width: 100%;
      padding: 15px;
      border-radius: var(--item-card-radios);
      color: var(--second-text-color);
      background: var(--card-color);

      .title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        font-size: 14px;
        padding: 8px 0;
        margin-bottom: 8px;
      }

      .config-input-wrapper {
        // padding: 0 0px;

        .input.nut-input-disabled {
          :deep(input):disabled {
            -webkit-text-fill-color: var(--lowest-text-color);
          }
        }

        .input {
          background: transparent;
          padding: 5px;
          color: var(--second-text-color);

          :deep(img) {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            opacity: 0.2;
            filter: brightness(var(--img-brightness));
          }

          &:not(:first-child) {
            margin-top: 8px;
          }
        }
      }

      .config-btn-wrapper {
        margin-top: -9px;
        display: flex;
        justify-content: flex-end;

        .cancel-btn {
          margin-left: 8px;
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
      padding: 24px 0;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        max-width: 64%;

        .avatar-normal {
          :deep(img) {
            width: 72%;
          }
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
          padding: 0 12px;
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

    .change-themes {
      // color: var(--comment-text-color);
      box-shadow: none;
      font-weight: bold;
    }

    .setting-action-row {
      width: 100%;
      border: 0;
      background: var(--card-color);
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      cursor: pointer;

      :deep(.nut-icon) {
        color: var(--comment-text-color);
      }
    }

    .setting-action-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      small {
        color: var(--lowest-text-color);
        font-weight: normal;
      }
    }
  }

  .hostapi-comment {
    font-size: 12px;
    color: var(--comment-text-color);
    margin-top: 8px;
  }

  .native-switch-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;

    &:focus-visible {
      outline: 3px solid var(--primary-color);
      outline-offset: 3px;
      border-radius: 999px;
    }
  }

  .native-switch-track {
    position: relative;
    width: 34px;
    height: 20px;
    border-radius: 999px;
    background: var(--divider-color);
    transition: background-color 0.2s ease;

    &.active {
      background: var(--primary-color);
    }
  }

  .native-switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s ease;

    .native-switch-track.active & {
      transform: translateX(14px);
    }
  }
</style>
