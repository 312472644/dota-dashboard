<template>
  <div class="hero-image-box">
    <div class="inline-logo-box" @click="toPlayerDetail(data)">
      <table-image :src="data.index_img" fit="cover" />
      <span class="hero-color" :style="`background-color:${colors[colorIndex]}`"></span>
      <div>
        <div>
          <span v-if="data.name" class="certification">
            <Tooltip :content="`${data.name}身份已认证`" placement="top" :transfer="true">
              <Icon type="ios-checkmark" size="15" />
            </Tooltip>
          </span>
          <span :class="['link', 'ellipsis', data.name || data.personaname ? '' : 'no-event']">
            {{ data.name || data.personaname || '匿名' }}
          </span>
          <Icon v-if="data.name || data.personaname" type="ios-arrow-forward" size="13" color="#2d8cf0" />
        </div>
        <div class="rank-tier">{{ getBoardRank }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { rankTierMap } from '@/utils/map.js';

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  colorIndex: {
    type: Number,
    default: 0
  }
});

const router = useRouter();
const colors = [
  '#3375ff',
  '#66ffbf',
  '#bf00bf',
  '#f3f00b',
  '#ff6a00',
  '#fe86c2',
  '#a1b447',
  '#65d9f7',
  '#008321',
  '#a46900'
];

const toPlayerDetail = row => {
  router.push({ path: `/dota-data/dota-player-detail/${row.account_id}` });
};

const getBoardRank = computed(() => {
  const rankTier = props.data.rank_tier;
  const rank = Math.floor(rankTier / 10);
  return rankTierMap.get(rank * 10) || '未知';
});
</script>
<style lang="scss">
.hero-image-box {
  .inline-logo-box {
    position: relative;
    .table-image {
      margin-right: 10px;
    }
  }
  .rank-tier {
    padding-top: 5px;
  }
  .ellipsis {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    max-width: 65px;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  .no-event {
    color: #515a6e;
    pointer-events: none;
  }
  .hero-color {
    position: absolute;
    width: 2px;
    height: 35px;
    left: 35px;
  }
  .certification {
    width: 15px;
    height: 15px;
    background: #e8eaec;
    border-radius: 50%;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
