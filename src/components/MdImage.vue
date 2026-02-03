<template>
  <figure class="md-figure">
    <div class="md-figure__image" @click="previewVisible = true">
      <Image :src="src" :alt="alt" width="100%" fit="contain" />
      <div class="md-figure__mask">
        <Icon name="zoom-in" :size="32" />
      </div>
    </div>
    <figcaption v-if="alt" class="md-figure__caption">{{ alt }}</figcaption>
    <ImagePreview :visible="previewVisible" :src="src || ''" :title="alt" @close="previewVisible = false" />
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Image, ImagePreview, Icon } from '../base';

defineProps<{
  src?: string;
  alt?: string;
}>();

const previewVisible = ref(false);
</script>

<style scoped lang="scss">
.md-figure {
  margin: 20px 0;
  text-align: center;

  &__image {
    position: relative;
    display: inline-block;
    cursor: zoom-in;
    border-radius: 8px;
    overflow: hidden;

    &:hover .md-figure__mask { opacity: 1; }
  }

  &__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.2s;
    color: #fff;
  }

  &__caption {
    margin-top: 8px;
    font-size: 12px;
    color: var(--md-color-text-tertiary, #737373);
    text-align: center;
  }
}
</style>
