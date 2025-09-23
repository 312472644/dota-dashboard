<template>
  <div class="dota-item-container main-container">
    <Tabs class="tab-animate" :animated="false">
      <TabPane label="商店物品" name="shop">
        <div class="filter">
          <Select v-model="filterValue" style="width: 220px" @on-change="filterEvent">
            <Option v-for="item in shopCategoryList" :key="item.value" :value="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </div>
        <items :data-list="shopList" @show-detail="showDetail" />
      </TabPane>
      <TabPane label="中立物品" name="neutral">
        <items :data-list="neutralList" @show-detail="showDetail" />
      </TabPane>
    </Tabs>
    <item-detail-modal ref="itemDetailModalRef" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import lodash from 'lodash';
import items from './components/items.vue';
import { getDotaItemAPI } from './api';

const initData = ref();
const shopList = ref([]);
const neutralList = ref([]);
const itemDetailModalRef = ref();
const shopCategoryList = ref([]);
const filterValue = ref('all');

const getDotaItem = async () => {
  const response = await getDotaItemAPI();
  const itemResult = response.data || {};
  const { basic, neutral, upgrade } = itemResult.result;
  const shopDataList = basic.concat(upgrade);
  shopList.value.push(...shopDataList);
  neutralList.value.push(...neutral);
  // 原始数据
  initData.value = lodash.cloneDeep(shopList.value);
  getShopCategoryList(shopDataList);
};

const getShopCategoryList = (dataList = []) => {
  const option = dataList.map(item => {
    return {
      label: item.name,
      value: item.name
    };
  });
  shopCategoryList.value.push({ label: '全部', value: 'all' }, ...option);
};

const showDetail = item => {
  itemDetailModalRef.value.showModal(item.item_id);
};

const filterEvent = () => {
  let dataList = initData.value;
  if (filterValue.value !== 'all') {
    dataList = initData.value.filter(item => item.name === filterValue.value);
  }
  shopList.value = [];
  shopList.value.push(...dataList);
};

onMounted(() => {
  getDotaItem();
});
</script>
<style lang="scss">
.dota-item-container {
  padding: 20px;
}
</style>
