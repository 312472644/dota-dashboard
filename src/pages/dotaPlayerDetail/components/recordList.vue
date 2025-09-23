<template>
  <div class="record-list-box">
    <div class="search">
      <Select v-model="sortValue" style="width: 280px" :label-in-value="true" :transfer="true" @on-change="sortChange">
        <Option v-for="item in sortList" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="title">最高记录</div>
    <Table class="table" :columns="columns" :loading="tableLoading" :data="recordList">
      <template #heroes="{ row }">
        <div class="inline-logo-box">
          <table-image :src="row.index_img" fit="cover" />
          <div role="container">
            <div @click="toHeroDetail(row)">
              <span class="link name-loc">{{ row.name_loc }}</span>
              <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
            </div>
            <div class="start-time">{{ row.startTime }}</div>
          </div>
        </div>
      </template>
      <template #result="{ row }">
        <div :class="{ link: true, win: true, lose: !row.isWin }" @click="toMatchDetail(row)">
          <span>{{ row.isWin ? '比赛胜利' : '比赛失败' }}</span>
          <Icon type="ios-arrow-forward" size="13" :color="row.isWin ? '#19be6b' : '#ed4014'" />
        </div>
        <div>{{ row.lobby_type }}</div>
      </template>
      <template #duration="{ row }">
        <div class="duration">
          <div>{{ row.duration }}</div>
          <div>{{ row.isRadiantRole ? '天辉' : '夜魇' }}</div>
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { getRecordListAPI } from '../api';
import { getCacheHeroInfo, formatTimeStampMS, isRadiant } from '@/utils';
import { gameModeMap, lobbyTypeMap } from '@/utils/map';

const router = useRouter();
const sortValue = ref('kills');
const accountId = ref(0);
const tableLoading = ref(false);
const sortList = ref([
  { value: 'kills', label: '击杀' },
  { value: 'deaths', label: '死亡' },
  { value: 'assists', label: '助攻' },
  { value: 'last_hits', label: '正补' },
  { value: 'denies', label: '反补' },
  { value: 'kda', label: 'KDA' },
  { value: 'duration', label: '时长' },
  { value: 'neutral_kills', label: '击杀野怪' }
]);
const columns = ref([
  { title: '击杀英雄', slot: 'heroes' },
  { title: '胜败', slot: 'result' },
  { title: '时长', key: 'duration', slot: 'duration' },
  { title: '击杀', key: 'kills' }
]);
const recordList = ref([]);

const sortChange = option => {
  columns.value.pop();
  columns.value.push({
    title: option.label,
    key: option.value
  });
  recordList.value = [];
  getRecordList(accountId.value);
};

const getRecordList = async param => {
  accountId.value = param;
  if (recordList.value.length > 0) {
    return;
  }
  tableLoading.value = true;
  const response = await getRecordListAPI(param, sortValue.value);
  const dataList = (response.data || []).map(item => {
    const { hero_id, start_time, game_mode, duration, lobby_type, radiant_win, player_slot, lane_role } = item;
    const heroInfo = getCacheHeroInfo(hero_id);
    const isRadiantRole = isRadiant(player_slot);
    return {
      ...item,
      ...heroInfo,
      isRadiantRole,
      isWin: isRadiantRole ? radiant_win : !radiant_win,
      duration: formatTimeStampMS(duration),
      lobby_type: lobbyTypeMap.get(lobby_type),
      game_mode: gameModeMap.get(game_mode),
      startTime: dayjs(start_time * 1000).format('YYYY-MM-DD')
    };
  });
  recordList.value.push(...dataList);
  tableLoading.value = false;
};

const toHeroDetail = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

defineExpose({
  getRecordList
});
</script>
<style lang="scss">
.record-list-box {
  min-height: 50px;
  .title,
  .search {
    font-size: 14px;
    padding-bottom: 10px;
  }
}
</style>
