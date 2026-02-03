import type { VNode } from 'vue';

/**
 * 从 VNode 递归提取纯文本内容
 */
export function extractTextFromVNode(vnode: VNode | VNode[] | string | number | null | undefined): string {
  if (!vnode) return '';
  if (typeof vnode === 'string') return vnode;
  if (typeof vnode === 'number') return String(vnode);
  
  if (Array.isArray(vnode)) {
    return vnode.map(extractTextFromVNode).join('');
  }
  
  if (vnode.children) {
    if (typeof vnode.children === 'string') return vnode.children;
    if (Array.isArray(vnode.children)) {
      return (vnode.children as VNode[]).map(extractTextFromVNode).join('');
    }
    if (typeof vnode.children === 'object' && 'default' in vnode.children) {
      const defaultSlot = (vnode.children as Record<string, () => VNode[]>).default;
      if (typeof defaultSlot === 'function') {
        return extractTextFromVNode(defaultSlot());
      }
    }
  }
  
  return '';
}

/**
 * 从 VNode 中提取语言标识（用于代码块）
 */
export function extractLanguageFromVNode(vnode: VNode | VNode[] | null | undefined): string {
  if (!vnode) return 'text';
  
  if (Array.isArray(vnode)) {
    for (const child of vnode) {
      const lang = extractLanguageFromVNode(child);
      if (lang !== 'text') return lang;
    }
    return 'text';
  }
  
  const className = (vnode.props?.className || vnode.props?.class || '') as string;
  if (typeof className === 'string') {
    const match = className.match(/language-(\w+)/);
    if (match) return match[1];
  }
  
  if (vnode.children && Array.isArray(vnode.children)) {
    for (const child of vnode.children as VNode[]) {
      const lang = extractLanguageFromVNode(child);
      if (lang !== 'text') return lang;
    }
  }
  
  return 'text';
}
