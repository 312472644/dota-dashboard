<template>
  <Card class="rank-box" title="天梯排名Top10" :bordered="false" :dis-hover="true">
    <template #extra>
      <span class="href" @click="toAllRank">更多<Icon type="ios-arrow-forward" /></span>
    </template>
    <page-loading :show="loading" />
    <div v-if="!loading">
      <div class="sub-title">Elo等级分排名 k = 32, init = 1000</div>
      <div v-if="rankList.length > 0" class="rank">
        <div v-for="(item, index) in rankList" :key="index" class="rank-item" @click="toPlayerDetail(item)">
          <div class="rank-no">{{ item.rank }}</div>
          <Image class="avatar" width="60px" height="60px" :src="item?.steam_id_info?.avatar_url">
            <template #error>
              <img src="../../../assets/logo/dota.png" />
            </template>
          </Image>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
      <Empty v-else />
    </div>
  </Card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Message } from 'view-ui-plus';
import { getRankListAPI } from '@/service/proxy-request';
import { useRouter } from 'vue-router';
import { Empty } from '@/components';

const loading = ref(false);
const router = useRouter();
const rankList = reactive([]);

const getRankList = async () => {
  loading.value = true;
  try {
    const response = await getRankListAPI();
    const dataList = response.data?.result || [];
    rankList.push(...dataList.slice(0, 10));
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
};

const toPlayerDetail = data => {
  const { steam_id_info } = data;
  if (!steam_id_info?.avatar_url) {
    Message.info({
      content: '暂时无该玩家信息~',
      duration: 3
    });
    return;
  }
  router.push({ path: `/dota-data/dota-player-detail/${steam_id_info.steam_id}` });
};

const toAllRank = () => {
  router.push({ path: `/dota-data/dota-all-rank` });
};

onMounted(() => {
  getRankList();
});
</script>
<style lang="scss">
.rank-box {
  .rank {
    display: flex;
    justify-content: space-between;
    .rank-item {
      padding: 10px !important;
      width: 110px;
      border: 1px solid #ebedf2;
      background: #f5f6f7;
      text-align: center;
      border-radius: 4px;
      transition: transform 0.2s ease-in-out;
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
    .avatar {
      margin-top: 10px;
      .ivu-image-img {
        border-radius: 50%;
      }
    }
    .name {
      font-size: 12px !important;
      margin: 8px 0;
    }
    .ivu-image-error {
      position: relative;
    }
  }
}
</style>
