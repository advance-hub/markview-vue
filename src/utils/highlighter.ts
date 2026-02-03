/**
 * Shiki 按需加载 - 仅打包常用语言，大幅减少打包体积
 */
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

// 直接导入主题（会被打包）
import githubLight from '@shikijs/themes/github-light'

// 预打包的常用语言列表
const BUNDLED_LANGS = [
  import('@shikijs/langs/javascript'),
  import('@shikijs/langs/typescript'),
  import('@shikijs/langs/json'),
  import('@shikijs/langs/html'),
  import('@shikijs/langs/css'),
  import('@shikijs/langs/python'),
  import('@shikijs/langs/bash'),
  import('@shikijs/langs/yaml'),
  import('@shikijs/langs/sql'),
  import('@shikijs/langs/java'),
  import('@shikijs/langs/go'),
  import('@shikijs/langs/jsx'),
  import('@shikijs/langs/tsx'),
  import('@shikijs/langs/vue'),
  import('@shikijs/langs/scss'),
]

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
      themes: [githubLight],
      langs: BUNDLED_LANGS,
      engine: createOnigurumaEngine(import('shiki/wasm')),
    }).then((hl) => {
      highlighterInstance = hl
      return hl
    })
  }

  return highlighterPromise
}

/**
 * 高亮代码
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()
  const loadedLangs = highlighter.getLoadedLanguages()
  
  // 如果语言未加载，回退到 text
  const finalLang = loadedLangs.includes(lang) ? lang : 'text'
  
  try {
    return highlighter.codeToHtml(code, {
      lang: finalLang,
      theme: 'github-light',
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
