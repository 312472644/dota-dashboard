<template>
  <div class="dota-hero-summary main-container">
    <page-header title="英雄统计" back hidden-breadcrumb @on-back="back" />
    <hero-base ref="heroBaseRef" :hero-id="heroId" />
    <div class="hero-summary-content">
      <Tabs v-model="tabName" class="tab-animate tab-center" :animated="false" @on-click="tabClickEvent">
        <TabPane label="排名" name="ranking"><ranking ref="rankingRef" :hero-id="heroId" /></TabPane>
        <TabPane label="评估" name="benchMarks"><bench-marks ref="benchMarksRef" /></TabPane>
        <TabPane label="近期" name="recent"><recent ref="recentRef" /></TabPane>
        <TabPane label="匹配" name="matchUps"><match-ups ref="matchUpsRef" /></TabPane>
        <TabPane label="玩家" name="players"><players ref="playersRef" /></TabPane>
        <TabPane label="物品" name="items"><items ref="itemsRef" /></TabPane>
      </Tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import heroBase from './components/heroBase.vue';
import ranking from './components/ranking.vue';
import benchMarks from './components/benchMarks.vue';
import recent from './components/recent.vue';
import matchUps from './components/matchUps.vue';
import players from './components/players.vue';
import items from './components/items.vue';

const route = useRoute();
const router = useRouter();
const tabName = ref('ranking');
const heroBaseRef = ref();
const rankingRef = ref();
const benchMarksRef = ref();
const recentRef = ref();
const matchUpsRef = ref();
const playersRef = ref();
const itemsRef = ref();

let heroId = route.params.heroId;

const back = () => {
  router.push('/');
};

const tabClickEvent = name => {
  if (name === 'ranking') {
    return;
  }
  if (name === 'benchMarks') {
    benchMarksRef.value.load(heroId);
  } else if (name === 'recent') {
    recentRef.value.load(heroId);
  } else if (name === 'matchUps') {
    matchUpsRef.value.load(heroId);
  } else if (name === 'players') {
    playersRef.value.load(heroId);
  } else if (name === 'items') {
    itemsRef.value.load(heroId);
  }
};

watch(route, newValue => {
  if (!newValue.params.heroId) {
    return;
  }
  window.location.reload();
});
</script>
<style lang="scss">
.dota-hero-summary {
  .hero-summary-content {
    padding: 0 20px 20px 20px;
    .sub-title {
      font-size: 13px;
      margin-bottom: 10px;
      .strong {
        font-weight: bold;
        padding-right: 5px;
      }
    }
  }
}
</style>
