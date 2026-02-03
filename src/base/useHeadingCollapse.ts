import { ref, provide, inject, type InjectionKey, type Ref } from 'vue';

export interface HeadingCollapseState {
  collapsedIds: Ref<Set<string>>;
  toggle: (id: string) => void;
  isCollapsed: (id: string) => boolean;
}

export const HeadingCollapseKey: InjectionKey<HeadingCollapseState> = Symbol('HeadingCollapse');

/**
 * 提供标题折叠状态（在 MarkdownRender 中调用）
 */
export function provideHeadingCollapse(): HeadingCollapseState {
  const collapsedIds = ref<Set<string>>(new Set());

  const toggle = (id: string) => {
    const newSet = new Set(collapsedIds.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    collapsedIds.value = newSet;
  };

  const isCollapsed = (id: string) => collapsedIds.value.has(id);

  const state: HeadingCollapseState = { collapsedIds, toggle, isCollapsed };
  provide(HeadingCollapseKey, state);
  return state;
}

/**
 * 获取标题折叠状态（在 Heading 中调用）
 */
export function useHeadingCollapse(): HeadingCollapseState | null {
  return inject(HeadingCollapseKey, null);
}

/**
 * 生成随机 hash
 */
function randomHash(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * 生成唯一的标题 ID（文本前缀 + 随机 hash）
 */
export function generateHeadingId(text: string): string {
  const prefix = text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .slice(0, 20);
  
  return prefix ? `${prefix}-${randomHash()}` : `heading-${randomHash()}`;
}

/**
 * 折叠/展开标题后的内容
 * 遍历标题元素后的兄弟节点，直到遇到同级或更高级标题
 */
export function collapseHeadingContent(headingEl: HTMLElement, level: number, collapsed: boolean): void {
  let sibling = headingEl.nextElementSibling;
  
  while (sibling) {
    const tagName = sibling.tagName.toLowerCase();
    
    // 遇到同级或更高级标题时停止
    if (/^h[1-6]$/.test(tagName)) {
      const siblingLevel = parseInt(tagName[1]);
      if (siblingLevel <= level) break;
    }
    
    const el = sibling as HTMLElement;
    if (collapsed) {
      el.setAttribute('data-collapsed', 'true');
      el.style.display = 'none';
    } else {
      el.removeAttribute('data-collapsed');
      el.style.display = '';
    }
    
    sibling = sibling.nextElementSibling;
  }
}
