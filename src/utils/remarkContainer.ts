/**
 * 自定义容器语法支持
 * 
 * 支持 VitePress 风格的容器语法：
 * 
 * ::: tip
 * 这是一个提示框
 * :::
 * 
 * ::: warning
 * 这是一个警告框
 * :::
 * 
 * ::: danger
 * 这是一个危险提示框
 * :::
 * 
 * ::: info
 * 这是一个信息框
 * :::
 * 
 * 支持自定义标题：
 * ::: tip 自定义标题
 * 内容
 * :::
 */

export type ContainerType = 'tip' | 'warning' | 'danger' | 'info' | 'note' | 'caution';

const CONTAINER_TYPES = ['tip', 'warning', 'danger', 'info', 'note', 'caution'];

/**
 * 预处理 Markdown：将 ::: 容器语法转换为 JSX 组件
 * VitePress 标准格式（仅支持多行）
 * 
 * 格式：
 * ::: tip
 * 内容
 * :::
 * 
 * ::: warning 自定义标题
 * 内容
 * :::
 */
export function preprocessContainers(markdown: string): string {
  const lines = markdown.split('\n');
  const result: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // 检查是否是容器开始标记：::: type [title]
    if (trimmed.startsWith(':::') && trimmed !== ':::') {
      const afterColons = trimmed.slice(3).trim();
      
      if (afterColons) {
        // 分离类型和标题
        const spaceIndex = afterColons.indexOf(' ');
        const type = spaceIndex > 0 ? afterColons.slice(0, spaceIndex) : afterColons;
        const title = spaceIndex > 0 ? afterColons.slice(spaceIndex + 1).trim() : '';
        
        // 检查类型是否有效
        if (CONTAINER_TYPES.includes(type.toLowerCase())) {
          const containerType = type.toLowerCase();
          const contentLines: string[] = [];
          
          // 收集内容直到遇到结束标记
          i++;
          while (i < lines.length) {
            const currentLine = lines[i];
            const currentTrimmed = currentLine.trim();
            
            // 检查是否是结束标记（单独一行的 :::）
            if (currentTrimmed === ':::') {
              break;
            }
            contentLines.push(currentLine);
            i++;
          }
          
          // 生成 JSX 组件
          const content = contentLines.join('\n').trim();
          
          // 使用 JSX 语法
          if (title) {
            result.push('');
            result.push(`<MdContainer type="${containerType}" title="${escapeJsxAttr(title)}">`);
          } else {
            result.push('');
            result.push(`<MdContainer type="${containerType}">`);
          }
          result.push('');
          result.push(content);
          result.push('');
          result.push('</MdContainer>');
          result.push('');
          
          i++; // 跳过结束标记
          continue;
        }
      }
    }
    
    result.push(line);
    i++;
  }
  
  return result.join('\n');
}

/**
 * 转义 JSX 属性值中的特殊字符
 */
function escapeJsxAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default preprocessContainers;
