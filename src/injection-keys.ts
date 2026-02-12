import type { InjectionKey, Ref } from 'vue';

export type MarkdownThemeMode = 'light' | 'dark';

export const MarkdownThemeKey: InjectionKey<Ref<MarkdownThemeMode>> = Symbol('MarkdownTheme');
