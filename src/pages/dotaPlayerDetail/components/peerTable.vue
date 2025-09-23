<template>
  <div class="peer-box">
    <Table class="table" :columns="columns" :data="dataList">
      <template #personName="{ row }">
        <div class="inline-logo-box">
          <table-image :src="row.avatarfull" fit="cover" />
          <div @click="toPlayerDetail(row)">
            <span class="link">{{ row.personName }}</span>
            <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
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

const columns = ref([
  { title: '玩家', key: 'personName', slot: 'personName', width: '200' },
  { title: '次数', key: 'games' },
  { title: '己方胜率', key: 'winRate' }
]);

const toPlayerDetail = row => {
  location.href = `/#/dota-data/dota-player-detail/${row.account_id}`;
  location.reload();
};

const initProps = () => {
  if (!props.showMoreColumn) {
    return;
  }
  columns.value.push(
    ...[
      { title: '己方', key: 'games' },
      { title: '对方', key: 'against_games' },
      { title: '对方胜率', key: 'againstWinRate' },
      { title: 'GPM', key: 'gpm' },
      { title: 'XPM', key: 'xpm' }
    ]
  );
};

onMounted(() => {
  initProps();
});
</script>
<style lang="scss">
.peer-box {
  .link {
    display: inline-block;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  .ivu-image-img {
    border-radius: 50%;
  }
}
</style>
