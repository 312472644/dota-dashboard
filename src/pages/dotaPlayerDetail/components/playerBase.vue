<template>
  <div class="player-base">
    <div class="player-base-box">
      <div class="left">
        <div class="player-avatar">
          <img :src="playerInfo.profile.avatarfull" />
        </div>
        <div class="player-info">
          <div class="player-name">
            <span>{{ playerInfo.profile.name || playerInfo.profile.personaname }}</span>
            <span v-if="playerInfo.profile.name" class="certification">
              <Tooltip content="身份已认证" placement="top">
                <Icon type="ios-checkmark" size="20" />
              </Tooltip>
            </span>
            <span v-if="playerInfo.profile.profileurl" class="steam">
              <Tooltip content="Steam资料" placement="top">
                <img src="../../../assets/icons/steam.svg" @click="toSteamProfile" />
              </Tooltip>
            </span>
          </div>
          <div class="player-summary">
            <div class="summary-item">
              <div class="label">胜</div>
              <div class="value win">{{ wl.win }}</div>
            </div>
            <div class="summary-item">
              <div class="label">胜</div>
              <div class="value lose">{{ wl.lose }}</div>
            </div>
            <div class="summary-item">
              <div class="label">胜率</div>
              <div class="value">{{ wl.winRate }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <Tooltip content="Dota Plus会员" placement="top">
          <img v-if="playerInfo.profile.plus" class="plus" src="../../../assets/images/rank/dota_plus_icon.png" />
        </Tooltip>
        <board-rank :rank-tier="playerInfo.rank_tier" :leader-rank="playerInfo.leaderboard_rank" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPlayerAPI, getPlaterWlAPI } from '../api';

const emit = defineEmits(['complete']);

const route = useRoute();
const accountId = ref(route.params.accountId);
const playerInfo = ref({
  profile: {}
});
const wl = ref({ win: 0, lose: 0, winRate: '0%' });

const getPlaterWl = async accountId => {
  const response = await getPlaterWlAPI(accountId);
  const { win, lose } = response.data || {};
  wl.value.win = win;
  wl.value.lose = lose;
  wl.value.winRate = ((win / (win + lose)) * 100).toFixed(2).concat('%');
};

const getPlayer = async accountId => {
  const response = await getPlayerAPI(accountId);
  playerInfo.value = response.data;
};

const toSteamProfile = () => {
  window.open(playerInfo.value.profile.profileurl, '_blank');
};

onMounted(() => {
  if (!accountId.value) {
    return;
  }
  getPlaterWl(accountId.value);
  getPlayer(accountId.value);
  emit('complete');
});
</script>
<style lang="scss">
.player-base {
  .page-loading {
    padding: 10px 0;
  }
  .player-base-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
    .left {
      display: flex;
      align-items: center;
    }
    .player-avatar {
      img {
        width: 80px;
        height: 80px;
        border-radius: 3px;
      }
    }
    .player-info {
      margin-left: 20px;
      .player-name {
        span {
          vertical-align: middle;
        }
        font-size: 20px;
      }
      .player-summary {
        display: flex;
        .summary-item {
          display: flex;
          flex-direction: column;
          width: 50px;
        }
        .label {
          font-size: 12px;
        }
        .value {
          font-size: 15px;
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
    }
    .plus {
      width: 40px;
      height: 50px;
      margin-right: 20px;
      cursor: pointer;
    }
    .rank-medal {
      position: relative;
      img {
        width: 100px;
      }
      cursor: pointer;
    }
    .rank-board {
      position: absolute;
      left: 50%;
      bottom: 0;
      color: #f8f8f9;
      font-size: 15px;
      transform: translate(-50%, -50%);
    }
    .certification {
      width: 20px;
      height: 20px;
      background: #e8eaec;
      border-radius: 50%;
      margin-left: 10px;
      cursor: pointer;
    }
    .steam {
      width: 20px;
      height: 20px;
      img {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        vertical-align: middle;
        opacity: 0.7;
        cursor: pointer;
      }
    }
  }
}
</style>
