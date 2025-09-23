<template>
  <page-header title="赛事详情" back hidden-breadcrumb @on-back="back" />
  <div class="dota-event-detail main-container">
    <page-loading :show="loading" />
    <div v-show="!loading">
      <anchor-link id="eventSummary" title="赛事信息">
        <event-summary :event-id="eventId" />
      </anchor-link>
      <anchor-link id="eventList" title="赛程信息">
        <schedule-match-list :event-id="eventId" :team-list="teamList" />
      </anchor-link>
      <anchor-link id="eventRank" title="赛事榜单">
        <event-rank :event-id="eventId" :team-list="teamList" />
      </anchor-link>
      <anchor-link id="eventTeam" title="参赛队伍">
        <event-team :event-id="eventId" :team-list="teamList" />
      </anchor-link>
    </div>
  </div>
  <anchor :anchor-list="anchorList" />
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTeamListAPI } from './api';

import eventSummary from './components/eventSummary.vue';
import eventTeam from './components/eventTeam.vue';
import scheduleMatchList from './components/scheduleMatchList.vue';
import eventRank from './components/eventRank.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const eventId = route.params.eventId;
const teamList = ref([]);
const anchorList = ref([
  { title: '赛事信息', name: 'eventSummary' },
  { title: '赛程信息', name: 'eventList' },
  { title: '赛事榜单', name: 'eventRank' },
  { title: '参赛队伍', name: 'eventTeam' }
]);

const back = () => {
  router.push({ path: `/dota-data/dota-all-event` });
};

const getTeamList = async () => {
  const response = await getTeamListAPI();
  teamList.value = response.data || [];
};

onMounted(() => {
  loading.value = true;
  getTeamList();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
<style lang="scss" scoped>
.dota-event-detail {
  padding: 20px;
  :deep .ivu-spin-text {
    padding-bottom: 20px;
  }
}
</style>
