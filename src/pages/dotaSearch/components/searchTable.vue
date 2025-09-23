<template>
  <div class="search-table">
    <div class="title">{{ title }}</div>
    <Table class="table" :columns="columns" :data="hooksValue.tableList">
      <template #name="{ row }">
        <div class="inline-logo-box" @click="toPlayerDetail(row)">
          <table-image :src="row.avatarfull" fit="cover" />
          <div class="name-box">
            <div>
              <span v-if="row.name && isProPlayer" class="certification">
                <Tooltip :content="`${row.name}身份已认证`" placement="top" :transfer="true">
                  <Icon type="ios-checkmark" size="15" />
                </Tooltip>
              </span>
              <span class="link">{{ row.name || row.personaname }}</span>
              <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
            </div>
            <div v-if="!isProPlayer" class="last-match-time">{{ row.last_match_time }}</div>
          </div>
        </div>
      </template>
      <template v-if="isProPlayer" #teamName="{ row }">
        <div v-if="row.team_name">
          <span class="link" @click="toTeamDetail(row)">{{ row.team_name }}</span>
          <Icon type="ios-arrow-forward" size="13" color="#2d8cf0" />
        </div>
      </template>
    </Table>
    <div class="page-container">
      <Page
        v-model="hooksValue.pageVO.index"
        :total="hooksValue.pageVO.total"
        :page-size="hooksValue.pageVO.size"
        show-sizer
        show-total
        @on-page-size-change="hooksValue.sizeChange"
        @on-change="hooksValue.pageChange"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { usePageQuery } from '@/hooks';
import { useRouter } from 'vue-router';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  isProPlayer: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const hooksValue = reactive({
  pageVO: {},
  tableList: [],
  sizeChange: () => {},
  pageChange: () => {}
});
const columns = ref([{ title: '名称', slot: 'name' }]);

const init = () => {
  const { pageVO, tableList, pageChange, sizeChange } = usePageQuery(props.dataList, 20);
  hooksValue.pageVO = pageVO;
  hooksValue.tableList = tableList;
  hooksValue.pageChange = pageChange;
  hooksValue.sizeChange = sizeChange;
};

const toPlayerDetail = row => {
  router.push({ path: `/dota-data/dota-player-detail/${row.account_id}` });
};

const toTeamDetail = row => {
  router.push({ path: `/dota-team/dota-team-detail/${row.team_id}` });
};

onMounted(() => {
  if (props.isProPlayer) {
    columns.value.push({ title: '团队名称', slot: 'teamName' });
  }
  init();
});
</script>
<style lang="scss" scoped>
.search-table {
  margin-bottom: 10px;
  .title {
    font-size: 14px;
    font-weight: 500;
    padding-bottom: 10px;
  }
  :deep .ivu-image-img {
    border-radius: 3px;
  }
  :deep .table-image {
    margin-right: 10px;
  }
  .certification {
    width: 15px;
    height: 15px;
    background: #e8eaec;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
  }
  .name-box {
    display: flex;
    flex-direction: column;
  }
  .last-match-time {
    font-size: 12px;
  }
}
</style>
