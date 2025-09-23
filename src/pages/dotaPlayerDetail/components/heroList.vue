<template>
  <div class="hero-list-box">
    <page-loading :show="loading" />
    <div v-if="!loading">
      <hero-table :data-list="hooksValue.tableList" :show-more-column="true" />
      <div class="page-container">
        <Page
          v-model="hooksValue.pageVO.index"
          :total="hooksValue.pageVO.total"
          :page-size="hooksValue.pageVO.size"
          show-sizer
          show-total
          @on-page-size-change="hooksValue.sizeChange"
          @on-change="hooksValue.pageChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { getHeroesAPI } from '../api';
import dayjs from 'dayjs';
import { getCacheHeroInfo } from '@/utils';
import { usePageQuery } from '@/hooks';

import heroTable from './heroTable.vue';

const loading = ref(false);
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});

const getHeroList = async accountId => {
  if (hooksValue.tableList.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getHeroesAPI(accountId);
  const dataList = (response.data || []).map(item => {
    const { games, win, hero_id, last_played, with_games, with_win, against_games, against_win } = item;
    const heroInfo = getCacheHeroInfo(hero_id);
    return {
      ...item,
      ...heroInfo,
      winRate: ((win / games) * 100).toFixed(1),
      withWinRate: ((with_win / with_games) * 100).toFixed(1),
      againstWinRate: ((against_win / against_games) * 100).toFixed(1),
      lastPlayed: dayjs(last_played * 1000).format('YYYY-MM-DD')
    };
  });
  const { pageVO, tableList, pageChange, sizeChange } = usePageQuery(dataList, 20);
  hooksValue.pageVO = pageVO;
  hooksValue.tableList = tableList;
  hooksValue.pageChange = pageChange;
  hooksValue.sizeChange = sizeChange;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

defineExpose({
  getHeroList
});
</script>
<style lang="scss">
.hero-list-box {
  min-height: 50px;
}
</style>
