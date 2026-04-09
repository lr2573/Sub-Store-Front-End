import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ActionKey =
  | "skipToContent"
  | "mainNavigation"
  | "routeChanged"
  | "back"
  | "preview"
  | "open"
  | "refresh"
  | "add"
  | "share"
  | "copy"
  | "edit"
  | "delete"
  | "restore"
  | "export"
  | "duplicate"
  | "enableSimpleMode"
  | "disableSimpleMode"
  | "switchToSingleColumn"
  | "switchToDualColumn"
  | "language"
  | "openItemActions";

const zhCN: Record<ActionKey, string> = {
  skipToContent: "跳转到主要内容",
  mainNavigation: "主导航",
  routeChanged: "当前页面",
  back: "返回上一页",
  preview: "预览",
  open: "打开",
  refresh: "刷新当前页面",
  add: "新增项目",
  share: "分享",
  copy: "复制",
  edit: "编辑",
  delete: "删除",
  restore: "恢复",
  export: "导出",
  duplicate: "复制配置",
  enableSimpleMode: "开启简洁模式",
  disableSimpleMode: "关闭简洁模式",
  switchToSingleColumn: "切换为单列布局",
  switchToDualColumn: "切换为双列布局",
  language: "切换语言",
  openItemActions: "打开更多操作",
};

const enUS: Record<ActionKey, string> = {
  skipToContent: "Skip to main content",
  mainNavigation: "Main navigation",
  routeChanged: "Current page",
  back: "Go back",
  preview: "Preview",
  open: "Open",
  refresh: "Refresh current page",
  add: "Add item",
  share: "Share",
  copy: "Copy",
  edit: "Edit",
  delete: "Delete",
  restore: "Restore",
  export: "Export",
  duplicate: "Duplicate configuration",
  enableSimpleMode: "Enable simple mode",
  disableSimpleMode: "Disable simple mode",
  switchToSingleColumn: "Switch to single-column layout",
  switchToDualColumn: "Switch to dual-column layout",
  language: "Change language",
  openItemActions: "Open more actions",
};

export function useA11y() {
  const { locale } = useI18n();

  const a11yText = computed(() => {
    return locale.value.startsWith("zh") ? zhCN : enUS;
  });

  const getA11yText = (key: ActionKey) => {
    return a11yText.value[key];
  };

  return {
    a11yText,
    getA11yText,
  };
}

export const isKeyboardActivationKey = (event: KeyboardEvent) => {
  return event.key === "Enter" || event.key === " ";
};

export const onKeyboardActivate = (
  event: KeyboardEvent,
  handler: () => void,
) => {
  if (!isKeyboardActivationKey(event)) {
    return;
  }

  event.preventDefault();
  handler();
};

type InnerControlTarget =
  | HTMLElement
  | SVGElement
  | { $el?: Element | null }
  | null
  | undefined;

type InnerControlA11yOptions = {
  label?: string;
  invalid?: boolean;
  describedBy?: string;
};

const resolveControlHost = (target: InnerControlTarget) => {
  if (!target) {
    return null;
  }

  if ("$el" in target) {
    return target.$el instanceof HTMLElement || target.$el instanceof SVGElement
      ? target.$el
      : null;
  }

  return target instanceof HTMLElement || target instanceof SVGElement
    ? target
    : null;
};

export const syncInnerInputA11y = (
  target: InnerControlTarget,
  options: InnerControlA11yOptions,
) => {
  const host = resolveControlHost(target);
  if (!host) {
    return;
  }

  const input =
    host instanceof HTMLInputElement || host instanceof HTMLTextAreaElement
      ? host
      : host.querySelector("input, textarea");

  if (!input) {
    return;
  }

  if (options.label) {
    input.setAttribute("aria-label", options.label);
  } else {
    input.removeAttribute("aria-label");
  }

  if (typeof options.invalid === "boolean") {
    input.setAttribute("aria-invalid", String(options.invalid));
  }

  if (options.describedBy) {
    input.setAttribute("aria-describedby", options.describedBy);
  } else {
    input.removeAttribute("aria-describedby");
  }
};
