<template>
  <div class="pro-match">
    <Table class="table" :columns="columns" :loading="loading" :data="tableList">
      <template #name="{ row }">
        <div class="inline-logo-box" @click="toHeroSummary(row)">
          <table-image :src="row.index_img" fit="cover" />
          <span class="link">{{ row.name_loc }}</span>
          <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
        </div>
      </template>
      <template #loading>
        <Spin fix class="table-load">
          <Icon type="ios-loading" size="18" class="spin-icon-load"></Icon>
          <div class="load-text">加载中...</div>
        </Spin>
      </template>
    </Table>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCacheHeroInfo } from '@/utils';
import { getHeroStatsAPI } from '../api';

const loading = ref(false);
const tableList = ref([]);
const router = useRouter();
const columns = [
  { title: '序号', type: 'index', width: '60px' },
  { title: '英雄名称', slot: 'name' },
  { title: '职业比赛 BAN 次数', key: 'banCount', sortable: true, sortType: 'desc' },
  { title: '职业比赛 选择次数', key: 'pro_pick', sortable: true },
  { title: '职业比赛 禁次数', key: 'pro_ban', sortable: true },
  { title: '职业比赛 胜次数', key: 'pro_win', sortable: true }
];

const getHeroStats = async () => {
  loading.value = true;
  const response = await getHeroStatsAPI();
  const dataList = (response.data || []).map(item => {
    const { hero_id, pro_ban, pro_pick, pro_win } = item;
    const { name_loc, index_img } = getCacheHeroInfo(hero_id);
    return {
      ...item,
      banCount: pro_ban + pro_pick + pro_win,
      name_loc,
      index_img
    };
  });
  tableList.value.push(...dataList);
  loading.value = false;
};

const toHeroSummary = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

onMounted(() => {
  getHeroStats();
});
</script>
<style lang="scss" scoped>
.pro-match {
  :deep .link {
    padding-left: 10px;
  }
}
</style>
