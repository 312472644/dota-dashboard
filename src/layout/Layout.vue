<template>
  <base-header />
  <div class="content-wrap">
    <div class="wrap">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
  <base-footer />
</template>
<script setup>
import BaseHeader from './BaseHeader.vue';
import BaseFooter from './BaseFooter.vue';
</script>
<style lang="scss">
.content-wrap {
  width: 100%;
  min-width: 1280px;
  margin: 20px 0;
  background: #f5f6f7;
  min-height: calc(100vh - 141px);
}
</style>
