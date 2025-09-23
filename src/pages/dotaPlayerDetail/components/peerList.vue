<template>
  <div class="peer-list-box">
    <page-loading :show="loading" />
    <div v-if="!loading">
      <peer-table :data-list="hooksValue.tableList" :show-more-column="true" />
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
import { reactive, ref } from 'vue';
import peerTable from './peerTable.vue';
import { getPeersAPI } from '../api';
import { usePageQuery } from '@/hooks';

const loading = ref(false);
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});

const getPeerList = async accountId => {
  if (hooksValue.tableList.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getPeersAPI(accountId);
  const dataList = (response.data || []).map(item => {
    const { personaname, name, games, win, against_games, against_win, with_gpm_sum, with_games, with_xpm_sum } = item;
    return {
      ...item,
      personName: name || personaname,
      winRate: ((win / games) * 100).toFixed(1),
      againstWinRate: ((against_win / against_games) * 100).toFixed(1),
      gpm: parseInt(with_gpm_sum / with_games),
      xpm: parseInt(with_xpm_sum / with_games)
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
  getPeerList
});
</script>
<style lang="scss">
.peer-list-box {
  min-height: 50px;
}
</style>
