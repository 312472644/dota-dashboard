<template>
  <div class="combat-box">
    <combat-table title="击杀" :dire-list="direList" :radiant-list="radiantList" />
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import combatTable from './combatTable.vue';
import { getCacheHeroInfo } from '@/utils';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const direList = ref([]);
const radiantList = ref([]);

const initData = (data = []) => {
  const affix = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/`;
  const playerList = data.map(item => {
    const { killed, hero_id, hero_kills, isRadiant, killed_by } = item;
    const killList = [];
    const killByList = [];
    const { name_loc, name } = getCacheHeroInfo(hero_id) || {};
    for (const [key, value] of Object.entries(killed)) {
      if (key.indexOf('_hero') > -1) {
        killList.push({ key, value, name_loc });
      }
    }
    for (const [key, value] of Object.entries(killed_by)) {
      killByList.push({ key, value, name_loc });
    }
    return {
      hero_id,
      heroIcon: `${affix}${name.replace('npc_dota_hero_', '')}.png`,
      hero_kills,
      isRadiant,
      killList,
      killByList,
      heroCnName: name_loc,
      name
    };
  });
  radiantList.value = playerList.filter(item => item.isRadiant);
  direList.value = playerList.filter(item => !item.isRadiant);
};

watch(props, newValue => {
  initData(newValue.data.players);
});
</script>
<style lang="scss" scoped>
.combat-box {
  position: relative;
  min-height: 50px;
}
</style>
