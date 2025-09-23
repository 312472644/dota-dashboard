<template>
  <div class="match-table-box">
    <Table class="table" :columns="columns" :data="dataList">
      <template #hero_id="{ row }">
        <div class="inline-logo-box">
          <table-image :src="row.index_img" fit="cover" />
          <div role="container">
            <div @click="toMatchDetail(row)">
              <span class="link name-loc">{{ row.name_loc }}</span>
              <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
            </div>
            <div class="start-time">{{ row.startTime }}</div>
          </div>
          <div v-if="row.laneRole" class="lane-role">{{ row.laneRole }}</div>
        </div>
      </template>
      <template #result="{ row }">
        <div :class="{ link: true, win: true, lose: !row.isWin }" @click="toMatchDetail(row)">
          <span>{{ row.isWin ? '比赛胜利' : '比赛失败' }}</span>
          <Icon type="ios-arrow-forward" size="13" :color="row.isWin ? '#19be6b' : '#ed4014'" />
        </div>
        <div>{{ row.lobby_type }}</div>
      </template>
      <template #items="{ row }">
        <table-image v-for="(items, index) in row.items" :key="index" class="item" :src="items" />
      </template>
    </Table>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  showItems: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const route = useRoute();
const columns = ref([
  { title: '击杀英雄', key: 'hero_id', slot: 'hero_id', width: '200' },
  { title: '胜败', key: 'radiant_win', slot: 'result', width: '150' },
  { title: '游戏模式', key: 'game_mode', width: '150' },
  { title: '时长', key: 'duration' },
  { title: '击杀', key: 'kills' },
  { title: '死亡', key: 'deaths' },
  { title: '助攻', key: 'assists' }
]);

const toMatchDetail = row => {
  const accountId = route.params.accountId;
  router.push({ path: `/dota-data/dota-match-detail/${row.match_id}`, query: { accountId } });
};

onMounted(() => {
  if (props.showItems) {
    columns.value.push({ title: '物品', slot: 'items', width: 300 });
  }
});
</script>
<style lang="scss">
.match-table-box {
  .name-loc {
    cursor: pointer;
  }
  .lane-role {
    padding-left: 10px;
  }
  .item:not(:last-of-type) {
    margin-right: 8px;
  }
}
</style>
