<template>
  <div class="graphs-box">
    <div class="chart-item">
      <graphs-chart
        container-id="goldChart"
        title="经济"
        :x-axis-data="goldData.xAxisData"
        :series-data="goldData.seriesData"
      />
    </div>
    <div class="chart-item">
      <graphs-chart
        container-id="xpChart"
        title="经验"
        :x-axis-data="xpData.xAxisData"
        :series-data="xpData.seriesData"
      />
    </div>
    <div class="chart-item">
      <graphs-chart
        container-id="lhChart"
        title="正补"
        :x-axis-data="lhData.xAxisData"
        :series-data="lhData.seriesData"
      />
    </div>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue';
import { getCacheHeroInfo } from '@/utils';
import graphsChart from './graphsChart.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const colors = [
  '#3375ff',
  '#66ffbf',
  '#bf00bf',
  '#f3f00b',
  '#ff6a00',
  '#fe86c2',
  '#a1b447',
  '#65d9f7',
  '#008321',
  '#a46900'
];
const goldData = reactive({
  xAxisData: [],
  seriesData: []
});
const xpData = reactive({
  xAxisData: [],
  seriesData: []
});
const lhData = reactive({
  xAxisData: [],
  seriesData: []
});

const getChartData = (data = {}, propName = '') => {
  const seriesData =
    data.players.map((item, index) => {
      const data = [];
      const { hero_id, isRadiant } = item;
      const propList = item[propName];
      const { name_loc } = getCacheHeroInfo(hero_id) || {};
      for (const [key, value] of Object.entries(propList)) {
        data.push(value);
      }
      return {
        isRadiant,
        name: name_loc,
        color: colors[index],
        marker: {
          enabled: false
        },
        [propName]: propList,
        data
      };
    }) || [];
  const xAxisData = Object.keys(seriesData[0]?.[propName]).map(item => item.concat(':00'));
  return { xAxisData, seriesData };
};

const getGoldData = (data = {}) => {
  const { seriesData, xAxisData } = getChartData(data, 'gold_t');
  goldData.seriesData = seriesData;
  goldData.xAxisData = xAxisData;
};

const getXpData = (data = {}) => {
  const { seriesData, xAxisData } = getChartData(data, 'xp_t');
  xpData.seriesData = seriesData;
  xpData.xAxisData = xAxisData;
};

const getLhData = data => {
  const { seriesData, xAxisData } = getChartData(data, 'lh_t');
  lhData.seriesData = seriesData;
  lhData.xAxisData = xAxisData;
};

const initData = newValue => {
  const data = newValue.data;
  getGoldData(data);
  getXpData(data);
  getLhData(data);
};

watch(props, newValue => {
  initData(newValue);
});
</script>
<style lang="scss" scoped>
.graphs-box {
  .chart-item {
    padding: 10px 0;
  }
}
</style>
