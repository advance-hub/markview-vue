<template>
  <div class="custom-tabs">
    <div class="custom-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['custom-tabs__tab', { 'custom-tabs__tab--active': activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="custom-tabs__content">
      <div v-if="activeTab === 'Tab 1'" class="custom-tabs__pane">
        <h3>选项卡 1 内容</h3>
        <p>这是第一个选项卡的内容，支持完整的 Markdown 渲染。</p>
      </div>
      <div v-if="activeTab === 'Tab 2'" class="custom-tabs__pane">
        <h3>选项卡 2 内容</h3>
        <p>这是第二个选项卡的内容。</p>
      </div>
      <div v-if="activeTab === 'Tab 3'" class="custom-tabs__pane">
        <h3>选项卡 3 内容</h3>
        <p>这是第三个选项卡的内容。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  tabs?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => ['Tab 1', 'Tab 2', 'Tab 3'],
});

const activeTab = ref(props.tabs[0]);
</script>

<style scoped>
.custom-tabs {
  margin: 16px 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.custom-tabs__nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.custom-tabs__tab {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.custom-tabs__tab:hover {
  color: #374151;
  background: rgba(0, 100, 250, 0.04);
}

.custom-tabs__tab--active {
  color: #0064fa;
  background: #fff;
}

.custom-tabs__tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #0064fa;
}

.custom-tabs__content {
  padding: 20px;
}

.custom-tabs__pane h3 {
  margin: 0 0 12px;
  font-size: 16px;
  color: #111827;
}

.custom-tabs__pane p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}
</style>
