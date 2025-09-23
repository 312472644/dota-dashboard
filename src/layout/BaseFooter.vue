<template>
  <div class="footer-box">
    <div class="footer">
      <span class="footer-item">Copyright © 2022-{{ currentDate }}</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const currentDate = ref(new Date().getFullYear());
</script>
<style lang="scss" scoped>
.footer-box {
  position: relative;
  min-width: 1280px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  .footer {
    text-align: center;
    width: 1280px;
    margin: 0 auto 10px auto;
    .footer-item {
      &:not(:first-of-type) {
        padding-left: 10px;
      }
    }
  }
}
</style>
