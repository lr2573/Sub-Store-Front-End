import { useSettingsApi } from "@/api/settings";
import i18n from "@/locales";
import { useGlobalStore } from '@/store/global';
import { useAppNotifyStore } from "@/store/appNotify";
import { Toast } from "@nutui/nutui";
import { defineStore } from "pinia";
// import { useEnvApi } from '@/api/env';
// import { useSubsStore } from '@/store/subs';

const settingsApi = useSettingsApi();
const { t } = i18n.global;
const LIST_PAGE_VIEW_MODE_STORAGE_KEY = "appearanceSetting.listPageViewMode";
const NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY = "appearanceSetting.listPageViewModeInWideScreenNarrowMode";
const WIDE_SCREEN_NARROW_MODE_STORAGE_KEY = "appearanceSetting.useNarrowModeOnWideScreen";

const getCachedListPageViewMode = (storageKey: string): ListPageViewMode | undefined => {
  const cachedMode = localStorage.getItem(storageKey);
  if (cachedMode === "single-column" || cachedMode === "dual-column") {
    return cachedMode;
  }

  return undefined;
};

const syncCachedListPageViewMode = (storageKey: string, mode?: ListPageViewMode) => {
  if (mode) {
    localStorage.setItem(storageKey, mode);
  } else {
    localStorage.removeItem(storageKey);
  }
};

const getCachedWideScreenNarrowMode = () => {
  return localStorage.getItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY) === "1";
};

const defaultAppearanceSetting: SettingsStoreState["appearanceSetting"] = {
  isSimpleMode: false,
  isLeftRight: false,
  isDefaultIcon: false,
  isIconColor: false,
  isShowIcon: true,
  isSimpleShowRemark: false,
  isEditorCommon: true,
  isSimpleReicon: false,
  isSubItemMenuFold: true,
  showFloatingRefreshButton: false,
  showFloatingAddButton: false,
  createItemPosition: "bottom",
  displayPreviewInWebPage: true,
  invalidShareFakeNode: false,
  istabBar: false,
  istabBar2: false,
  subProgressStyle: "hidden",
  listPageViewMode: undefined,
  listPageViewModeInWideScreenNarrowMode: getCachedListPageViewMode(
    NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY,
  ),
  useNarrowModeOnWideScreen: getCachedWideScreenNarrowMode(),
};

const getBooleanAppearanceSetting = (
  value: unknown,
  fallback: boolean
): boolean => (typeof value === "boolean" ? value : fallback);

const normalizeAppearanceSetting = (
  appearanceSetting?: Partial<SettingsStoreState["appearanceSetting"]>
): SettingsStoreState["appearanceSetting"] => ({
  ...defaultAppearanceSetting,
  ...appearanceSetting,
  isSimpleMode: getBooleanAppearanceSetting(
    appearanceSetting?.isSimpleMode,
    defaultAppearanceSetting.isSimpleMode
  ),
  isLeftRight: getBooleanAppearanceSetting(
    appearanceSetting?.isLeftRight,
    defaultAppearanceSetting.isLeftRight
  ),
  isDefaultIcon: getBooleanAppearanceSetting(
    appearanceSetting?.isDefaultIcon,
    defaultAppearanceSetting.isDefaultIcon
  ),
  isIconColor: getBooleanAppearanceSetting(
    appearanceSetting?.isIconColor,
    defaultAppearanceSetting.isIconColor
  ),
  isShowIcon: getBooleanAppearanceSetting(
    appearanceSetting?.isShowIcon,
    defaultAppearanceSetting.isShowIcon
  ),
  isSimpleShowRemark: getBooleanAppearanceSetting(
    appearanceSetting?.isSimpleShowRemark,
    defaultAppearanceSetting.isSimpleShowRemark
  ),
  isEditorCommon: getBooleanAppearanceSetting(
    appearanceSetting?.isEditorCommon,
    defaultAppearanceSetting.isEditorCommon
  ),
  isSimpleReicon: getBooleanAppearanceSetting(
    appearanceSetting?.isSimpleReicon,
    defaultAppearanceSetting.isSimpleReicon
  ),
  isSubItemMenuFold: getBooleanAppearanceSetting(
    appearanceSetting?.isSubItemMenuFold,
    defaultAppearanceSetting.isSubItemMenuFold
  ),
  showFloatingRefreshButton: getBooleanAppearanceSetting(
    appearanceSetting?.showFloatingRefreshButton,
    defaultAppearanceSetting.showFloatingRefreshButton
  ),
  showFloatingAddButton: getBooleanAppearanceSetting(
    appearanceSetting?.showFloatingAddButton,
    defaultAppearanceSetting.showFloatingAddButton
  ),
  createItemPosition:
    appearanceSetting?.createItemPosition ?? defaultAppearanceSetting.createItemPosition,
  displayPreviewInWebPage: getBooleanAppearanceSetting(
    appearanceSetting?.displayPreviewInWebPage,
    defaultAppearanceSetting.displayPreviewInWebPage
  ),
  invalidShareFakeNode: getBooleanAppearanceSetting(
    appearanceSetting?.invalidShareFakeNode,
    defaultAppearanceSetting.invalidShareFakeNode
  ),
  istabBar: getBooleanAppearanceSetting(
    appearanceSetting?.istabBar,
    defaultAppearanceSetting.istabBar
  ),
  istabBar2: getBooleanAppearanceSetting(
    appearanceSetting?.istabBar2,
    defaultAppearanceSetting.istabBar2
  ),
  subProgressStyle:
    appearanceSetting?.subProgressStyle ?? defaultAppearanceSetting.subProgressStyle,
  listPageViewMode:
    appearanceSetting?.listPageViewMode ?? defaultAppearanceSetting.listPageViewMode,
  listPageViewModeInWideScreenNarrowMode:
    appearanceSetting?.listPageViewModeInWideScreenNarrowMode
    ?? defaultAppearanceSetting.listPageViewModeInWideScreenNarrowMode,
  useNarrowModeOnWideScreen: getBooleanAppearanceSetting(
    appearanceSetting?.useNarrowModeOnWideScreen,
    defaultAppearanceSetting.useNarrowModeOnWideScreen
  ),
});

