<template>
  <div class="search-box">
    <Input v-model.trim="search" search placeholder="搜索玩家昵称" @on-search="searchHandler" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const search = ref();
const router = useRouter();

const searchHandler = () => {
  if (!search.value) {
    return;
  }
  router.push({ path: `/dota-data/dota-search/${search.value}` });
};
</script>
<style lang="scss" scoped>
.search-box {
  position: absolute;
  top: 9px;
  right: 0;
}
</style>
