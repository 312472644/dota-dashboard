<template>
  <page-header title="全部赛事" back hidden-breadcrumb @on-back="back" />
  <div class="dota-all-event main-container">
    <div class="search">
      <RadioGroup v-model="status" class="radio-group" @on-change="changeHandle">
        <Radio label="" border>全部</Radio>
        <Radio :label="1" border>进行中</Radio>
        <Radio :label="2" border>已结束</Radio>
      </RadioGroup>
    </div>
    <page-loading :show="loading" />
    <div v-if="matchList.length > 0" class="match-list">
      <div v-for="item in matchList" v-show="!loading" :key="item.id" class="match-item">
        <div class="match-banner">
          <Image :src="item.coverUrl" lazy width="200px" height="120px"></Image>
        </div>
        <div class="match-info">
          <div class="match-name" :title="item.eventName" @click="toEventDetail(item)">{{ item.eventName }}</div>
          <div class="match-time">{{ item.startDate }} ~ {{ item.endDate }}</div>
          <div :class="['match-status', item.statusItem.status === 1 ? 'in-progress' : '']">
            {{ item.statusItem.statusText }}
          </div>
        </div>
      </div>
    </div>
    <empty v-else />
  </div>
</template>
<script setup>
import lodash from 'lodash';
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getEventListAPI } from '@/service/common';

const router = useRouter();
const status = ref('');
const loading = ref(false);
const matchList = ref([]);
const initMatchList = [];

const back = () => {
  router.push({ path: '/dota-data' });
};

const getStatus = (startTime, endTime) => {
  const currentTime = +new Date();
  // 未开始
  if (currentTime < startTime) {
    return {
      status: 0,
      statusText: '未开始'
    };
  }
  // 进行中
  if (currentTime >= startTime && currentTime <= endTime) {
    return {
      status: 1,
      statusText: '进行中'
    };
  }
  // 已结束
  if (currentTime > endTime) {
    return {
      status: 2,
      statusText: '已结束'
    };
  }
};

const getEventList = async () => {
  const response = await getEventListAPI({ type: 0, pageNum: 1, pageSize: 100 });
  const dataList = (response.data?.result || []).map(item => {
    const { eventStartTime, eventEndTime } = item;
    return {
      ...item,
      statusItem: getStatus(eventStartTime, eventEndTime),
      startDate: dayjs(eventStartTime).format('YYYY-MM-DD'),
      endDate: dayjs(eventEndTime).format('YYYY-MM-DD')
    };
  });
  matchList.value = dataList;
  initMatchList.push(...lodash.cloneDeep(dataList));
};

const toEventDetail = row => {
  router.push({ path: `/dota-data/dota-event-detail/${row.id}` });
};

const changeHandle = () => {
  const statusValue = status.value;
  if (!statusValue) {
    matchList.value = initMatchList;
  } else {
    const dataList = initMatchList.filter(item => item.statusItem.status === statusValue);
    matchList.value = dataList;
  }
  if (matchList.value.length > 0) {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  }
};

onMounted(() => {
  getEventList();
});
</script>
<style lang="scss" scoped>
.dota-all-event {
  padding: 20px;
  .search {
    padding-bottom: 20px;
    .radio-group {
      :deep .ivu-radio-border {
        transition: none;
      }
      :deep .ivu-radio {
        display: none;
      }
      :deep .ivu-radio-wrapper-checked {
        color: #fff;
        background: #0d8dfc;
      }
    }
  }
  .match-list {
    display: flex;
    flex-wrap: wrap;
    .match-item {
      display: flex;
      align-items: center;
      width: calc((100% - 30px) / 3);
      margin-bottom: 30px;
      &:not(:nth-of-type(3n)) {
        margin-right: 15px;
      }
      .match-banner {
        margin-right: 10px;
      }
      .match-info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 90px;
        .match-name {
          font-size: 16px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
          &:hover {
            color: #0d8dfc;
            cursor: pointer;
          }
        }
        .match-time {
          color: #a8abb3;
          font-size: 12px;
        }
        .match-status {
          width: 60px;
          text-align: center;
          color: #fff;
          background: #a8abb3;
          border-radius: 3px;
          &.in-progress {
            background: #0d8dfc;
          }
        }
      }
    }
  }
  :deep {
    .ivu-image-img {
      border-radius: 3px;
    }
    .page-loading {
      padding-bottom: 10px;
    }
  }
}
</style>
