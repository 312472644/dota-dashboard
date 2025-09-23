<template>
  <div class="match-up-box">
    <page-loading :show="loading" />
    <div v-if="!loading" class="match-up-content">
      <div class="sub-title">
        <span class="strong">匹配</span>
        <span>来自职业比赛的数据</span>
      </div>
      <Table class="table" :columns="columns" :data="tableList">
        <template #heroes="{ row }">
          <div class="inline-logo-box" @click="toHeroDetail(row)">
            <table-image :src="row.avatar" fit="cover" />
            <span class="link">{{ row.name }}</span>
            <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getHeroMatchUpsAPI } from '../api';
import { getCacheHeroInfo } from '@/utils';

const router = useRouter();
const loading = ref(false);
const columns = [
  { title: '击杀英雄', slot: 'heroes' },
  { title: '游戏次数', key: 'games_played' },
  { title: '胜率', key: 'winRate' }
];
const tableList = reactive([]);

const load = async heroId => {
  if (tableList.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getHeroMatchUpsAPI(heroId);
  const dataList = (response.data || []).map(item => {
    const hero = getCacheHeroInfo(item.hero_id);
    return {
      ...item,
      winRate: (parseFloat(item.wins / item.games_played) * 100).toFixed(1).concat('%'),
      name: hero.name_loc,
      avatar: hero.index_img
    };
  });
  tableList.push(...dataList);
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const toHeroDetail = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

defineExpose({
  load
});
</script>
<style lang="scss" scoped>
.match-up-box {
  min-height: 50px;
  .link {
    margin-left: 10px;
  }
  :deep .ivu-image-img {
    border-radius: 0;
  }
}
</style>
