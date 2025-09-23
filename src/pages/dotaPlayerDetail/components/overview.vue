<template>
  <div class="overview-container">
    <summary-card :data="summaryResult" />
    <div class="table-content">
      <div class="left">
        <div class="overview-card">
          <div class="title">最近比赛</div>
          <div class="content">
            <match-table :data-list="recentMatchList" />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="overview-card">
          <div class="title">玩家记录</div>
          <div class="content"><peer-table :data-list="peerList" /></div>
        </div>
        <div class="overview-card">
          <div class="title">使用英雄</div>
          <div class="content">
            <hero-table :data-list="heroList" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { getRecentMatchesAPI, getPeersAPI, getHeroesAPI, getPlayerCountAPI } from '../api';
import { getCacheHeroInfo, formatTimeStampMS, isRadiant } from '@/utils';
import { gameModeMap, lobbyTypeMap, laneRoleMap } from '@/utils/map';

import matchTable from './matchTable.vue';
import peerTable from './peerTable.vue';
import heroTable from './heroTable.vue';
import summaryCard from './summaryCard.vue';

const props = defineProps({
  accountId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['complete']);

const recentMatchList = ref([]);
const peerList = ref([]);
const heroList = ref([]);
const summaryResult = ref();

const getRecentMatches = async accountId => {
  const response = await getRecentMatchesAPI(accountId);
  const dataList = response.data;
  recentMatchList.value.push(
    ...dataList.map(item => {
      const { hero_id, start_time, game_mode, duration, lobby_type, radiant_win, player_slot, lane_role } = item;
      const heroInfo = getCacheHeroInfo(hero_id);
      return {
        ...item,
        ...heroInfo,
        isWin: isRadiant(player_slot) ? radiant_win : !radiant_win,
        duration: formatTimeStampMS(duration),
        laneRole: laneRoleMap.get(lane_role) || null,
        lobby_type: lobbyTypeMap.get(lobby_type),
        game_mode: gameModeMap.get(game_mode),
        startTime: dayjs(start_time * 1000).format('YYYY-MM-DD')
      };
    })
  );
};

const getPeerList = async accountId => {
  const response = await getPeersAPI(accountId);
  const dataList = (response.data || []).slice(0, 5);
  peerList.value.push(
    ...dataList.map(item => {
      const { personaname, name, games, win } = item;
      return {
        ...item,
        personName: name || personaname,
        winRate: ((win / games) * 100).toFixed(1)
      };
    })
  );
};

const getHeroList = async accountId => {
  const response = await getHeroesAPI(accountId);
  const dataList = (response.data || []).slice(0, 10);
  heroList.value.push(
    ...dataList.map(item => {
      const { games, win, hero_id, last_played } = item;
      const heroInfo = getCacheHeroInfo(hero_id);
      return {
        ...item,
        ...heroInfo,
        winRate: ((win / games) * 100).toFixed(1),
        lastPlayed: dayjs(last_played * 1000).format('YYYY-MM-DD')
      };
    })
  );
};

const getPlayerCount = async accountId => {
  const response = await getPlayerCountAPI(accountId);
  summaryResult.value = response.data;
};

onMounted(() => {
  const accountId = props.accountId;
  if (!accountId) {
    return;
  }
  getRecentMatches(accountId);
  getPeerList(accountId);
  getHeroList(accountId);
  getPlayerCount(accountId);
  emit('complete');
});
</script>
<style lang="scss">
.overview-container {
  min-height: 50px;
  .table-content {
    display: flex;
  }
  .overview-card {
    .title {
      font-size: 14px;
      padding-bottom: 10px;
    }
    .content {
      padding: 0;
    }
  }
  .left {
    padding-right: 20px;
    width: calc(100% - 410px);
  }
  .right {
    width: 410px;
  }
}
</style>
