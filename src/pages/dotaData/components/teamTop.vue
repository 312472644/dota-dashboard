<template>
  <Card class="team-summary-box" title="战队排名Top10" :bordered="false" :dis-hover="true">
    <template #extra>
      <span class="href" @click="toAllTeam">更多<Icon type="ios-arrow-forward" /></span>
    </template>
    <page-loading :show="loading" />
    <div v-if="!loading">
      <div class="sub-title">Elo等级分排名 k = 32, init = 1000</div>
      <div class="team">
        <div
          v-for="(item, index) in teamList"
          :key="item.team_id"
          class="team-item rank-item"
          @click="toTeamDetail(item)"
        >
          <div class="rank-no">{{ index + 1 }}</div>
          <div class="avatar" :style="`background-image: url(${item.logo_url})`"></div>
          <div class="name">{{ item.name }}</div>
          <div class="name">等级分:{{ parseFloat(item.rating).toFixed(0) }}</div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getTeamListAPI } from '@/service/common';

const teamList = reactive([]);
const loading = ref(false);
const router = useRouter();

const getTeamList = async () => {
  loading.value = true;
  const response = await getTeamListAPI();
  const teamBlockList = ['CyberBonch-1', 'VGJ Storm'];
  // 过滤错误的数据
  const dataList = (response.data || []).filter(item => item.name !== '' && !teamBlockList.includes(item.name));
  teamList.push(...dataList.slice(0, 10));
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const toAllTeam = () => {
  router.push({ path: '/dota-team' });
};

const toTeamDetail = item => {
  const { team_id } = item;
  router.push({ path: `/dota-team/dota-team-detail/${team_id}` });
};

onMounted(() => {
  getTeamList();
});
</script>
<style lang="scss">
.team-summary-box {
  .avatar {
    border-radius: 3px;
    width: 80px;
    height: 80px;
    margin: 8px auto 0;
    background: #333;
    display: block;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .team {
    display: flex;
    justify-content: space-between;
    .team-item.rank-item {
      width: 110px;
      border: 1px solid #ebedf2;
      background: #f5f6f7;
      border-radius: 4px;
      transition: transform 0.2s ease-in-out;
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
      }
    }
  }
}
</style>
