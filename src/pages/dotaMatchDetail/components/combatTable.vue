<template>
  <div v-if="radiantList.length > 0" class="combat-table">
    <div class="title">{{ title }}</div>
    <!--头部-->
    <div class="table-header">
      <div class="row-item fixed"></div>
      <div v-for="item in direList" :key="item" class="row-item">
        <img class="hero-icon" :src="item.heroIcon" />
      </div>
      <div class="row-item">
        <img src="../../../assets/icons/nightmare.svg" class="hero-icon dire" />
      </div>
    </div>
    <!--表格内容-->
    <div class="table-body">
      <div v-for="radiant in radiantList" :key="radiant.hero_id" class="row">
        <div class="row-item fixed">
          <img class="hero-icon" :src="radiant.heroIcon" />
        </div>
        <div v-for="item in getKillData(radiant)" :key="item" class="row-item">
          <div class="kill">
            <div class="kill-item">{{ item.kill }}</div>
            <div class="kill-item">{{ item.killBy }}</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="row-item fixed">
          <img src="../../../assets/icons/radiant.svg" class="hero-icon radiant" />
        </div>
        <div v-for="item in getRadiantList()" :key="item" class="row-item">
          <div class="kill">
            <div class="kill-item">{{ item.kill }}</div>
            <div class="kill-item">{{ item.killBy }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Empty v-else />
</template>
<script setup>
import { watch, ref } from 'vue';
const props = defineProps({
  title: {
    type: String || null,
    default: null
  },
  radiantList: {
    type: Array,
    default: () => []
  },
  direList: {
    type: Array,
    default: () => []
  }
});

const direList = ref([]);
const radiantList = ref([]);
const tableList = [];

const getColumnSummary = (list = []) => {
  let kill = 0,
    killBy = 0;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    kill += item.kill;
    killBy += item.killBy;
  }
  return {
    kill,
    killBy
  };
};

const getRadiantList = () => {
  const radiantDataList = [];
  const dataList = [];
  const flatList = tableList.flat(Infinity);
  if (flatList.length === 0) {
    return [];
  }
  for (let i = 0; i <= 5; i++) {
    if (dataList.length <= 5) {
      dataList.push({ data: [flatList[i], flatList[i + 6], flatList[i + 12], flatList[i + 18], flatList[i + 24]] });
    }
  }
  for (let i = 0; i < dataList.length; i++) {
    const { kill, killBy } = getColumnSummary(dataList[i].data);
    radiantDataList.push({ kill, killBy });
  }
  return radiantDataList;
};

const getKillData = item => {
  const { killByList, killList } = item;
  const dataList = [];
  direList.value.forEach(el => {
    const killResult = killList.find(killItem => killItem.key === el.name);
    const killByResult = killByList.find(killByItem => killByItem.key === el.name);
    dataList.push({
      kill: killResult?.value || 0,
      killBy: killByResult?.value || 0
    });
  });
  const totalResult = dataList.reduce((pre, next) => {
    return {
      kill: pre.kill + next.kill,
      killBy: pre.killBy + next.killBy
    };
  });
  dataList.push(totalResult);
  tableList.push(dataList);
  return dataList;
};

watch(props, newValue => {
  direList.value = newValue.direList;
  radiantList.value = newValue.radiantList;
});
</script>
<style lang="scss" scoped>
.combat-table {
  .title {
    font-size: 14px;
    padding: 10px 0;
  }
  .table-header {
    display: flex;
    .row-item {
      background-color: #f8f8f9;
      &:not(:last-of-type) {
        border-right: none;
      }
    }
  }
  .row-item {
    flex: 1;
    padding: 5px 0;
    text-align: center;
    border: 1px solid #e8eaec;
    &:not(:last-of-type) {
      border-right: none;
    }
    &.fixed {
      flex: none;
      width: 50px;
    }
    .kill {
      display: flex;
      align-items: center;
      .kill-item {
        flex: 1;
        color: #fff;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        background: #27c978a6;
        &:nth-of-type(2n) {
          margin-left: 10px;
          background: #ed4014bf;
        }
      }
    }
  }
  .hero-icon {
    width: 25px;
    height: 25px;
    vertical-align: middle;
    &.dire {
      filter: drop-shadow(#ff4c4c 0px 0px 5px);
    }
    &.radiant {
      filter: drop-shadow(green 0px 0px 5px);
    }
  }
  .table-body {
    .row {
      display: flex;
      .row-item {
        border-top: none;
        padding: 10px;
      }
    }
  }
}
</style>
