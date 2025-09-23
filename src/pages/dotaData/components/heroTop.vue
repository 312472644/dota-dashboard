<template>
  <Card class="hero-top-box" title="英雄胜率Top10" :bordered="false" :dis-hover="true">
    <template #extra>
      <span class="href" @click="toAll">更多<Icon type="ios-arrow-forward" /></span>
    </template>
    <page-loading :show="loading" />
    <div v-if="!loading">
      <div class="sub-title">冠绝段位英雄胜率</div>
      <div class="rank">
        <div v-for="(item, index) in heroList" :key="index" class="rank-item" @click="toHeroDetail(item)">
          <div class="rank-no">{{ index + 1 }}</div>
          <Image class="avatar" width="60px" height="60px" :src="item.hero_img" lazy></Image>
          <div class="hero-name">{{ item.hero_name }}</div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getHeroTopAPI, getVersionListAPI } from '@/service/common';

const loading = ref(false);
const router = useRouter();
const heroList = reactive([]);
const versionList = reactive([]);

const getVersionList = async () => {
  const response = await getVersionListAPI();
  const dataList = response.data.result;
  versionList.push(...dataList.reverse());
};

const getHeroTop = async () => {
  loading.value = true;
  const response = await getHeroTopAPI(versionList[0], '冠绝');
  const dataList = response.data?.result || [];
  const sortList = dataList.sort((a, b) => b.hero_win_rate - a.hero_win_rate);
  heroList.push(
    ...sortList.slice(0, 10).map(item => {
      return {
        ...item,
        winRate: parseFloat(item.hero_win_rate * 100)
          .toFixed(1)
          .concat('%')
      };
    })
  );
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const toHeroDetail = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

const toAll = () => {
  router.push({ path: `/dota-data/dota-hero-rate` });
};

onMounted(async () => {
  await getVersionList();
  await getHeroTop();
});
</script>
<style lang="scss">
.hero-top-box {
  .rank {
    display: flex;
    justify-content: space-between;
    .rank-item {
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
      margin-top: 8px;
      .ivu-image-img {
        border-radius: 50%;
      }
    }
    .hero-name {
      font-size: 12px;
      margin: 8px 0;
    }
    .score {
      font-size: 12px;
      margin-top: 4px;
    }
    .ivu-image-error {
      position: relative;
    }
  }
}
</style>
