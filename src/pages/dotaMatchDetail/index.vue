<template>
  <div class="player-detail-box main-container">
    <page-header title="战绩详情" hidden-breadcrumb />
    <div class="content">
      <page-loading :show="loading" />
      <div v-show="!loading">
        <match-summary :data="matchResult" :is-parse="isParse" />
        <div class="tab-content">
          <Tabs class="tab-link-bar tab-animate tab-center" :animated="false">
            <TabPane label="概观" name="overview">
              <overview :data="matchResult" @get-team-detail="getTeamDetail" />
            </TabPane>
            <TabPane label="评估" name="evaluation">
              <evaluation :data="matchResult" :team-detail="teamDetail" />
            </TabPane>
            <TabPane label="记录" name="record" :disabled="!isParse">
              <record :data="matchResult" />
            </TabPane>
            <TabPane label="战斗" name="combat">
              <combat :data="matchResult" />
            </TabPane>
            <TabPane label="曲线图" name="graphs">
              <graphs :data="matchResult" />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getMatchAPI } from './api';

import matchSummary from './components/matchSummary.vue';
import overview from './components/overview.vue';
import evaluation from './components/evaluation.vue';
import record from './components/record.vue';
import combat from './components/combat.vue';
import graphs from './components/graphs.vue';

const route = useRoute();
const matchId = route.params.matchId;
const matchResult = ref({});
const loading = ref(false);
const teamDetail = ref();
const isParse = ref(false);

const getMatch = async () => {
  loading.value = true;
  const response = await getMatchAPI(matchId);
  matchResult.value = response.data || {};
  isParse.value = matchResult.value?.radiant_gold_adv?.length > 0;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const getTeamDetail = data => {
  teamDetail.value = { ...data };
};

onMounted(() => {
  getMatch();
});
</script>
<style lang="scss">
.player-detail-box {
  .content {
    padding-top: 10px;
    min-height: 60px;
  }
  .tab-content {
    padding: 20px;
  }
  .tab-link-bar {
    .ivu-tabs-ink-bar {
      width: 60px !important;
    }
  }
  .table-title {
    margin-bottom: 10px;
    .team-name {
      font-size: 15px;
      font-weight: bold;
    }
  }
  .winner {
    color: #fff;
    position: relative;
    bottom: 1px;
    background: #19be6b;
    font-size: 10px;
    padding: 1px 4px 1px 1px;
    margin-left: 15px;
    &::after {
      right: 100%;
      top: 50%;
      border-style: solid;
      border-color: transparent #19be6b transparent transparent;
      border-image: initial;
      content: ' ';
      height: 0px;
      width: 0px;
      position: absolute;
      border-width: 8px;
      margin-top: -8px;
    }
  }
  .ivu-collapse-item {
    .ivu-collapse-header {
      padding-left: 0;
    }
  }
  .ivu-collapse-simple {
    border: none;
  }
  .ivu-collapse-content {
    padding: 0;
  }
}
</style>
