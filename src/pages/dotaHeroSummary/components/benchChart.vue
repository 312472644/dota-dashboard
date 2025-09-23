<template>
  <div :id="id" style="height: 300px"></div>
</template>
<script setup>
import HighCharts from 'highcharts';
import HighChartsMore from 'highcharts/highcharts-more';
import { watch } from 'vue';
HighChartsMore(HighCharts);

const props = defineProps({
  id: {
    type: String,
    default: 'container'
  },
  subText: {
    type: String,
    default: ''
  },
  categories: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  areaColor: {
    type: String,
    default: '#e6f5ff'
  },
  lineColor: {
    type: String,
    default: '#0c9dfc'
  }
});

const loadChart = options => {
  HighCharts.chart(options.id, {
    chart: {
      type: 'area'
    },
    title: {
      style: { display: 'none' }
    },
    subtitle: {
      text: options.subText
    },
    credits: {
      enabled: false
    },
    xAxis: {
      gridLineWidth: 1,
      categories: options.categories,
      tickmarkPlacement: 'on',
      title: {
        enabled: false
      }
    },
    yAxis: {
      title: {
        style: { display: 'none' }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      split: false,
      useHTML: true,
      borderWidth: 1,
      shadow: false,
      backgroundColor: '#ffffff',
      borderColor: '#e6e6e6',
      formatter: function () {
        return (
          '<div style="color:#17233d">' +
          this.x +
          '</div><div style="color:#17233d"><span>' +
          options.subText +
          '：</span>' +
          this.y +
          '</div>'
        );
      }
    },
    plotOptions: {
      area: {
        lineWidth: 1,
        color: options.areaColor,
        lineColor: options.lineColor,
        marker: {
          enabled: false,
          radius: 0
        }
      }
    },
    series: [
      {
        data: options.data
      }
    ]
  });
};

watch(props, newValue => {
  if (newValue.categories.length) {
    loadChart(newValue);
  }
});
</script>
