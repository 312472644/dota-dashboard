<template>
  <div class="board-rank">
    <div v-if="boardRank.star" class="rank-star">
      <img :src="`https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_${boardRank.star}.png`" />
    </div>
    <div class="rank-icon">
      <Tooltip :content="boardRank.rankName" placement="top">
        <img :src="boardRank.url" />
      </Tooltip>
      <div v-if="boardRank.leaderRank" class="leader-rank">{{ boardRank.leaderRank }}</div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import defaultRank from '@/assets/images/rank/rank_icon_0.png';
import { rankTierMap } from '@/utils/map.js';

const props = defineProps({
  rankTier: {
    type: Number,
    default: 0
  },
  leaderRank: {
    type: Number,
    default: 0
  }
});

const boardRank = ref({});
const getBoardRank = (rankTier, leaderRank = 0) => {
  let url = defaultRank;
  let star = 0;
  const urlSuffix = 'https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_';
  const rank = Math.floor(rankTier / 10);
  // 冠绝一世
  if (rankTier === 80) {
    // 1000名以内
    let tier = '8';
    if (leaderRank <= 100 && leaderRank > 10) {
      tier = '8b';
    } else if (leaderRank <= 10 && leaderRank > 0) {
      tier = '8c';
    }
    star = 0;
    url = `${urlSuffix}${tier}.png`;
  } else if (rankTier) {
    star = rankTier % 10;
    url = `${urlSuffix}${rank}.png`;
  }
  boardRank.value = {
    star,
    url,
    leaderRank,
    rankName: star ? `${rankTierMap.get(rank * 10)}[${star}]` : rankTierMap.get(rank * 10) || '未知'
  };
};

watch(props, newValue => {
  getBoardRank(newValue.rankTier, newValue.leaderRank);
});

onMounted(() => {
  if (props.rankTier) {
    getBoardRank(props.rankTier, props.leaderRank);
  }
});
</script>
<style lang="scss">
.board-rank {
  position: relative;
  img {
    width: 100px;
    height: 100px;
  }
  .rank-star {
    position: absolute;
    top: -5px;
  }
  .rank-icon {
    position: relative;
    .leader-rank {
      position: absolute;
      color: #f8f8f9;
      bottom: 13px;
      font-size: 13px;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
