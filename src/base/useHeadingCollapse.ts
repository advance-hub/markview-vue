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
 * 根据文本内容生成标题 ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .slice(0, 50);
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
