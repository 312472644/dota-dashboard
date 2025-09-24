<template>
  <div class="public-match">
    <Row class="search">
      <Col class="item" :span="4">
        <Select v-model="rankTier" :transfer="true" @on-change="getHeroTop">
          <Option v-for="item in rankTierOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col class="item" :span="4">
        <Select v-model="version" :transfer="true" @on-change="getHeroTop">
          <Option v-for="item in versionOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <Table class="table" :columns="columns" :data="tableList" :loading="loading">
      <template #name="{ row }">
        <div class="inline-logo-box" @click="toHeroSummary(row)">
          <table-image :src="row.hero_img" fit="cover" />
          <span class="link">{{ row.hero_name }}</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getVersionListAPI, getHeroTopAPI } from '@/service/common';

const rankTier = ref('冠绝');
const version = ref('');
const router = useRouter();
const columns = [
  { title: '序号', type: 'index', width: '60px' },
  { title: '英雄名称', slot: 'name' },
  { title: '胜率', key: 'winRate', sortable: true, sortType: 'desc' },
  { title: '天梯段位', key: 'score_rank', sortable: true },
  { title: '英雄选择率', key: 'hero_picks_rate', sortable: true },
  { title: '人气', key: 'popularity', sortable: true }
];
const loading = ref(false);
const tableList = ref([]);
const rankTierOptions = ref([
  { label: '先锋', value: '先锋' },
  { label: '卫士', value: '卫士' },
  { label: '中军', value: '中军' },
  { label: '统帅', value: '统帅' },
  { label: '传奇', value: '传奇' },
  { label: '万古流芳', value: '万古流芳' },
  { label: '超凡入圣', value: '超凡入圣' },
  { label: '冠绝一世', value: '冠绝' }
]);
const versionOptions = ref([]);

const getVersionList = async () => {
  const response = await getVersionListAPI();
  const dataList = response.data.result || [];
  versionOptions.value.push(
    ...dataList
      .map(item => {
        return {
          label: item,
          value: item
        };
      })
      .reverse()
  );
  version.value = versionOptions.value[0].value;
};

const getHeroTop = async () => {
  loading.value = true;
  const response = await getHeroTopAPI(version.value, rankTier.value);
  const dataList = response.data?.result || [];
  const sortList = dataList.sort((a, b) => b.hero_win_rate - a.hero_win_rate);
  const resultList = [];
  resultList.push(
    ...sortList.map(item => {
      const { hero_picks_rate, hero_win_rate } = item;
      return {
        ...item,
        winRate: parseFloat(hero_win_rate * 100).toFixed(1),
        hero_picks_rate: parseFloat(hero_picks_rate * 100).toFixed(1)
      };
    })
  );
  tableList.value = [...resultList];
  loading.value = false;
};

const toHeroSummary = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

onMounted(async () => {
  await getVersionList();
  await getHeroTop();
});
</script>
<style lang="scss" scoped>
.public-match {
  .search {
    padding-bottom: 10px;
    .item {
      margin-right: 15px;
    }
  }
  :deep .link {
    padding-left: 10px;
  }
}
</style>
