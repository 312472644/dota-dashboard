<template>
  <div class="evaluation-box">
    <evaluation-table :data-list="radiantList" :text="radiantText" />
    <evaluation-table :data-list="direList" :text="direText" />
  </div>
</template>
<script setup>
import { watch, ref } from 'vue';
import evaluationTable from './evaluationTable.vue';
import { getCacheHeroInfo } from '@/utils';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  teamDetail: {
    type: Object,
    default: () => {}
  }
});

const radiantList = ref([]);
const direList = ref([]);
const radiantText = ref();
const direText = ref();

const getPlayerList = (list = []) => {
  const dataList = list.map(item => {
    const { hero_id, kills_per_min, duration, last_hits, hero_damage, hero_healing, stuns } = item;
    const { index_img } = getCacheHeroInfo(hero_id);
    const mins = duration / 60;
    return {
      ...item,
      index_img,
      kills_per_min: parseFloat(kills_per_min).toFixed(2),
      last_hits_min: parseFloat(last_hits / mins).toFixed(2),
      hero_damage_min: parseFloat(hero_damage / mins).toFixed(2),
      hero_healing_min: parseFloat(hero_healing / mins).toFixed(0),
      stuns_min: parseFloat(stuns / mins).toFixed(2)
    };
  });
  return dataList;
};

const initProps = (data, teamDetail) => {
  const { players = [] } = data;
  radiantText.value = teamDetail.radiantText;
  direText.value = teamDetail.direText;
  radiantList.value.push(...getPlayerList(players.filter(item => item.isRadiant)));
  direList.value.push(...getPlayerList(players.filter(item => !item.isRadiant)));
};

watch(props, newValue => {
  initProps(newValue.data, newValue.teamDetail);
});
</script>
