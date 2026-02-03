<template>
  <div class="md-skeleton" :class="{ 'md-skeleton--active': active }">
    <div class="md-skeleton__title"></div>
    <ul class="md-skeleton__paragraph">
      <li v-for="i in 3" :key="`p1-${i}`"></li>
    </ul>
    <div class="md-skeleton__code">
      <div class="md-skeleton__code-header"></div>
      <div class="md-skeleton__code-body">
        <ul class="md-skeleton__paragraph">
          <li v-for="i in 4" :key="`code-${i}`"></li>
        </ul>
      </div>
    </div>
    <ul class="md-skeleton__paragraph">
      <li v-for="i in 3" :key="`p2-${i}`"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  active?: boolean;
}>(), {
  active: true,
});
</script>

<style scoped lang="scss">
$color-skeleton-bg: var(--md-color-bg-spotlight, #f5f5f5);
$color-skeleton-active: var(--md-color-border, #e8e8e8);

.md-skeleton {
  padding: 24px;

  &__title {
    width: 40%;
    height: 24px;
    margin-bottom: 24px;
    background: $color-skeleton-bg;
    border-radius: 4px;
  }

  &__paragraph {
    margin: 0 0 20px;
    padding: 0;
    list-style-type: none;

    li {
      width: 100%;
      height: 16px;
      margin-bottom: 10px;
      background: $color-skeleton-bg;
      border-radius: 4px;

      &:last-child {
        width: 60%;
        margin-bottom: 0;
      }
    }
  }

  &__code {
    margin: 20px 0;
    border-radius: 12px;
    overflow: hidden;
  }

  &__code-header {
    height: 36px;
    background: var(--md-code-header-bg, #f0f0f2);
  }

  &__code-body {
    padding: 16px 20px;
    background: var(--md-code-body-bg, rgba(17, 17, 51, 0.02));
    border: 1px solid var(--md-color-border, #e5e5e5);
    border-top: none;
    border-radius: 0 0 12px 12px;

    .md-skeleton__paragraph {
      margin-bottom: 0;

      li {
        &:nth-child(1) { width: 70%; }
        &:nth-child(2) { width: 90%; }
        &:nth-child(3) { width: 60%; }
        &:nth-child(4) { width: 80%; }
        &:last-child { width: 80%; }
      }
    }
  }

  &--active {
    .md-skeleton__title,
    .md-skeleton__paragraph li {
      background: linear-gradient(90deg, $color-skeleton-bg 25%, $color-skeleton-active 44%, $color-skeleton-bg 88%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.5s ease infinite;
    }
  }
}

@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
</style>
