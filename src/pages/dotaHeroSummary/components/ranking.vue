<template>
  <div class="overview-card">
    <div class="title">排名</div>
    <div class="content">
      <Table class="table" :columns="columns" :data="tableList">
        <template #personaName="{ row }">
          <div class="inline-logo-box">
            <table-image :src="row.avatar" />
            <div class="rank-tier-box">
              <div>
                <span class="link" @click="toPlayerDetail(row)">{{ row.personaname }}</span>
                <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
              </div>
              <div class="rank-tier">{{ row.rankTier }}</div>
            </div>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getRankListAPI } from '../api';

const props = defineProps({
  heroId: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const columns = reactive([
  { title: '排名', type: 'index', width: 80 },
  { title: '名称', slot: 'personaName' },
  { title: '分数', key: 'score', width: 200 }
]);
const tableList = reactive([]);

const getRankTier = data => {
  if (data === 80) {
    return '冠绝一世';
  } else if (data > 70 && data < 80) {
    return `超凡入圣[${data - 70}]`;
  }
};

const getRankList = async heroId => {
  const response = await getRankListAPI(heroId);
  const dataList = (response.data.rankings || []).map(item => {
    return {
      ...item,
      rankTier: getRankTier(item.rank_tier),
      score: parseInt(item.score)
    };
  });
  tableList.length = 0;
  tableList.push(...dataList);
};

const toPlayerDetail = row => {
  router.push({ path: `/dota-data/dota-player-detail/${row.account_id}` });
};

onMounted(() => {
  getRankList(props.heroId);
});

defineExpose({
  getRankList
});
</script>
<style lang="scss">
.inline-logo-box {
  display: flex;
  .rank-tier-box {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .rank-tier {
      font-size: 12px;
    }
  }
  .ivu-image-img {
    border-radius: 50%;
  }
}
</style>
