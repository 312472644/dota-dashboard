<template>
  <div class="recent-box">
    <page-loading :show="loading" />
    <div v-if="!loading" class="recent-content">
      <div class="sub-title">
        <span class="strong">近期</span>
        <span>来自职业比赛的数据</span>
      </div>
      <Table class="table" :columns="columns" :data="hooksValue.tableList">
        <template #accountId="{ row }">
          <div class="inline-logo-box">
            <span class="link" @click="toPlayerDetail(row)">{{ row.account_id }}</span>
            <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
          </div>
        </template>
        <template #duration="{ row }">
          <div class="row-wrap">
            <span>{{ row.duration }}</span>
            <span>{{ row.radiant ? '天辉' : '夜魇' }}</span>
          </div>
        </template>
        <template #result="{ row }">
          <div class="row-wrap">
            <div @click="toMatchDetail(row)">
              <span :class="['link', row.winResult ? 'win' : 'lose']">{{
                row.winResult ? '比赛胜利' : '比赛失败'
              }}</span>
              <Icon type="ios-arrow-forward" size="13" :color="row.winResult ? '#19be6b' : '#ed4014'" />
            </div>
            <div>{{ row.league_name }}</div>
          </div>
        </template>
        <template #kills="{ row }">
          <div>{{ row.kills }}</div>
          <div class="percentage">
            <div class="percentage-bar" :style="`width:${row.killPercentage} `"></div>
            <div class="percentage-bar" :style="`width:${row.deathsPercentage} `"></div>
            <div class="percentage-bar" :style="`width:${row.assistsPercentage} `"></div>
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRecentListAPI } from '../api';
import { usePageQuery } from '@/hooks';
import { formatTimeStampMS } from '@/utils';

const columns = [
  { title: '帐户 ID', slot: 'accountId', width: '200px' },
  { title: '时长', slot: 'duration', width: '200px' },
  { title: '胜败', slot: 'result' },
  { title: '击杀', key: 'kills', width: '70px', slot: 'kills' },
  { title: '死亡', key: 'deaths', width: '70px' },
  { title: '助攻', key: 'assists', width: '70px' }
];

const router = useRouter();
const loading = ref(false);
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});

const getWinResult = row => {
  const { radiant, radiant_win } = row;
  if (radiant) {
    return radiant_win;
  }
  return !radiant_win;
};

const kdaPercentage = row => {
  const { kills, deaths, assists } = row;
  const total = kills + deaths + assists;
  const killPercentage = (parseFloat(kills / total) * 100).toFixed(2).concat('%');
  const deathsPercentage = (parseFloat(deaths / total) * 100).toFixed(2).concat('%');
  const assistsPercentage = (parseFloat(assists / total) * 100).toFixed(2).concat('%');
  return {
    killPercentage,
    deathsPercentage,
    assistsPercentage
  };
};

const load = async heroId => {
  if (hooksValue.tableList.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getRecentListAPI(heroId);
  const dataList = (response.data || []).map(item => {
    const { killPercentage, deathsPercentage, assistsPercentage } = kdaPercentage(item);
    return {
      ...item,
      killPercentage,
      deathsPercentage,
      assistsPercentage,
      winResult: getWinResult(item),
      duration: formatTimeStampMS(item.duration)
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

const toMatchDetail = row => {
  router.push({ path: `/dota-data/dota-match-detail/${row.match_id}` });
};

defineExpose({
  load
});
</script>
<style lang="scss">
.recent-box {
  min-height: 50px;
  .inline-logo-box {
    display: flex;
    align-items: center;
    font-size: 12px;
    .link {
      color: #2d8cf0;
      cursor: pointer;
    }
  }
  .percentage {
    display: flex;
    position: absolute;
    width: 180px;
    background: #c5c8ce;
    height: 4px;
    margin-top: 5px;
    .percentage-bar {
      height: 4px;
    }
    .percentage-bar:nth-of-type(1) {
      background-color: #19be6b;
    }
    .percentage-bar:nth-of-type(2) {
      background-color: #ed4014;
    }
    .percentage-bar:nth-of-type(3) {
      background-color: #808695;
    }
  }
}
</style>
