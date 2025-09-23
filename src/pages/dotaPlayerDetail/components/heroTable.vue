<template>
  <div class="hero-table-box">
    <Table class="table" :columns="columns" :data="dataList">
      <template #personName="{ row }">
        <div class="inline-logo-box">
          <table-image :src="row.index_img" fit="cover" />
          <div role="container">
            <div @click="toHeroDetail(row)">
              <span class="link">{{ row.name_loc }}</span>
              <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
            </div>
            <div class="start-time">{{ row.lastPlayed }}</div>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  showMoreColumn: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const columns = ref([
  { title: '击杀英雄', key: 'personName', slot: 'personName', width: '200' },
  { title: '次数', key: 'games' },
  { title: '胜率', key: 'winRate' }
]);

const initProps = () => {
  if (props.showMoreColumn) {
    columns.value.push(
      ...[
        { title: '己方', key: 'with_games' },
        { title: '己方胜率', key: 'withWinRate' },
        { title: '对方', key: 'against_games' },
        { title: '对方胜率', key: 'againstWinRate' }
      ]
    );
  }
};

const toHeroDetail = row => {
  router.push({ path: `/dota-data/dota-hero-summary/${row.hero_id}` });
};

onMounted(() => {
  initProps();
});
</script>
