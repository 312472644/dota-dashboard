<template>
  <div class="match-record">
    <div v-if="recordList.length > 0">
      <Select v-model="heroName" style="width: 280px" class="select-box" :transfer="true" @on-change="changeHandle">
        <Option v-for="item in heroList" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
      <div class="kill-record">
        <div v-for="(item, index) in recordList" :key="index" class="record-item">
          <div v-if="item.isRadiant" class="left">
            <Image :src="item.targetHero.index_img" width="72px" height="40px" lazy />
            <div class="kill-log">
              <img src="../../../assets/images/sword.svg" class="sword" />
              <Image :src="item.heroAvatar" width="16px" height="16px" lazy>
                <template #placeholder>
                  <Spin />
                </template>
              </Image>
              <span class="kill-hero-name">击杀 {{ item.heroCNName }}</span>
              <span class="kill-time">{{ item.killTime }}</span>
            </div>
          </div>
          <div v-else class="right">
            <div class="kill-log">
              <span class="kill-time">{{ item.killTime }}</span>
              <img src="../../../assets/images/sword.svg" class="sword" />
              <span class="kill-hero-name">击杀 {{ item.heroCNName }}</span>
              <Image :src="item.heroAvatar" width="16px" height="16px" lazy>
                <template #placeholder>
                  <Spin />
                </template>
              </Image>
            </div>
            <Image :src="item.targetHero.index_img" width="72px" height="40px" lazy />
          </div>
        </div>
      </div>
    </div>
    <empty v-else />
  </div>
</template>
<script setup>
import { watch, ref } from 'vue';
import { getCacheHeroInfo, formatTimeStampMS, getCacheData } from '@/utils';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
});

const heroName = ref('all');
const initRecordList = [];
const recordList = ref([]);
const heroList = ref([{ label: '所有英雄', value: 'all' }]);

const changeHandle = heroId => {
  recordList.value = [];
  const filterList = initRecordList.filter(item => item.hero_id === heroId);
  if (heroId === 'all') {
    recordList.value.push(...initRecordList);
  } else {
    recordList.value.push(...filterList);
  }
};

const getRecordList = (playerList = []) => {
  const dataList = [];
  playerList.forEach(item => {
    const { kills_log = [], hero_id, isRadiant } = item;
    const heroInfo = getCacheHeroInfo(hero_id);
    (kills_log || []).forEach(logItem => {
      const { time, key } = logItem;
      const { name_loc } = getCacheData('heroList', 'name', key);
      const heroName = key.replace('npc_dota_hero_', '');
      dataList.push({
        hero_id,
        time,
        isRadiant,
        targetHero: heroInfo,
        heroName,
        heroCNName: name_loc,
        heroAvatar: `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${heroName}.png`,
        killTime: formatTimeStampMS(time)
      });
    });
  });
  return dataList.sort((a, b) => {
    return a.time - b.time;
  });
};

const getHeroList = players => {
  const dataList = players.map(item => {
    const { hero_id } = item;
    const { name_loc } = getCacheHeroInfo(hero_id);
    return {
      label: name_loc,
      value: hero_id
    };
  });
  heroList.value.push(...dataList);
};

const intiProps = data => {
  const { players } = data;
  const killLogList = getRecordList(players);
  getHeroList(players);
  recordList.value.push(...killLogList);
  initRecordList.push(...killLogList);
};

watch(props, newValue => {
  intiProps(newValue.data);
});
</script>
<style lang="scss" scoped>
.match-record {
  :deep .ivu-image-img {
    border-radius: 3px;
  }
  .record-item,
  .select-box {
    margin-bottom: 15px;
  }
  .kill-record {
    .left {
      display: flex;
      align-items: center;
    }
    .right {
      display: flex;
      justify-content: flex-end;
      .kill-log {
        background: linear-gradient(to left, #9d361f26, transparent) !important;
        margin-right: 15px;
      }
      .kill-time {
        padding-left: 0 !important;
        padding-right: 15px;
      }
      .sword {
        margin-right: 0 !important;
        margin: 0 5px;
      }
      .kill-hero-name {
        padding: 0 5px;
      }
    }
    .kill-log {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      border-radius: 3px;
      margin-left: 15px;
      background: linear-gradient(to right, #21812c26, transparent);
      .sword {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
      .kill-hero-name {
        font-size: 13px;
        padding-left: 5px;
      }
      .kill-time {
        font-size: 13px;
        padding-left: 15px;
      }
      :deep .ivu-image-img {
        vertical-align: unset;
      }
    }
  }
}
</style>
