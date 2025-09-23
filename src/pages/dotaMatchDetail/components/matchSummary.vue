<template>
  <div class="match-summary">
    <div class="match-info">
      <div class="match-result win">
        <span
          v-if="summaryResult?.winTeam?.logo_url"
          class="logo"
          :style="`background-image:url(${summaryResult?.winTeam?.logo_url})`"
        ></span>
        <span class="win-team-name">{{ summaryResult?.winTeam?.name }}</span>
        <span>胜利</span>
      </div>
      <div class="match-detail">
        <div class="score win">{{ summaryResult.radiant_score || 0 }}</div>
        <div class="info">
          <div class="game-mode">{{ summaryResult.gameMode || '-' }}</div>
          <div class="duration">{{ summaryResult.duration || '00:00' }}</div>
          <div class="end-time">{{ summaryResult.startTime || '-' }}</div>
        </div>
        <div class="score lose">{{ summaryResult.dire_score || 0 }}</div>
      </div>
      <div class="match-extract">
        <div v-if="summaryResult?.league?.name" class="ext-item">
          <div class="sub-title">LEAGUE</div>
          <div class="sub-text" :title="summaryResult?.league?.name || '-'">
            {{ summaryResult?.league?.name || '-' }}
          </div>
        </div>
        <div class="ext-item">
          <div class="sub-title">比赛编号</div>
          <div class="sub-text">{{ summaryResult.match_id || '-' }}</div>
        </div>
      </div>
    </div>
    <div v-if="!isParse" class="unparse-box">
      <div class="unparse">
        <Icon type="ios-warning" :size="20" color="#ff9900" />
        <span class="desc">此录像暂未分析，有些数据暂时无法获取。</span>
      </div>
      <div class="analysis">
        <div :class="['analysis-box', disabled ? 'disabled' : '']" @click="analysis">
          <Icon type="ios-finger-print" :size="30" />
          <span>分析</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { watch, ref } from 'vue';
import { formatTimeStampMS } from '@/utils';
import { gameModeMap } from '@/utils/map';
import { getJobIdAPI, requestAPI } from '../api';
import { Message } from 'view-ui-plus';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  isParse: {
    type: Boolean,
    default: false
  }
});

let timerId = null;
const disabled = ref(false);
const summaryResult = ref({});

const getWinTeam = data => {
  const { dire_score, radiant_score, radiant_team, dire_team } = data;
  return radiant_score > dire_score ? radiant_team || { name: '天辉' } : dire_team || { name: '夜魇' };
};

const init = data => {
  const { game_mode, start_time, duration } = data;
  const team = getWinTeam(data);
  summaryResult.value = {
    ...data,
    startTime: dayjs(start_time * 1000).format('YYYY-MM-DD HH:MM:ss'),
    gameMode: gameModeMap.get(game_mode),
    duration: formatTimeStampMS(duration),
    winTeam: team
  };
};

const loopRequest = async jobId => {
  const response = await requestAPI(jobId);
  const isParseComplete = response?.data?.type === 'parse';
  if (isParseComplete) {
    timerId = setTimeout(() => {
      loopRequest(jobId);
    }, 3000);
  } else {
    clearTimeout(timerId);
    disabled.value = false;
    Message.destroy();
    window.location.reload();
  }
};

const analysis = async () => {
  if (disabled.value) {
    return;
  }
  disabled.value = true;
  Message.loading({
    content: '分析数据中，分析过程比较耗时，请耐心等待~',
    duration: 0
  });
  const matchId = summaryResult.value.match_id;
  const response = await getJobIdAPI(matchId);
  const jobId = response.data?.job?.jobId;
  if (!jobId) {
    return;
  }
  loopRequest(jobId);
};

watch(props, newValue => {
  init(newValue.data);
});
</script>
<style lang="scss">
.match-summary {
  padding: 10px 20px 20px 20px;
  .match-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .match-result {
    display: flex;
    align-items: center;
    border-radius: 3px;
    font-size: 16px;
  }
  .win-team-name {
    padding-right: 5px;
  }
  .logo {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 3px;
    background: #333;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }
  .match-detail {
    display: flex;
    .score {
      font-size: 48px;
    }
    .info {
      padding: 0 10px;
      text-align: center;
      .game-mode {
        font-size: 15px;
      }
      .duration {
        font-size: 24px;
      }
      .end-time {
        color: #808695;
        font-size: 12px;
      }
    }
  }
  .match-extract {
    display: flex;
    .ext-item {
      &:not(:last-of-type) {
        margin-right: 20px;
      }
      .sub-title {
        text-align: right;
        color: #808695;
        font-size: 12px;
      }
      .sub-text {
        font-size: 15px;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .unparse-box {
    .unparse {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .desc {
        color: #ff9900;
        padding-left: 5px;
      }
    }
    .analysis {
      display: flex;
      margin-top: 5px;
      justify-content: center;
      .analysis-box {
        display: flex;
        align-items: center;
        padding: 3px 8px;
        transition: background 0.3s linear;
        &:hover {
          cursor: pointer;
          background: #dcdee2;
          border-radius: 3px;
        }
        &.disabled {
          &:hover {
            cursor: not-allowed;
          }
        }
      }
      span {
        padding-left: 3px;
      }
    }
  }
}
</style>
