<template>
  <page-header title="英雄胜率" back hidden-breadcrumb @on-back="back" />
  <div class="dota-hero-rate main-container">
    <Tabs class="tab-animate tab-center" :animated="false">
      <TabPane label="职业比赛" name="proMatch">
        <pro-match />
      </TabPane>
      <TabPane label="公开" name="publicMatch">
        <public-match />
      </TabPane>
    </Tabs>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import proMatch from './components/proMatch.vue';
import publicMatch from './components/publicMatch.vue';

const router = useRouter();

const back = () => {
  router.push({ path: '/dota-data' });
};
</script>
<style lang="scss" scoped>
.dota-hero-rate {
  padding: 20px;
  min-height: 50px;
}
</style>
