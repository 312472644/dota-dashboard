<template>
  <div class="schedule-match-list">
    <div class="search">
      <DatePicker v-model="selectDateRange" type="daterange" placeholder="请选择日期" @on-change="changeDate" />
    </div>
    <div v-show="scheduleMatchList.length > 0" class="schedule-item-box">
      <div v-for="(item, index) in scheduleMatchList" :key="index" class="schedule-item">
        <div class="divider">{{ item.group }}</div>
        <div class="match-item-box">
          <div
            v-for="matchItem in item.list"
            :key="matchItem.matchId"
            class="match-item-wrap"
            @click="expandCollapse(matchItem)"
          >
            <div class="match-item">
              <div class="bo">BO {{ matchItem.box }}</div>
              <div class="left side">
                <div class="start-time">{{ matchItem.startTime }}</div>
              </div>
              <div class="center">
                <div class="team">
                  <div class="team-logo">
                    <Image :src="matchItem.awayLogo" width="50px" fit="cover" lazy>
                      <template #placeholder>
                        <Spin size="small" />
                      </template>
                    </Image>
                  </div>
                  <div class="team-name" @click.stop="toTeamDetail(matchItem, 'awayName')">
                    {{ matchItem.awayName }}
                  </div>
                </div>
                <div class="score-box">
                  <div class="score-item">
                    <div class="top-bg"></div>
                    <div class="top-bottom"></div>
                    <div :class="['score', matchItem.awayScore > matchItem.homeScore ? 'win-team' : '']">
                      {{ matchItem.awayScore }}
                    </div>
                  </div>
                  <div class="score-item">
                    <div class="top-bg"></div>
                    <div class="top-bottom"></div>
                    <div :class="['score', matchItem.homeScore > matchItem.awayScore ? 'win-team' : '']">
                      {{ matchItem.homeScore }}
                    </div>
                  </div>
                </div>
                <div class="team right-align">
                  <div class="team-name" @click.stop="toTeamDetail(matchItem, 'homeName')">
                    {{ matchItem.homeName }}
                  </div>
                  <div class="team-logo">
                    <Image :src="matchItem.homeLogo" width="50px" fit="cover" lazy>
                      <template #placeholder>
                        <Spin size="small" />
                      </template>
                    </Image>
                  </div>
                </div>
              </div>
              <div class="right side">
                <span class="match-status">{{ matchItem.statusText }}</span>
              </div>
            </div>
            <!--英雄缩略图-->
            <div v-show="matchItem.expand" class="match-detail">
              <div v-show="!matchItem.loading" class="match-content">
                <div
                  v-for="(detailItem, detailIndex) in matchItem.detailList"
                  :key="detailIndex"
                  class="match-detail-item"
                >
                  <div class="hero-icon">
                    <Image
                      v-for="iconItem in detailItem.direHeros"
                      :key="iconItem.heroId"
                      :src="iconItem.heroIcon"
                    ></Image>
                  </div>
                  <div class="hero-score side-center">
                    <span class="score">{{ detailItem.direScore }}</span>
                    <span class="char">:</span>
                    <span class="score">{{ detailItem.radiantScore }}</span>
                  </div>
                  <div class="hero-icon">
                    <Image
                      v-for="iconItem in detailItem.radiantHeros"
                      :key="iconItem.heroId"
                      :src="iconItem.heroIcon"
                    ></Image>
                  </div>
                  <span
                    v-if="matchItem.matchStatus === 3"
                    class="view-detail"
                    @click="toMatchDetail(matchItem, detailIndex)"
                  >
                    查看
                  </span>
                </div>
              </div>
              <Spin v-if="matchItem.loading">
                <Icon type="ios-loading" color="#808695" size="18" class="spin-icon-load"></Icon>
                <div style="color: #808695">加载中...</div>
              </Spin>
              <div v-if="matchItem.detailList.length === 0 && !matchItem.loading" class="no-record">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <empty v-if="scheduleMatchList.length === 0" empty-text="未找到赛事信息" />
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import lodash from 'lodash';
import dayjs from 'dayjs';
import { Message } from 'view-ui-plus';
import { getScheduleMatchListAPI, getTeamInfoByMatchIdAPI, getSteamIdByNidAPI, getHeroIconAPI } from '../api';

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

const router = useRouter();
const initDataList = ref([]);
const selectDateRange = ref([]);
const scheduleMatchList = ref([]);
const matchStatusList = ref([]);
const teamList = [];

const getMatchStatus = status => {
  const statusMap = {
    1: '未开始',
    2: '进行中',
    3: '已结束'
  };
  return statusMap[status];
};

const getTeamInfoByMatchId = async matchId => {
  const response = await getTeamInfoByMatchIdAPI(matchId);
  matchStatusList.value = response.data?.result?.matchStatusList || [];
};

const getSteamId = async nid => {
  if (!nid) {
    return;
  }
  const response = await getSteamIdByNidAPI(nid);
  return response.data?.result;
};

const expandCollapse = async row => {
  if (row.matchStatus !== 3) {
    Message.info({
      duration: 3,
      content: '比赛未结束，还不能查看数据详情~'
    });
    return;
  }
  row.expand = !row.expand;
  if (row.detailList.length > 0) {
    return;
  }
  row.loading = true;
  const { matchId } = row;
  const response = await getHeroIconAPI(matchId);
  row.detailList = response.data?.result || [];
  setTimeout(() => {
    row.loading = false;
  }, 1000);
};

