<template>
  <div class="histograms">
    <page-loading :show="loading" />
    <div v-show="!loading">
      <div class="filter">
        <Select v-model="category" style="width: 220px" @on-change="changeHandle">
          <Option v-for="item in categoryList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div id="container" style="height: 400px"></div>
    </div>
  </div>
</template>
<script setup>
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { ref } from 'vue';
import { getHistogramsAPI } from '../api';

HighchartsMore(Highcharts);

const props = defineProps({
  accountId: {
    type: String,
    default: ''
  }
});

const category = ref('kills');
const chartData = ref([]);
const loading = ref(false);
const categoryList = ref([
  { label: '击杀', value: 'kills' },
  { label: '助攻', value: 'assists' },
  { label: '死亡', value: 'deaths' }
]);

const getChartData = async (isShowLoading = true) => {
  if (chartData.value.length > 0 && isShowLoading) {
    return;
  }
  if (isShowLoading) {
    loading.value = true;
  }
  const { data = [] } = (await getHistogramsAPI(props.accountId, category.value)) || {};
  const categories = data.map(item => item.x);
  const series = data.map(item => {
    return {
      y: item.games,
      color: '#808695'
    };
  });
  loadChart(categories, series.slice(0, 25), data);
  if (isShowLoading) {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
};

const changeHandle = async () => {
  await getChartData(false);
};

const loadChart = (categories = [], data = [], initData = []) => {
  Highcharts.chart('container', {
    chart: {
      type: 'column'
    },
    title: {
      style: { display: 'none' }
    },
    subtitle: {
      style: { display: 'none' }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    xAxis: {
      categories,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        style: { display: 'none' }
      }
    },
    tooltip: {
      shadow: false,
      borderWidth: 0,
      backgroundColor: '#515a6e',
      useHTML: true,
      formatter: function () {
        const { win } = initData[this.point.index];
        const percent = ((win / this.y) * 100).toFixed(2);
        return `
        <div style='font-size:13px;color:#fff'>
          <div>${this.x}</div>
          <div>${this.y} 近期战绩</div>
          <div>${percent} 胜率</div>
        </div>
        `;
      }
    },
    plotOptions: {
      column: {
        borderWidth: 0
      }
    },
    series: [{ data }]
  });
};

defineExpose({
  getChartData
});
</script>
<style lang="scss" scoped>
.histograms {
  min-height: 50px;
  .filter {
    padding-bottom: 15px;
  }
}
</style>
