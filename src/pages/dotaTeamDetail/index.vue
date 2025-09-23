<template>
  <page-header title="队伍详情" back hidden-breadcrumb @on-back="back" />
  <div class="dota-team-detail main-container">
    <page-loading :show="loading" />
    <div v-show="!loading">
      <team-background ref="teamBgRef" :team-id="teamId" @complete="loadComplete" />
      <div class="team-content">
        <Tabs class="tab-animate tab-center" :animated="false">
          <TabPane label="概观" name="overview">
            <overview ref="overviewRef" :team-id="teamId" @complete="loadComplete" />
          </TabPane>
          <TabPane label="近期战绩" name="record"><record :options="overviewRef.matchOptions" /></TabPane>
          <TabPane label="英雄" name="heroes"><heroes :options="overviewRef.heroOptions" /></TabPane>
          <TabPane label="玩家" name="players"><players :options="overviewRef.playersOptions" /></TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import teamBackground from './components/teamBackground.vue';
import overview from './components/overview.vue';
import heroes from './components/heroes.vue';
import players from './components/players.vue';
import record from './components/record.vue';

const route = useRoute();
const router = useRouter();
const teamId = ref(route.params.teamId);
const overviewRef = ref({});
const teamBgRef = ref({});
const loading = ref(true);
let loadCount = 0;

const back = () => {
  router.push({ path: '/dota-team' });
};

const loadComplete = () => {
  loadCount++;
  if (loadCount === 2) {
    loading.value = false;
  }
};

watch(route, newValue => {
  const newTeamId = newValue.params.teamId;
  if (newTeamId && teamId.value !== newTeamId) {
    teamId.value = newTeamId;
    window.location.reload();
  }
});
</script>
<style lang="scss">
.dota-team-detail {
  padding-top: 10px;
  min-height: 60px;
  .team-content {
    padding: 0 20px 20px 20px;
  }
  .ivu-image {
    margin-right: 10px;
  }
  .ivu-image-img {
    border-radius: 50%;
    background: #333;
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
