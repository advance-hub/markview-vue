/**
 * Shiki 按需加载 - 内置 3 种常用语言 + 双主题支持
 *
 * 内置语言：JavaScript, TypeScript, JSON
 * 内置主题：github-light, github-dark
 *
 * 使用者可通过 loadLanguages() 动态加载额外语言，
 * 也可通过 MarkdownRender 的 extraLangs prop 传入语言包。
 *
 * 支持三种传入方式：
 * 1. 单个语言：import('@shikijs/langs/python')
 * 2. 语言数组：[import('@shikijs/langs/python'), import('@shikijs/langs/rust')]
 * 3. 语言包（bundled）：import('@shikijs/langs') — 会自动解析包内所有语言定义
 */
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

// 直接导入主题（会被打包）
import githubLight from '@shikijs/themes/github-light'
import githubDark from '@shikijs/themes/github-dark'

// 内置的 3 种常用语言（异步 import，tree-shakable）
const BUILTIN_LANGS = [
  import('@shikijs/langs/javascript'),
  import('@shikijs/langs/typescript'),
  import('@shikijs/langs/json')
]

/** 支持的语言包输入类型 */
export type LangInput = Promise<any>[] | Promise<any>

let highlighterInstance: HighlighterCore | null = null
let highlighterPromise: Promise<HighlighterCore> | null = null

/**
 * 获取 highlighter 实例（单例模式）
 */
export async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance) {
    return highlighterInstance
  }

  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: BUILTIN_LANGS,
      engine: createOnigurumaEngine(import('shiki/wasm')),
    }).then((hl) => {
      highlighterInstance = hl
      return hl
    })
  }

  return highlighterPromise
}

/**
 * 从模块中提取语言定义列表
 * 支持多种导出格式：
 * - default export 为单个语言定义对象
 * - default export 为语言定义数组
 * - 模块本身是语言定义对象（有 name 属性）
 * - 模块是一个包（多个 named exports，每个是语言定义或语言定义数组）
 */
function extractLangDefs(langModule: any): any[] {
  const defs: any[] = []

  // 优先取 default export
  const defaultExport = langModule.default || langModule

  if (Array.isArray(defaultExport)) {
    // default 是数组：可能是单个语言的多定义（如 typescript 包含 ts + tsx）
    for (const item of defaultExport) {
      if (item && item.name) {
        defs.push(item)
      }
    }
  } else if (defaultExport && typeof defaultExport === 'object' && defaultExport.name) {
    // default 是单个语言定义
    defs.push(defaultExport)
  }

  // 如果 default 没有提取到有效定义，尝试遍历所有 named exports（bundle 模式）
  if (defs.length === 0 && typeof langModule === 'object') {
    for (const key of Object.keys(langModule)) {
      if (key === 'default' || key === '__esModule') continue
      const val = langModule[key]
      if (Array.isArray(val)) {
        for (const item of val) {
          if (item && item.name) defs.push(item)
        }
      } else if (val && typeof val === 'object' && val.name) {
        defs.push(val)
      }
    }
  }

  return defs
}

/**
 * 动态加载额外语言
 *
 * @param langs - 语言包输入，支持以下格式：
 *   - 单个语言 Promise：`import('@shikijs/langs/python')`
 *   - 语言 Promise 数组：`[import('@shikijs/langs/python'), import('@shikijs/langs/rust')]`
 *   - 语言包 Promise：`import('@shikijs/langs')` — 自动解析包内所有语言
 *
 * @example
 * ```ts
 * // 方式1：传入单个语言
 * await loadLanguages(import('@shikijs/langs/python'))
 *
 * // 方式2：传入多个语言
 * await loadLanguages([
 *   import('@shikijs/langs/python'),
 *   import('@shikijs/langs/rust'),
 * ])
 *
 * // 方式3：传入整个语言包（会自动解析所有语言）
 * await loadLanguages(import('@shikijs/langs'))
 * ```
 */
export async function loadLanguages(langs: LangInput): Promise<void> {
  if (!langs || (Array.isArray(langs) && langs.length === 0)) return
  const highlighter = await getHighlighter()
  const loaded = highlighter.getLoadedLanguages()
  const list = Array.isArray(langs) ? langs : [langs]
  const resolved = await Promise.all(list)

  for (const langModule of resolved) {
    const langDefs = extractLangDefs(langModule)
    for (const def of langDefs) {
      if (def.name && !loaded.includes(def.name)) {
        try {
          await highlighter.loadLanguage(def)
        } catch {
          // 静默跳过加载失败的语言（可能是不兼容的格式）
        }
      }
    }
  }
}

/**
 * 高亮代码
 *
 * @param code - 源代码
 * @param lang - 语言标识
 * @param theme - 主题名称，'light' | 'dark'，默认 'light'
 */
export async function highlightCode(
  code: string,
  lang: string,
  theme: 'light' | 'dark' = 'light'
): Promise<string> {
  const highlighter = await getHighlighter()
  const loadedLangs = highlighter.getLoadedLanguages()

  // 如果语言未加载，回退到 text
  const finalLang = loadedLangs.includes(lang) ? lang : 'text'
  const shikiTheme = theme === 'dark' ? 'github-dark' : 'github-light'

  try {
    return highlighter.codeToHtml(code, {
      lang: finalLang,
      theme: shikiTheme,
    })
  } catch {
    // 出错时返回转义后的纯文本
    return `<pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`
  }
}

/**
 * 获取已加载的语言列表
 */
export async function getLoadedLanguages(): Promise<string[]> {
  const highlighter = await getHighlighter()
  return highlighter.getLoadedLanguages()
}
