<template>
  <page-header title="天梯排名" back hidden-breadcrumb @on-back="back" />
  <div class="dota-all-rank main-container">
    <div class="query">
      <Select v-model="region" style="width: 220px" @on-change="regionChange">
        <Option v-for="item in regionOption" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table class="table" :columns="columns" :data="tableList" :loading="loading">
      <template #order="{ row }">
        <span v-if="row.diff_rank === 0" class="default-order">-</span>
        <div v-else class="change-no">
          <Icon :type="row.order.type" :color="row.order.color" :size="18" />
          <span v-if="row.diff_rank !== 0" class="order-no" :style="`color:${row.order.color}`">
            {{ row.order.no }}
          </span>
        </div>
      </template>
      <template #player="{ row }">
        <div class="avatar" @click="toPlayerDetail(row)">
          <table-image :src="row?.steam_id_info?.avatar_url" width="35px" height="35px" fit="contain" />
          <span class="link">{{ row.name }}</span>
          <Icon v-if="row?.steam_id_info?.avatar_url" type="ios-arrow-forward" size="13" color="#2d8cf0" />
        </div>
        <div v-if="row?.steam_id_info?.rank_img_url" class="rank-image">
          <Image :src="row?.steam_id_info?.rank_img_url" lazy width="35px" height="35px"></Image>
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from 'view-ui-plus';
import { getRankListAPI } from '@/service/proxy-request';

const router = useRouter();
const loading = ref(false);
const regionOption = ref([
  { label: '国服', value: 'china' },
  { label: '美洲', value: 'americas' },
  { label: '欧洲', value: 'europe' },
  { label: '东南亚', value: 'se_asia' }
]);
const region = ref('china');
const columns = ref([
  { title: '排名', type: 'index' },
  { title: '排名变化', slot: 'order' },
  { title: '名称', slot: 'player' }
]);
const tableList = ref([]);

const back = () => {
  router.push({ path: '/' });
};

const getRankList = async () => {
  loading.value = true;
  const response = await getRankListAPI(region.value);
  const dataList = (response.data?.result || []).map(item => {
    const { diff_rank } = item;
    const isRankChange = diff_rank < 0;
    return {
      ...item,
      order: {
        no: Math.abs(diff_rank),
        type: isRankChange ? 'ios-arrow-up' : 'ios-arrow-down',
        color: isRankChange ? '#19be6b' : '#ed4014'
      }
    };
  });
  tableList.value = dataList.slice(0, 100);
  loading.value = false;
};

const toPlayerDetail = data => {
  const { steam_id_info } = data;
  if (!steam_id_info?.avatar_url) {
    Message.info({
      content: '暂时无该玩家信息~',
      duration: 3
    });
    return;
  }
  router.push({ path: `/dota-data/dota-player-detail/${steam_id_info.steam_id}` });
};

const regionChange = () => {
  getRankList();
};

onMounted(() => {
  getRankList();
});
</script>
<style lang="scss" scoped>
.dota-all-rank {
  padding: 20px;
  .query {
    padding-bottom: 20px;
  }
  .avatar {
    display: flex;
    align-items: center;
  }
  .default-order {
    display: inline-block;
    width: 20px;
    height: 20px;
    text-align: center;
  }
  .change-no {
    display: flex;
    align-items: center;
  }
  .order-no {
    font-size: 13px;
    padding-left: 5px;
  }
  .rank-image {
    position: absolute;
    top: 0;
    right: 0;
  }
  :deep .link {
    margin-left: 10px;
  }
  :deep .ivu-table-cell-slot {
    position: relative;
  }
}
</style>
