<template>
  <div class="recent-match-box">
    <page-loading :show="loading" />
    <div v-if="!loading">
      <match-table :data-list="hooksValue.tableList" :show-items="true" />
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
import dayjs from 'dayjs';
import { reactive, ref } from 'vue';
import { getAllMatchAPI } from '../api';
import { getCacheHeroInfo, formatTimeStampMS, isRadiant, getCacheItem } from '@/utils';
import { gameModeMap, lobbyTypeMap } from '@/utils/map';
import { usePageQuery } from '@/hooks';

import matchTable from './matchTable.vue';

const loading = ref(false);
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});

const getAllMatch = async accountId => {
  if (hooksValue.tableList.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getAllMatchAPI(accountId);
  const dataList = response.data.map(item => {
    const {
      hero_id,
      start_time,
      game_mode,
      duration,
      lobby_type,
      radiant_win,
      player_slot,
      item_0,
      item_1,
      item_2,
      item_3,
      item_4,
      item_5
    } = item;
    const heroInfo = getCacheHeroInfo(hero_id);
    const itemsList = [item_0, item_1, item_2, item_3, item_4, item_5].filter(item => item > 0);
    return {
      ...item,
      ...heroInfo,
      isWin: isRadiant(player_slot) ? radiant_win : !radiant_win,
      duration: formatTimeStampMS(duration),
      lobby_type: lobbyTypeMap.get(lobby_type),
      game_mode: gameModeMap.get(game_mode),
      startTime: dayjs(start_time * 1000).format('YYYY-MM-DD'),
      items: itemsList
        .map(itemsId => {
          const itemInfo = getCacheItem(itemsId);
          return itemInfo ? `https://www.dota2.com.cn/items/images/${itemInfo?.img}` : null;
        })
        .filter(url => url !== null)
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
  getAllMatch
});
</script>
<style lang="scss">
.recent-match-box {
  min-height: 50px;
  .image-error {
    margin-top: 25px;
  }
}
</style>
