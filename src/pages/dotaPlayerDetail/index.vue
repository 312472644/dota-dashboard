<template>
  <page-header title="玩家详情" hidden-breadcrumb />
  <div class="dota-player-detail-box main-container">
    <page-loading :show="loading" />
    <div v-show="!loading">
      <player-base @complete="loadComplete" />
      <div class="content">
        <Tabs v-model="tabName" class="tab-animate tab-center" :animated="false" @on-click="tabClick">
          <TabPane label="概观" name="overview"><overview :account-id="accountId" @complete="loadComplete" /></TabPane>
          <TabPane label="近期战绩" name="recent">
            <recent-match ref="recentRef" />
          </TabPane>
          <TabPane label="英雄" name="heroes">
            <hero-list ref="heroesRef" />
          </TabPane>
          <TabPane label="伙伴" name="partner">
            <peer-list ref="peerListRef" />
          </TabPane>
          <TabPane label="记录" name="record">
            <record-list ref="recordListRef" />
          </TabPane>
          <TabPane label="分类统计" name="category">
            <category ref="categoryRef" />
          </TabPane>
          <TabPane label="直方图" name="histograms">
            <histograms ref="histogramsRef" :account-id="accountId" />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import playerBase from './components/playerBase.vue';
import overview from './components/overview.vue';
import recentMatch from './components/recentMatch.vue';
import heroList from './components/heroList.vue';
import peerList from './components/peerList.vue';
import recordList from './components/recordList.vue';
import category from './components/category.vue';
import histograms from './components/histograms.vue';

const route = useRoute();
const tabName = ref('overview');
const accountId = ref(route.params.accountId);

const loading = ref(true);
const recentRef = ref();
const heroesRef = ref();
const peerListRef = ref();
const recordListRef = ref();
const categoryRef = ref();
const histogramsRef = ref();

let count = 0;

const loadComplete = () => {
  count++;
  if (count === 2) {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
};

const tabClick = tabName => {
  if (tabName === 'overview') {
    return;
  }
  const accountIdValue = accountId.value;
  if (tabName === 'recent') {
    recentRef.value.getAllMatch(accountIdValue);
  } else if (tabName === 'heroes') {
    heroesRef.value.getHeroList(accountIdValue);
  } else if (tabName === 'partner') {
    peerListRef.value.getPeerList(accountIdValue);
  } else if (tabName === 'record') {
    recordListRef.value.getRecordList(accountIdValue);
  } else if (tabName === 'category') {
    categoryRef.value.getTotals(accountIdValue);
  } else if (tabName === 'histograms') {
    histogramsRef.value.getChartData();
  }
};
</script>
<style lang="scss">
.dota-player-detail-box {
  padding-top: 10px;
  min-height: 60px;
  .content {
    padding: 0 20px 20px 20px;
  }
  .inline-logo-box {
    .link {
      margin-left: 10px;
    }
    .start-time {
      padding-left: 10px;
    }
  }
}
</style>
