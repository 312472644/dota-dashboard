<template>
  <div class="items-box">
    <page-loading :show="loading" />
    <div v-if="!loading">
      <div class="sub-title">
        <span class="strong">物品</span>
        <span>来自职业比赛的数据</span>
      </div>
      <div v-for="(category, index) in itemsObject" :key="index" class="category">
        <div class="category-title">{{ category.title }}</div>
        <div class="category-content">
          <div v-for="item in category.list" :key="item.id" class="category-item" @click="showDetail(item)">
            <Image width="100%" height="50px" :src="item.avatar" lazy>
              <template #placeholder>
                <Spin size="large" fix />
              </template>
            </Image>
          </div>
        </div>
      </div>
    </div>
  </div>
  <item-detail-modal ref="itemDetailModalRef" />
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getItemPopularityAPI } from '../api';
import { getCacheItem } from '@/utils';

const itemsObject = reactive([]);
const itemDetailModalRef = ref();
const loading = ref(false);

const getItems = data => {
  const dataList = [];
  const keys = Object.keys(data);
  keys.forEach(item => {
    const items = getCacheItem(item);
    if (items) {
      dataList.push({
        ...items,
        avatar: `https://www.dota2.com.cn/items/images/${items.img}`
      });
    }
  });
  return dataList;
};

const load = async heroId => {
  if (itemsObject.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getItemPopularityAPI(heroId || 69);
  const { early_game_items, late_game_items, mid_game_items, start_game_items } = response.data;
  const startGameItems = getItems(start_game_items);
  const earlyGameItems = getItems(early_game_items);
  const midGameItems = getItems(mid_game_items);
  const lateGameItems = getItems(late_game_items);
  itemsObject.push(
    { title: '初始', list: startGameItems },
    { title: '前期', list: earlyGameItems },
    { title: '中期', list: midGameItems },
    { title: '后期', list: lateGameItems }
  );
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const showDetail = item => {
  itemDetailModalRef.value.showModal(item.item_id);
};

defineExpose({
  load
});
</script>
<style lang="scss">
.items-box {
  min-height: 50px;
  .category {
    .category-title {
      padding-left: 10px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 4px;
        width: 3px;
        height: 12px;
        background: #333;
      }
    }
    .category-content {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0;
    }
    .category-item {
      width: calc((100% - 150px) / 16);
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      .ivu-image-img {
        border-radius: 3px;
      }
    }
  }
}
</style>