export const useSettingsStore = defineStore("settingsStore", {
  state: (): SettingsStoreState => {
    return {
      syncPlatform: "",
      gistToken: "",
      githubProxy: "",
      githubProxyRegex: "",
      githubUser: "",
      defaultUserAgent: "",
      defaultProxy: "",
      defaultTimeout: "",
      cacheThreshold: "",
      resourceCacheTtl: "",
      headersCacheTtl: "",
      scriptCacheTtl: "",
      syncTime: 0,
      theme: {
        auto: true,
        name: "light",
        dark: "dark",
        light: "light",
      },
      appearanceSetting: { ...defaultAppearanceSetting },
      gistUpload: "base64",
      avatarUrl: "",
      artifactStore: "",
      artifactStoreStatus: "",
      // ishostApi: localStorage.getItem('hostApi'),
    };
  },
  getters: {},
  actions: {
    applyAppearanceSetting(appearanceSetting?: SettingsPostData["appearanceSetting"]) {
      const normalizedAppearanceSetting = normalizeAppearanceSetting(appearanceSetting);

      this.appearanceSetting = normalizedAppearanceSetting;

      syncCachedListPageViewMode(
        LIST_PAGE_VIEW_MODE_STORAGE_KEY,
        normalizedAppearanceSetting.listPageViewMode,
      );
      syncCachedListPageViewMode(
        NARROW_MODE_LIST_PAGE_VIEW_MODE_STORAGE_KEY,
        normalizedAppearanceSetting.listPageViewModeInWideScreenNarrowMode,
      );

      if (normalizedAppearanceSetting.useNarrowModeOnWideScreen) {
        localStorage.setItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY, "1");
      } else {
        localStorage.removeItem(WIDE_SCREEN_NARROW_MODE_STORAGE_KEY);
      }
    },
    async fetchSettings() {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.getSettings();
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubProxyRegex = res.data.data.githubProxyRegex || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.syncTime = res.data.data.syncTime || 0;
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";

        this.theme.auto = res.data.data.theme?.auto ?? true;
        this.theme.name = res.data.data.theme?.name ?? "light";
        this.theme.dark = res.data.data.theme?.dark ?? "dark";
        this.theme.light = res.data.data.theme?.light ?? "light";

        this.applyAppearanceSetting(res.data.data.appearanceSetting);
        this.gistUpload = res.data.data?.gistUpload ?? "base64";
      } else {
        showNotify({
          title: `获取配置失败`,
          type: "danger",
        });
      }
    },
    async changeSettings(data: SettingsPostData) {
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.syncPlatform = res.data.data.syncPlatform || "";
        this.gistToken = res.data.data.gistToken || "";
        this.githubProxy = res.data.data.githubProxy || "";
        this.githubProxyRegex = res.data.data.githubProxyRegex || "";
        this.githubUser = res.data.data.githubUser || "";
        this.defaultProxy = res.data.data.defaultProxy || "";
        this.defaultUserAgent = res.data.data.defaultUserAgent || "";
        this.defaultTimeout = res.data.data.defaultTimeout || "";
        this.cacheThreshold = res.data.data.cacheThreshold || "";
        this.resourceCacheTtl = res.data.data.resourceCacheTtl || "";
        this.headersCacheTtl = res.data.data.headersCacheTtl || "";
        this.scriptCacheTtl = res.data.data.scriptCacheTtl || "";
        this.avatarUrl = res.data.data.avatarUrl || "";
        this.artifactStore = res.data.data.artifactStore || "";
        this.artifactStoreStatus = res.data.data.artifactStoreStatus || "";
        this.gistUpload = res.data.data.gistUpload || "";
        showNotify({ type: "success", title: t(`myPage.notify.save.succeed`) });
        return true;
      } else {
        showNotify({
          title: `更新配置失败`,
          type: "danger",
        });
        return false;
      }
    },
    // 备份本地配置到后端（用于兼容外观设置）
    async syncLocalAppearanceSetting() {
      const globalStore = useGlobalStore();
      const {
        isSimpleMode,
        isLeftRight,
        isIconColor,
        isDefaultIcon,
        isEditorCommon,
        isSimpleReicon,
        showFloatingRefreshButton,
        istabBar,
        istabBar2,
        subProgressStyle,
        gistUpload,
      } = globalStore;
      const data = {
        isSimpleMode: isSimpleMode ?? false,
        isLeftRight: isLeftRight ?? false,
        isIconColor: isIconColor ?? false,
        isDefaultIcon: isDefaultIcon ?? false,
        isEditorCommon: isEditorCommon ?? true,
        isSimpleReicon: isSimpleReicon ?? false,
        showFloatingRefreshButton: showFloatingRefreshButton ?? false,
        istabBar: istabBar ?? false,
        istabBar2: istabBar2 ?? false,
        subProgressStyle: subProgressStyle ?? "hidden",
        gistUpload: gistUpload ?? "base64",
      };
      const list = Object.keys(data) as (keyof SettingsPostData)[];
      // 判断是否有本地持久化的外观设置
      const hasLocalAppearanceSetting = list.some((key) => {
        return localStorage.getItem(key) !== null
      })
      // 如果有本地持久化的外观设置，则将其同步到后端
      if (hasLocalAppearanceSetting) {
        await this.changeAppearanceSetting({ appearanceSetting: data });
        this.removeLocalAppearanceSetting(); 
      }
    },
    // 清除本地持久化的外观设置
    removeLocalAppearanceSetting() {
      const globalStore = useGlobalStore();
      globalStore.setSimpleMode(false);
      globalStore.setLeftRight(false);
      globalStore.setIconColor(false);
      globalStore.setIsDefaultIcon(false);
      globalStore.setEditorCommon(false);
      globalStore.setSimpleReicon(false);
      globalStore.setShowFloatingRefreshButton(false);
      globalStore.settabBar(false);
      globalStore.settabBar2(false);
      globalStore.setSubProgressStyle('hidden');
    },
    async changeTheme(data: SettingsPostData) {
      Toast.loading("切换主题中...", { cover: true, id: "theme__loading" });
      const { showNotify } = useAppNotifyStore();
      const res = await settingsApi.setSettings(data);
      if (res?.data?.status === "success" && res?.data?.data) {
        this.theme = res.data.data.theme;
      } else {
        showNotify({
          title: `切换主题失败`,
          type: "danger",
        });
      }
      Toast.hide("theme__loading");
    },
    async changeAppearanceSetting(data: SettingsPostData) {
      Toast.loading("保存外观设置中...", { cover: true, id: "theme__loading" });
      const { showNotify } = useAppNotifyStore();
      try {
        const res = await settingsApi.setSettings(data);
        if (res?.data?.status === "success" && res?.data?.data) {
          this.applyAppearanceSetting(res.data.data.appearanceSetting);
          return true;
        }
        showNotify({
          title: `保存外观设置失败`,
          type: "danger",
        });
        return false;
      } catch (error) {
        showNotify({
          title: `保存外观设置失败`,
          type: "danger",
        });
        return false;
      } finally {
        Toast.hide("theme__loading");
      }
    },
  },
});
