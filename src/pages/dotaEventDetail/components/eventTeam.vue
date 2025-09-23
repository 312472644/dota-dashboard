<template>
  <div class="event-team">
    <div v-for="item in eventTeamList" :key="item.id" class="event-team-item" @click="toTeamDetail(item)">
      <div class="team-logo">
        <Image :src="item.logo" width="60px" fit="cover" lazy>
          <template #error>
            <img class="default-team" src="../../../assets/logo/dota.png" />
          </template>
        </Image>
      </div>
      <div class="team-name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getEventSummaryAPI, getTeamListAPI } from '../api';
import { Message } from 'view-ui-plus';

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

const eventTeamList = ref([]);
const router = useRouter();
const teamList = [];

const getEventSummary = async () => {
  const eventId = props.eventId;
  if (!eventId) {
    return;
  }
  const response = await getEventSummaryAPI(eventId);
  const dataList = response.data?.result?.eventTeamList || [];
  eventTeamList.value = dataList;
};

const toTeamDetail = row => {
  const team = teamList.find(item => item.name === row.name);
  if (!team) {
    Message.info({
      content: '未找到该队伍信息~',
      duration: 3
    });
    return;
  }
  router.push({ path: `/dota-team/dota-team-detail/${team.team_id}` });
};

watch(props, newValue => {
  teamList.push(...newValue.teamList);
});

onMounted(async () => {
  await getEventSummary();
});
</script>
<style lang="scss" scoped>
.event-team {
  display: flex;
  flex-wrap: wrap;
  .event-team-item {
    padding: 15px;
    width: calc((100% - 90px) / 10);
    border-radius: 4px;
    margin-bottom: 15px;
    transition: all 0.2s ease-in-out;
    &:not(:nth-of-type(10n)) {
      margin-right: 10px;
    }
    &:hover {
      cursor: pointer;
      background: #f8f8f8;
    }
  }
  .team-logo {
    height: 60px;
    text-align: center;
  }
  .team-name {
    padding-top: 5px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .default-team {
    padding-top: 10px;
  }
}
</style>
