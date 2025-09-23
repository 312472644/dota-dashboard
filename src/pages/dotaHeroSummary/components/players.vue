<template>
  <div class="players-box">
    <page-loading :show="loading" />
    <div v-if="!loading">
      <div class="sub-title">
        <span class="strong">玩家</span>
        <span>来自职业比赛的数据</span>
      </div>
      <Table class="table" :columns="columns" :data="hooksValue.tableList">
        <template #player="{ row }">
          <div class="inline-logo-box" @click="toPlayerDetail(row)">
            <table-image :src="row.avatar" />
            <span class="link">{{ row.accountName }}</span>
            <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
          </div>
        </template>
      </Table>
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
import { useRouter } from 'vue-router';
import { getPlayersAPI } from '../api';
import { usePageQuery } from '@/hooks';
import { getProPlayerListAPI } from '@/service/common';

const loading = ref(false);
const router = useRouter();
const columns = [
  { title: '帐户 ID', slot: 'player' },
  { title: '游戏次数', key: 'games_played' },
  { title: '胜率', key: 'winRate' }
];
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});

const getProPlayers = async () => {
  const response = await getProPlayerListAPI();
  return response.data || [];
};

const load = async heroId => {
  if (hooksValue.tableList.length > 0) {
    return;
  }
  loading.value = true;
  const proPlayers = await getProPlayers();
  const response = await getPlayersAPI(heroId);
  const dataList = (response.data || []).map(item => {
    const account = proPlayers.find(subItem => subItem.account_id === item.account_id) || {};
    return {
      ...item,
      avatar: account.avatarfull,
      accountName: account.name || item.account_id,
      winRate: (parseFloat(item.wins / item.games_played) * 100).toFixed(1).concat('%')
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

const toPlayerDetail = row => {
  router.push({ path: `/dota-data/dota-player-detail/${row.account_id}` });
};

defineExpose({
  load
});
</script>
<style lang="scss">
.players-box {
  min-height: 50px;
  .link {
    margin-left: 10px;
  }
}
</style>
