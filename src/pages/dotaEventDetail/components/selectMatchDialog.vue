<template>
  <Modal v-model="visible" title="选择比赛场次">
    <Table class="table" :columns="columns" :data="dataList">
      <template #select="{ row }">
        <Radio v-model="row.index" name="group" />
      </template>
    </Table>
  </Modal>
</template>
<script setup>
import { ref } from 'vue';

const visible = ref(true);
const dataList = ref([{ index: 1 }, { index: 2 }]);
const columns = [
  { slot: 'select', title: ' ', width: '60px' },
  { title: '场次', key: 'index' }
];
</script>
