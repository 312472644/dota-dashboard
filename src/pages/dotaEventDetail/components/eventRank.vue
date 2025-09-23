<template>
  <div class="event-rank">
    <div class="filter">
      <Select v-model="searchValue" style="width: 210px" @on-change="changeEvent">
        <Option v-for="item in options" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table class="table" :columns="columns" :data="hooksValue.tableList" :loading="loading">
      <template #avatar="{ row }">
        <div class="avatar" @click="toPageDetail(row)">
          <table-image :src="row.logoUrl" width="35px" height="35px" fit="contain" />
          <span class="link">{{ row.name }}</span>
          <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
        </div>
      </template>
    </Table>
    <div class="page-container">
      <Page
        v-model="hooksValue.pageVO.index"
        :total="hooksValue.pageVO.total"
        :page-size="hooksValue.pageVO.size"
        show-sizer
        show-total
        @on-page-size-change="hooksValue.sizeChange"
        @on-change="hooksValue.pageChange"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getRankInfoAPI } from '../api';
import { getProPlayerListAPI } from '@/service/common';
import { formatTimeStampMS, getCacheData } from '@/utils';
import { Message } from 'view-ui-plus';
import { usePageQuery } from '@/hooks';

const props = defineProps({
  eventId: {
    type: String,
    default: ''
  },
  teamList: {
    type: Array,
    default: () => []
  }
});

const rankInfo = ref({});
const loading = ref(false);
const router = useRouter();
const proPlayerList = [];
const teamList = [];
const searchValue = ref('playerRankDTO');
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});
const columnsMap = {
  playerRankDTO: [
    { title: '排名', width: '60px', type: 'index' },
    { title: '选手', slot: 'avatar', width: 135 },
    { title: '每分钟输出', key: 'damagePerMinute', width: 110, sortable: true, sortType: 'desc' },
    { title: 'KDA', key: 'kda', sortable: true },
    { title: '输出经济比', key: 'output', width: 110, sortable: true },
    { title: '使用英雄', key: 'heroCnt', width: 100, sortable: true },
    { title: '场均击杀', key: 'kill', width: 100, sortable: true },
    { title: '参战率', key: 'fight', width: 90, sortable: true },
    { title: 'GPM', key: 'gpm', sortable: true },
    { title: 'XPM', key: 'xpm', sortable: true },
    { title: '场均死亡', key: 'death', width: 100, sortable: true },
    { title: '场均助攻', key: 'assist', width: 100, sortable: true },
    { title: '承伤占比', key: 'absorbDamage', width: 100, sortable: true }
  ],
  teamRankDTO: [
    { title: '排名', width: '60px', type: 'index' },
    { title: '战队', slot: 'avatar' },
    { title: '场均时长', key: 'duration', sortable: true },
    { title: 'KDA', key: 'kda', sortable: true, sortType: 'desc' },
    { title: '局满率', key: 'boMost', sortable: true }
  ],
  heroRankDTO: [
    { title: '排名', width: '60px', type: 'index' },
    { title: '英雄', slot: 'avatar' },
    { title: 'BP率', key: 'banPickRate', sortable: true },
    { title: '禁用次数', key: 'banCnt', sortable: true },
    { title: '出场次数', key: 'pickCnt', sortable: true },
    { title: '胜率', key: 'winRate', sortable: true, sortType: 'desc' }
  ]
};
const columns = ref(columnsMap[searchValue.value]);
const options = ref([
  { label: '选手榜', value: 'playerRankDTO' },
  { label: '战队榜', value: 'teamRankDTO' },
  { label: '英雄榜', value: 'heroRankDTO' }
]);

const getRankInfo = async () => {
  const response = await getRankInfoAPI(props.eventId);
  const result = response.data?.result;
  const { playerRankDTO, teamRankDTO, heroRankDTO } = result || {};
  result.playerRankDTO = playerRankDTO.map(item => {
    const { output, fight, absorbDamage } = item;
    return {
      ...item,
      output: `${output}%`,
      fight: `${fight}%`,
      absorbDamage: `${absorbDamage}%`
    };
  });
  result.teamRankDTO = teamRankDTO.map(item => {
    const { duration, boMost } = item;
    return {
      ...item,
      duration: formatTimeStampMS(duration),
      boMost: `${boMost}%`
    };
  });
  result.heroRankDTO = heroRankDTO.map(item => {
    const { banPickRate, winRate } = item;
    return {
      ...item,
      banPickRate: `${banPickRate}%`,
      winRate: `${winRate}%`
    };
  });
  rankInfo.value = result;
  pageEvent(rankInfo.value[searchValue.value]);
};

const pageEvent = (dataList = []) => {
  const { pageVO, tableList, pageChange, sizeChange } = usePageQuery(dataList, 20);
  hooksValue.pageVO = pageVO;
  hooksValue.tableList = tableList;
  hooksValue.pageChange = pageChange;
  hooksValue.sizeChange = sizeChange;
};

const changeEvent = value => {
  loading.value = true;
  columns.value = columnsMap[value];
  hooksValue.pageVO.index = 1;
  pageEvent(rankInfo.value[searchValue.value]);
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const toPlayerDetail = row => {
  const proPlayer = proPlayerList.find(item => [item.name, item.personaname].indexOf(row.name) > -1);
  if (proPlayer) {
    router.push({ path: `/dota-data/dota-player-detail/${proPlayer.account_id}` });
  } else {
    Message.info({
      duration: 3,
      content: '找不到该玩家信息~'
    });
  }
};

const toTeamDetail = row => {
  const team = teamList.find(item => item.name === row.name);
  if (team) {
    router.push({ path: `/dota-team/dota-team-detail/${team.team_id}` });
  } else {
    Message.info({
      duration: 3,
      content: '找不到该队伍信息~'
    });
  }
};

const heroDetail = row => {
  const heroInfo = getCacheData('heroList', 'name_loc', row.name);
  router.push({ path: `/dota-data/dota-hero-summary/${heroInfo.id}` });
};

const toPageDetail = row => {
  const pageType = searchValue.value;
  const methodRelation = {
    playerRankDTO: toPlayerDetail,
    teamRankDTO: toTeamDetail,
    heroRankDTO: heroDetail
  };
  methodRelation[pageType](row);
};

const getProPlayerList = async () => {
  const response = await getProPlayerListAPI();
  proPlayerList.push(...(response.data || []));
};

watch(props, newValue => {
  teamList.push(...newValue.teamList);
});

onMounted(async () => {
  await getProPlayerList();
  getRankInfo();
});
</script>
<style lang="scss" scoped>
.event-rank {
  padding: 10px 0;
  .table {
    padding-top: 15px;
    .link {
      display: inline-block;
      color: #2d8cf0;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90px;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
  .avatar {
    display: flex;
    align-items: center;
  }
  :deep .ivu-table td {
    height: 50px;
  }
}
</style>
