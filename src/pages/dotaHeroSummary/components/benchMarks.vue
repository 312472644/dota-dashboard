<template>
  <div class="bench-marks-box">
    <page-loading :show="loading" />
    <div v-show="!loading" class="bench-marks">
      <div class="sub-title">
        <span class="strong">评估</span>
        <span>来自公开比赛的数据</span>
      </div>
      <div class="row">
        <div class="row-item">
          <bench-chart
            id="gold_per_min"
            area-color="#c9af1d4d"
            line-color="#c9af1d"
            sub-text="每分钟平均金钱"
            :categories="charData?.gold_per_min?.categories"
            :data="charData?.gold_per_min?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="xp_per_min"
            sub-text="每分钟平均经验"
            :categories="charData?.xp_per_min?.categories"
            :data="charData?.xp_per_min?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="hero_damage_per_min"
            sub-text="每分钟平均英雄伤害"
            area-color="#ff4c4c4d"
            line-color="#ff4c4c"
            :categories="charData?.hero_damage_per_min?.categories"
            :data="charData?.hero_damage_per_min?.data"
          />
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <bench-chart
            id="hero_healing_per_min"
            sub-text="每分钟平均英雄治疗"
            area-color="#66bb6a4d"
            line-color="#66bb6a"
            :categories="charData?.hero_healing_per_min?.categories"
            :data="charData?.hero_healing_per_min?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="kills_per_min"
            area-color="#ffab404d"
            line-color="#ffab40"
            sub-text="每分钟平均击杀"
            :categories="charData?.kills_per_min?.categories"
            :data="charData?.kills_per_min?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="last_hits_per_min"
            sub-text="每分钟平均正补"
            area-color="#7c99a84d"
            line-color="#7c99a8"
            :categories="charData?.last_hits_per_min?.categories"
            :data="charData?.last_hits_per_min?.data"
          />
        </div>
      </div>
      <div class="row">
        <div class="row-item">
          <bench-chart
            id="lhten"
            sub-text="前10分钟正补数量"
            area-color="#c9af1d4d"
            line-color="#c9af1d"
            :categories="charData?.lhten?.categories"
            :data="charData?.lhten?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="stuns_per_min"
            sub-text="秒每分钟晕眩英雄"
            :categories="charData?.stuns_per_min?.categories"
            :data="charData?.stuns_per_min?.data"
          />
        </div>
        <div class="row-item">
          <bench-chart
            id="tower_damage"
            sub-text="塔伤"
            :categories="charData?.tower_damage?.categories"
            :data="charData?.tower_damage?.data"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { getBenchMarksAPI } from '../api';
import benchChart from './benchChart.vue';

const charData = reactive({});
const loading = ref(false);

const load = async heroId => {
  if (charData?.gold_per_min?.categories.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getBenchMarksAPI(heroId);
  const data = response.data.result;
  for (let [prop, value] of Object.entries(data)) {
    const categories = value.map(item => (item.percentile * 100).toFixed(0).concat('%'));
    const data = value.map(item => parseFloat(parseFloat(item.value).toFixed(2)));
    charData[prop] = { categories, data };
  }
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

defineExpose({
  load
});
</script>
<style lang="scss">
.bench-marks-box {
  min-height: 50px;
  .bench-marks {
    .row {
      display: flex;
      justify-content: space-between;
      .row-item {
        flex: 1;
      }
    }
  }
}
</style>