const toTeamDetail = (row, propName) => {
  const team = teamList.find(item => item.name === row[propName]);
  if (!team) {
    Message.info({
      content: '未找到该队伍信息~',
      duration: 3
    });
    return;
  }
  router.push({ path: `/dota-team/dota-team-detail/${team.team_id}` });
};

const toMatchDetail = async (row, index) => {
  window.event.stopPropagation();
  await getTeamInfoByMatchId(row.matchId);
  if (matchStatusList.value.length === 0) {
    return;
  }
  const matchId = await getSteamId(matchStatusList.value[index].matchId);
  router.push({ path: `/dota-data/dota-match-detail/${matchId}` });
};

const transformMatchList = (list = []) => {
  const dataList = [];
  list.forEach(item => {
    const { matchTime, matchStatus } = item;
    const matchDate = dayjs(matchTime).format('YYYY-MM-DD');
    item.startTime = dayjs(matchTime).format('HH:MM');
    item.statusText = getMatchStatus(matchStatus);
    item.matchDate = matchDate;
    item.loading = false;
    item.expand = false;
    item.detailList = [];
    const dataItem = dataList.find(el => el.group === matchDate);
    if (!dataItem) {
      dataList.push({
        group: matchDate,
        list: [item]
      });
    } else {
      dataItem.list.push(item);
    }
  });

  scheduleMatchList.value = dataList;
  initDataList.value = lodash.cloneDeep(scheduleMatchList.value);
};

const getFilterList = (startDate, endDate) => {
  return initDataList.value.filter(item => {
    const timeStamp = +new Date(item.group);
    return timeStamp >= +new Date(startDate) && timeStamp <= +new Date(endDate);
  });
};

const changeDate = date => {
  const [startDate, endDate] = date;
  if (!startDate || !endDate) {
    scheduleMatchList.value = initDataList.value;
    return;
  }
  scheduleMatchList.value = getFilterList(startDate, endDate);
};

const getScheduleMatchList = async () => {
  const response = await getScheduleMatchListAPI(props.eventId);
  const currentDay = dayjs(+new Date()).format('YYYY-MM-DD');
  const dataList = response.data?.result || [];
  selectDateRange.value = [currentDay, currentDay];
  transformMatchList(dataList);
  const filterList = getFilterList(currentDay, currentDay);
  if (filterList.length > 0) {
    changeDate(selectDateRange.value);
  }
};

watch(props, newValue => {
  teamList.push(...newValue.teamList);
});

onMounted(() => {
  getScheduleMatchList();
});
</script>
<style lang="scss" scoped>
.schedule-match-list {
  .search {
    padding-bottom: 10px;
  }
  .schedule-item-box {
    max-height: 500px;
    overflow-y: auto;
  }
  .divider {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 9;
    color: #515a6e;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .match-item-box {
    position: relative;
    .match-item-wrap {
      border-radius: 5px;
      border: 1px solid #f5f6f7;
      margin-bottom: 10px;
    }
    .bo {
      width: 40px;
      height: 25px;
      line-height: 25px;
      border-radius: 3px 0 8px 0;
      text-align: center;
      font-size: 13px;
      color: #808695;
      background: #f5f6f7;
      position: absolute;
      top: 0;
      left: 0;
    }
    .match-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 15px 0 15px;
      height: 120px;
      cursor: pointer;
    }
    .side {
      position: relative;
      width: 180px;
      text-align: center;
    }
    .left {
      .start-time {
        font-size: 20px;
        font-weight: bold;
      }
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #e8eaec;
      }
    }
    .center {
      display: flex;
      justify-content: center;
      width: calc(100% - 360px);
      .team {
        display: flex;
        align-items: center;
        width: 240px;
        .team-name {
          padding: 0 10px;
          font-size: 17px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover {
            cursor: pointer;
            color: #5cadff;
          }
        }
      }
      .score-box {
        display: flex;
        .score-item {
          position: relative;
          width: 35px;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          border-radius: 3px;
          &:first-of-type {
            margin-right: 15px;
          }
          .top-bg {
            width: 100%;
            height: 50%;
            background: #424447;
          }
          .top-bottom {
            width: 100%;
            height: 50%;
            background: #2d2f33;
          }
          .score {
            display: block;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            color: #fff;
            font-size: 20px;
          }
        }
        .win-team {
          color: #f2dbb3 !important;
        }
      }
    }
    .right {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 1px;
        background: #e8eaec;
      }
      .status {
        display: inline-block;
        padding: 8px 0;
        border: 1px solid #dcdee2;
        border-radius: 30px;
        width: 80px;
        font-size: 12px;
        &:hover {
          cursor: pointer;
        }
      }
      .match-status {
        padding: 0 10px;
      }
    }
    .right-align {
      justify-content: flex-end;
    }
    .match-detail {
      padding: 20px 0;
      background: #fafafa;
      .match-detail-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 180px;
        margin-bottom: 15px;
        .side-center {
          padding: 0 20px;
        }
        .score {
          display: inline-block;
          width: 25px;
          text-align: center;
        }
        .hero-icon {
          :deep .ivu-image:not(:nth-of-type(5n)) .ivu-image-inner {
            padding-right: 20px;
          }
        }
        .hero-score {
          font-size: 16px;
          font-weight: bold;
          .char {
            padding: 0 3px;
          }
        }
      }
      .match-content {
        .match-detail-item:last-of-type {
          margin-bottom: 0;
        }
      }
      .view-detail {
        margin-left: 20px;
        position: absolute;
        right: 220px;
        &:hover {
          color: #5cadff;
          cursor: pointer;
        }
      }
    }
  }
  .no-record {
    text-align: center;
  }
}
</style>
