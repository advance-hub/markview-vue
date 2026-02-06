<template>
  <div class="dev-container">
    <MarkdownRender :raw="content" theme="light" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MarkdownRender from '../src/MarkdownRender.vue';
import '../src/styles/index.scss';
import demoMd from './demo.md?raw';

const content = ref(demoMd);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
}

.dev-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
