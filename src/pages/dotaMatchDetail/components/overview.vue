<template>
  <div class="over-view-box">
    <overview-table
      :text="radiantText"
      value="teamA"
      panel-name="teamA"
      :data-list="radiantList"
      :bp-list="radiantBpList"
      :is-winner="isRadianWinner"
    />
    <overview-table
      :text="direText"
      value="teamB"
      panel-name="teamB"
      :data-list="direList"
      :bp-list="direBpList"
      :is-winner="isDireWinner"
    />
    <hero-skill-table :text="radiantText" :data-list="radiantList" />
    <hero-skill-table :text="direText" :data-list="direList" />
  </div>
</template>
<script setup>
import { watch, ref } from 'vue';
import overviewTable from './overviewTable.vue';
import heroSkillTable from './heroSkillTable.vue';
import { getCacheHeroInfo, toThousands, getCacheItem, formatTimeStampMS } from '@/utils';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(['getTeamDetail']);

const radiantList = ref([]);
const radiantBpList = ref([]);
const direBpList = ref([]);
const direList = ref([]);
const radiantText = ref();
const direText = ref();
const isRadianWinner = ref(false);
const isDireWinner = ref(false);

const getPicksBanList = (picksBans = []) => {
  const dataList = picksBans.map(item => {
    const heroInfo = getCacheHeroInfo(item.hero_id);
    return {
      ...item,
      ...heroInfo
    };
  });
  const radiantBp = dataList.filter(item => item.team === 0);
  const direBp = dataList.filter(item => item.team === 1);
  radiantBpList.value.push(...radiantBp);
  direBpList.value.push(...direBp);
};

const getItemsList = (dataList = [], purchaseLog = []) => {
  const list = [];
  dataList = dataList.filter(item => item);
  dataList.forEach(item => {
    const items = getCacheItem(item);
    if (items) {
      const log = (purchaseLog || []).find(log => log.key === items.name);
      items.time = log ? formatTimeStampMS(log?.time) : '';
      list.push(items);
    }
  });
  return list;
};

const getPlayerList = (list = []) => {
  const dataList = list.map(item => {
    const {
      hero_id,
      hero_damage,
      tower_damage,
      hero_healing,
      item_0,
      item_1,
      item_2,
      item_3,
      item_4,
      item_5,
      item_neutral,
      purchase_log,
      backpack_0,
      backpack_1,
      backpack_2,
      backpack_3
    } = item;
    const { name_loc, index_img, isRadiant, radiant_win } = getCacheHeroInfo(hero_id);
    const itemList = getItemsList([item_0, item_1, item_2, item_3, item_4, item_5], purchase_log);
    const backpackList = getItemsList([backpack_0, backpack_1, backpack_2, backpack_3]);
    return {
      ...item,
      name_loc,
      index_img,
      itemList,
      backpackList,
      winResult: isRadiant ? radiant_win : !radiant_win,
      hero_damage: toThousands(hero_damage),
      tower_damage: toThousands(tower_damage),
      hero_healing: toThousands(hero_healing),
      item_neutral: getCacheItem(item_neutral)
    };
  });
  return dataList;
};

const init = data => {
  const { players = [], radiant_team = {}, dire_team = {}, picks_bans = [] } = data;
  const winTeam = getWinTeam(data);
  getPicksBanList(picks_bans);
  radiantList.value = getPlayerList(players.filter(item => item.isRadiant));
  direList.value = getPlayerList(players.filter(item => !item.isRadiant));
  radiantText.value = Object.keys(radiant_team).length > 0 ? radiant_team.name : '天辉';
  direText.value = Object.keys(dire_team).length > 0 ? dire_team.name : '夜魇';
  isRadianWinner.value = radiantText.value === winTeam.name;
  isDireWinner.value = direText.value === winTeam.name;
  emit('getTeamDetail', {
    radiantText: radiantText.value,
    direText: direText.value,
    radiantList: radiantList.value,
    direList: direList.value
  });
};

const getWinTeam = data => {
  const { dire_score, radiant_score, radiant_team, dire_team } = data;
  return radiant_score > dire_score ? radiant_team || { name: '天辉' } : dire_team || { name: '夜魇' };
};

watch(props, newValue => {
  init(newValue.data);
});
</script>
<style lang="scss">
.over-view-box {
  min-height: 50px;
}
</style>
