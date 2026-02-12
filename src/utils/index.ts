export { extractTextFromVNode, extractLanguageFromVNode } from './vnode';
export { normalizeLanguage, trimCodeLines, copyToClipboard, LANGUAGE_ALIASES } from './code';
export { highlightCode, getHighlighter, getLoadedLanguages, loadLanguages } from './highlighter';
export type { LangInput } from './highlighter';
export { preprocessContainers } from './remarkContainer';
export type { ContainerType } from './remarkContainer';
