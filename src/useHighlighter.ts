/**
 * useHighlighter - Composable + Plugin 模式管理 Shiki 语言加载
 *
 * 两种使用方式：
 *
 * 方式 1：Plugin 模式（推荐，应用初始化时注册）
 * ```ts
 * import { createHighlighterPlugin } from 'markview-vue'
 *
 * app.use(createHighlighterPlugin({
 *   langs: [
 *     import('@shikijs/langs/python'),
 *     import('@shikijs/langs/rust'),
 *   ]
 * }))
 * ```
 *
 * 方式 2：Composable 模式（组件内按需加载）
 * ```ts
 * import { useHighlighter } from 'markview-vue'
 *
 * const { loadLangs, isReady, loadedLangs } = useHighlighter()
 * await loadLangs([import('@shikijs/langs/go')])
 * ```
 *
 * 方式 3：保持原有 extraLangs prop（向后兼容）
 * ```vue
 * <MarkdownRender :extra-langs="[import('@shikijs/langs/python')]" />
 * ```
 */
import { ref, readonly, type App, type Plugin } from 'vue'
import { loadLanguages, getLoadedLanguages, getHighlighter, type LangInput } from './utils/highlighter'

// 全局状态（单例，跨组件共享）
const isReady = ref(false)
const loadedLangs = ref<string[]>([])
const isLoading = ref(false)

/** 刷新已加载语言列表 */
async function refreshLoadedLangs() {
  try {
    loadedLangs.value = await getLoadedLanguages()
  } catch {
    // 静默
  }
}

/**
 * 加载额外语言
 *
 * @param langs - 支持单个 Promise、Promise 数组、或整个语言包
 */
async function loadLangs(langs: LangInput): Promise<void> {
  if (!langs || (Array.isArray(langs) && langs.length === 0)) return

  isLoading.value = true
  try {
    await loadLanguages(langs)
    await refreshLoadedLangs()
  } finally {
    isLoading.value = false
  }
}

/**
 * 确保 highlighter 已初始化
 */
async function ensureReady(): Promise<void> {
  if (isReady.value) return
  await getHighlighter()
  await refreshLoadedLangs()
  isReady.value = true
}

// ========================
// Composable
// ========================

export interface UseHighlighterReturn {
  /** highlighter 是否已初始化 */
  isReady: typeof isReady
  /** 当前已加载的语言列表 */
  loadedLangs: typeof loadedLangs
  /** 是否正在加载语言 */
  isLoading: typeof isLoading
  /** 加载额外语言 */
  loadLangs: typeof loadLangs
  /** 确保 highlighter 已初始化 */
  ensureReady: typeof ensureReady
  /** 刷新已加载语言列表 */
  refreshLoadedLangs: typeof refreshLoadedLangs
}

/**
 * Composable：在组件内使用 highlighter
 *
 * @example
 * ```ts
 * const { loadLangs, loadedLangs, isReady } = useHighlighter()
 *
 * onMounted(async () => {
 *   await loadLangs(import('@shikijs/langs/go'))
 *   console.log('已加载:', loadedLangs.value)
 * })
 * ```
 */
export function useHighlighter(): UseHighlighterReturn {
  return {
    isReady: readonly(isReady) as typeof isReady,
    loadedLangs: readonly(loadedLangs) as typeof loadedLangs,
    isLoading: readonly(isLoading) as typeof isLoading,
    loadLangs,
    ensureReady,
    refreshLoadedLangs,
  }
}

// ========================
// Plugin
// ========================

export interface HighlighterPluginOptions {
  /** 需要预加载的语言包 */
  langs?: LangInput
}

/**
 * 创建 Highlighter Vue Plugin
 *
 * 在应用初始化时预加载语言，后续所有 MarkdownRender 实例自动可用。
 *
 * @example
 * ```ts
 * import { createHighlighterPlugin } from 'markview-vue'
 *
 * // 方式 1：传入多个语言
 * app.use(createHighlighterPlugin({
 *   langs: [
 *     import('@shikijs/langs/python'),
 *     import('@shikijs/langs/rust'),
 *     import('@shikijs/langs/go'),
 *   ]
 * }))
 *
 * // 方式 2：传入整个语言包
 * app.use(createHighlighterPlugin({
 *   langs: import('@shikijs/langs')
 * }))
 * ```
 */
export function createHighlighterPlugin(options: HighlighterPluginOptions = {}): Plugin {
  return {
    install(_app: App) {
      // 应用启动时异步预加载语言（不阻塞渲染）
      ensureReady().then(async () => {
        if (options.langs) {
          await loadLangs(options.langs)
        }
      })
    },
  }
}
