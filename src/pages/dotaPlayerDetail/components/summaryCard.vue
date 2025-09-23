<template>
  <div class="player-summery-box">
    <div class="title"><span class="primary-text">总计</span><span class="sub-text">胜率</span></div>
    <div class="content">
      <div class="summary-group">
        <div class="summary-item">
          <Circle :percent="summaryResult.night" :size="90" :stroke-width="2" :trail-width="1">
            <div class="circle">
              <div class="percent">{{ summaryResult.night }}%</div>
              <div class="text">夜魇</div>
            </div>
          </Circle>
        </div>
        <div class="summary-item">
          <Circle :percent="summaryResult.radiant" :size="90" :stroke-width="2" :trail-width="1">
            <div class="circle">
              <div class="percent">{{ summaryResult.radiant }}%</div>
              <div class="text">天辉</div>
            </div>
          </Circle>
        </div>
      </div>
      <div class="summary-group">
        <div class="summary-item">
          <Circle :percent="summaryResult.allHeroBp" :size="90" :stroke-width="2" :trail-width="1">
            <div class="circle">
              <div class="percent">{{ summaryResult.allHeroBp }}%</div>
              <div class="text">全英雄选择(BP)</div>
            </div>
          </Circle>
        </div>
        <div class="summary-item">
          <Circle :percent="summaryResult.allHero" :size="90" :stroke-width="2" :trail-width="1">
            <div class="circle">
              <div class="percent">{{ summaryResult.allHero }}%</div>
              <div class="text">全英雄选择</div>
            </div>
          </Circle>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { watch, ref } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const summaryResult = ref({});

const getPercent = (a, b) => {
  return parseFloat(((a / b) * 100).toFixed(1)) || 0;
};

const getSummary = data => {
  const { is_radiant, game_mode } = data;
  summaryResult.value = {
    night: getPercent(is_radiant[0].win, is_radiant[0].games),
    radiant: getPercent(is_radiant[1].win, is_radiant[1].games),
    allHeroBp: getPercent(game_mode?.[22]?.win, game_mode?.[22]?.games),
    allHero: getPercent(game_mode[1].win, game_mode[1].games)
  };
};

watch(props, newValue => {
  getSummary(newValue.data);
});
</script>
<style lang="scss">
.player-summery-box {
  padding: 15px 0;
  .title {
    padding-bottom: 10px;
    .primary-text {
      font-size: 13px;
    }
    .sub-text {
      color: #c5c6c7;
      font-size: 13px;
      padding-left: 8px;
    }
  }
  .content {
    display: flex;
  }
  .summary-group {
    flex: 1;
    display: flex;
  }
  .summary-item {
    display: flex;
    flex: 1;
    justify-content: center;
  }
  .circle {
    .percent {
      color: #515a6e;
      font-size: 18px;
      padding-bottom: 5px;
    }
    .text {
      color: #808695;
      font-size: 12px;
      padding: 0 10px;
    }
  }
}
</style>
