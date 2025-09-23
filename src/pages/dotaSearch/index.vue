<template>
  <div class="search-box main-container">
    <page-header title="搜索结果" hidden-breadcrumb />
    <page-loading :show="loading" />
    <div v-show="!loading" class="content">
      <search-table
        v-if="proPlayerTable.length > 0"
        :data-list="proPlayerTable"
        title="职业选手"
        :is-pro-player="true"
      />
      <search-table v-if="normalPlayerTable.length > 0" :data-list="normalPlayerTable" title="普通玩家" />
      <empty v-if="proPlayerTable.length === 0 && normalPlayerTable.length === 0" empty-text="暂无数据" />
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import searchTable from './components/searchTable.vue';
import { searchAPI, getProPlayerListAPI } from '@/service/common.js';

const route = useRoute();
const loading = ref(false);
const proPlayerList = [];
const proPlayerTable = ref([]);
const normalPlayerTable = ref([]);

const getProPlayerList = async () => {
  const response = await getProPlayerListAPI();
  const dataList = response.data;
  proPlayerList.push(...dataList);
};

const getSearchList = async value => {
  const response = await searchAPI(value);
  const dataList = response.data;
  proPlayerTable.value = proPlayerList.filter(item => [item.name, item.personaname].indexOf(value) > -1);
  normalPlayerTable.value = dataList.map(item => {
    const { last_match_time } = item;
    return {
      ...item,
      last_match_time: dayjs(last_match_time).format('YYYY-MM-DD HH:MM:ss')
    };
  });
};

watch(route, newValue => {
  if (newValue.params?.search) {
    location.reload();
  }
});

onMounted(async () => {
  const searchValue = route.params.search;
  loading.value = true;
  await getProPlayerList();
  await getSearchList(searchValue);
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
<style lang="scss" scoped>
.search-box {
  .content {
    padding: 20px;
  }
  :deep .page-loading {
    padding-top: 5px;
    min-height: 50px;
  }
}
</style>
