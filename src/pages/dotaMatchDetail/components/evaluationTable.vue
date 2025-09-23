<template>
  <div class="evaluation-table-box">
    <div class="table-title">
      <span class="team-name">{{ text }}</span>
      <span v-if="dataList[0]?.isRadiant" class="winner">胜者</span>
    </div>
    <Table class="table" :columns="columns" :data="dataList">
      <template #player="{ row, index }">
        <hero-image :data="row" :color-index="index" />
      </template>
    </Table>
  </div>
</template>
<script setup>
import heroImage from './heroImage.vue';

defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ''
  }
});

const columns = [
  { title: '玩家', width: '180px', slot: 'player' },
  { title: 'GPM', key: 'gold_per_min' },
  { title: 'XPM', key: 'xp_per_min' },
  { title: '每分钟击杀', key: 'kills_per_min' },
  { title: '每分钟正补', key: 'last_hits_min' },
  { title: '英雄伤害/分', key: 'hero_damage_min' },
  { title: '英雄治疗/分', key: 'hero_healing_min' },
  { title: '防御塔伤害', key: 'tower_damage' },
  { title: '每分钟眩晕次数', key: 'stuns_min', width: '120px' }
];
</script>
<style lang="scss">
.evaluation-table-box {
  margin-bottom: 10px;
}
</style>
