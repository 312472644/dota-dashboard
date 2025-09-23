<template>
  <div class="title">{{ title }}</div>
  <div :id="containerId" class="graphs-chart-box"></div>
</template>
<script setup>
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { watch } from 'vue';

HighchartsMore(Highcharts);

const props = defineProps({
  xAxisData: {
    type: Array,
    required: true,
    default: () => []
  },
  seriesData: {
    type: Array,
    required: true,
    default: () => []
  },
  containerId: {
    type: String,
    default: 'container'
  },
  title: {
    type: String,
    default: ''
  }
});

const getTooltipHTML = data => {
  const htmlList = (
    props.seriesData.map((item, index) => {
      const { color, x, y } = data.points[index];
      const { name, isRadiant } = item;
      return {
        y,
        x,
        color,
        name,
        isRadiant
      };
    }) || []
  ).sort((a, b) => b.y - a.y);
  const html = htmlList.map(item => {
    const { color, y, name, isRadiant } = item;
    return `
      <div style="display:flex;align-items:center;width:120px;line-height:30px;margin-bottom:5px;background:${
        isRadiant ? 'linear-gradient(to right, #2a422c, #253828)' : 'linear-gradient(to right, #442d2d, #2c2123)'
      }">
        <div style="width:5px;height:30px;background:${color}"></div>
        <div style="width:90px;color:#fff;padding-left:5px">${name}：${y}</div>
      </div>`;
  });
  return `
    <div style="width:120px">
      <div style="width:100px;color:#fff;padding-bottom:5px;text-align:center">${data.x}</div>
      ${html.join('')}
    </div>`;
};

const loadChart = () => {
  Highcharts.chart(props.containerId, {
    chart: {
      type: 'spline'
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
    xAxis: {
      categories: props.xAxisData
    },
    yAxis: {
      title: {
        style: { display: 'none' }
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      shadow: false,
      borderWidth: 0,
      backgroundColor: '#313538',
      useHTML: true,
      formatter: function () {
        return getTooltipHTML(this);
      }
    },
    series: props.seriesData
  });
};

watch(props, () => {
  loadChart();
});
</script>
<style lang="scss" scoped>
.graphs-chart-box {
  height: 400px;
}
.title {
  font-size: 14px;
  padding-bottom: 10px;
}
</style>
