<template>
  <div class="event-summary">
    <div class="event-logo">
      <img :src="eventInfo.coverUrl" />
    </div>
    <div class="event-detail">
      <div class="event-name">{{ eventInfo.eventName }}</div>
      <div class="event-date">{{ eventInfo.startDate }} ~ {{ eventInfo.endDate }}</div>
      <div class="event-tag">
        <Tag type="border">{{ eventInfo.eventCity }}</Tag>
        <Tag type="border">{{ eventInfo.eventAward }}</Tag>
        <Tag type="border" :color="eventInfo.statusItem?.status === 2 ? '#0d8dfc' : ''">
          {{ eventInfo.statusItem?.statusText }}
        </Tag>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { getEventListAPI } from '@/service/common';

const props = defineProps({
  eventId: {
    type: String,
    default: ''
  }
});

const eventInfo = ref({});

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
  eventInfo.value = dataList.find(item => item.id.toString() === props.eventId);
};

onMounted(() => {
  getEventList();
});
</script>
<style lang="scss" scoped>
.event-summary {
  display: flex;
  .event-logo {
    > img {
      width: 200px;
      height: 120px;
      border-radius: 3px;
    }
  }
  .event-detail {
    display: flex;
    margin-left: 15px;
    flex-direction: column;
    justify-content: space-evenly;
    .event-name {
      font-size: 16px;
    }
    .event-date {
      color: #a8abb3;
      font-size: 12px;
      padding: 5px 0;
    }
    .event-tag {
    }
  }
}
</style>
