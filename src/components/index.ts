import { defineComponent, h } from 'vue';
import Heading from './Heading.vue';
import List from './List.vue';

/** 标题组件工厂 */
function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  return defineComponent({
    name: `MdH${level}`,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(Heading, { ...attrs, level }, slots);
    },
  });
}

export const h1 = createHeading(1);
export const h2 = createHeading(2);
export const h3 = createHeading(3);
export const h4 = createHeading(4);
export const h5 = createHeading(5);
export const h6 = createHeading(6);

/** 列表组件工厂 */
export const ul = defineComponent({
  name: 'MdUl',
  setup(_, { slots }) {
    return () => h(List, { ordered: false }, slots);
  },
});

export const ol = defineComponent({
  name: 'MdOl',
  setup(_, { slots }) {
    return () => h(List, { ordered: true }, slots);
  },
});

// 内联元素
export { default as a } from './Link.vue';
export { default as p } from './Paragraph.vue';
export { default as img } from './MdImage.vue';
export { default as code } from './InlineCode.vue';
export { default as li } from './ListItem.vue';
export { default as hr } from './HorizontalRule.vue';
export { default as strong } from './Strong.vue';
export { default as em } from './Emphasis.vue';
export { default as del } from './Delete.vue';
export { default as mark } from './Mark.vue';

// 块级组件
export { default as CodeBlock } from './CodeBlock.vue';
export { default as Table } from './Table.vue';
export { default as Blockquote } from './Blockquote.vue';
export { default as BlockHeader } from './BlockHeader.vue';
export { default as Heading } from './Heading.vue';
export { default as List } from './List.vue';
export { default as ListItem } from './ListItem.vue';
export { default as HorizontalRule } from './HorizontalRule.vue';
export { default as Strong } from './Strong.vue';
export { default as Emphasis } from './Emphasis.vue';
export { default as Delete } from './Delete.vue';
export { default as Mark } from './Mark.vue';
export { default as Container } from './Container.vue';

// TOC 目录组件
export { default as Toc } from './Toc.vue';
export type { TocItem, TocProps } from './Toc.vue';
