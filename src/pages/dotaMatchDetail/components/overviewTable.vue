<template>
  <div class="over-view-table-box">
    <Collapse v-model="modelValue" simple>
      <Panel :name="panelName">
        <span class="team-name">{{ text }}</span>
        <span v-if="isWinner" class="winner">胜者</span>
        <template #content>
          <Table class="table" :row-class-name="rowClassName" :columns="columns" :data="dataList">
            <template #player="{ row, index }">
              <hero-image :data="row" :color-index="index" />
            </template>
            <template #last_hits="{ row }">
              <div>
                {{ row.last_hits }}
                <span class="split-char">/</span>
                {{ row.denies }}
              </div>
            </template>
            <template #per_min="{ row }">
              <div>
                {{ row.gold_per_min }}
                <span class="split-char">/</span>
                {{ row.xp_per_min }}
              </div>
            </template>
            <template #item="{ row }">
              <div class="package">
                <div class="item-box">
                  <div v-for="item in row.itemList" :key="item.item_id" class="item-image" @click="previewDialog(item)">
                    <Image width="35px" height="35px" :src="`https://www.dota2.com.cn/items/images/${item.img}`" />
                    <div class="time-log">{{ item.time }}</div>
                  </div>
                </div>
                <div v-if="row.backpackList.length > 0" class="backpack">
                  <div class="backpack-logo">
                    <img src="../../../assets/images/backpack.svg" />
                  </div>
                  <div class="backpack-image">
                    <div
                      v-for="item in row.backpackList"
                      :key="item.item_id"
                      class="item-image"
                      @click="previewDialog(item)"
                    >
                      <Image width="20px" height="20px" :src="`https://www.dota2.com.cn/items/images/${item.img}`" />
                    </div>
                  </div>
                </div>
                <div v-if="row?.item_neutral?.img" class="neutral" @click="previewDialog(row.item_neutral)">
                  <Image
                    width="35px"
                    height="35px"
                    :src="`https://www.dota2.com.cn/items/images/${row.item_neutral.img}`"
                  />
                </div>
              </div>
            </template>
          </Table>
          <div v-if="bpList.length > 0" class="bp-box">
            <div v-for="item in bpList" :key="item.hero_id" :class="{ 'bp-item': true, ban: !item.is_pick }">
              <table-image :src="item.index_img" fit="cover" width="40px" height="30px" />
              <div class="cover-image">{{ item.is_pick ? `选择${item.order + 1}` : `禁止${item.order + 1}` }}</div>
            </div>
          </div>
        </template>
      </Panel>
    </Collapse>
    <item-detail-modal ref="itemDetailModalRef" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import heroImage from './heroImage.vue';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  bpList: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ''
  },
  panelName: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  isWinner: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const modelValue = ref(props.value);
const accountId = route.query.accountId;
const itemDetailModalRef = ref();

const columns = [
  { title: '玩家', slot: 'player', width: '180px' },
  { title: '等级', key: 'level', width: '60px' },
  { title: '击杀', key: 'kills', width: '60px' },
  { title: '死亡', key: 'deaths', width: '60px' },
  { title: '助攻', key: 'assists', width: '60px' },
  { title: '正补/反补', slot: 'last_hits', width: '90px' },
  { title: 'GPM/XPM', slot: 'per_min', width: '100px' },
  { title: '英雄伤害', key: 'hero_damage' },
  { title: '防御塔伤害', key: 'tower_damage', width: '100px' },
  { title: '英雄治疗', key: 'hero_healing' },
  { title: '物品', slot: 'item', width: '350px' }
];

const previewDialog = item => {
  itemDetailModalRef.value.showModal(item.item_id);
};

const rowClassName = row => {
  return row?.account_id?.toString() === accountId ? 'current-player' : '';
};
</script>
<style lang="scss">
.over-view-table-box {
  margin-bottom: 10px;
  .table {
    .ivu-table-row {
      height: 77px;
    }
    .current-player td {
      background-color: #f8f8f9;
    }
  }
  .team-name {
    font-size: 14px;
  }

  .split-char {
    padding: 0 1px;
  }
  .item-box {
    display: flex;
    width: 265px;
  }
  .item-image {
    position: relative;
    .ivu-image-img {
      border-radius: 3px;
    }
    cursor: pointer;
    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }
  .package {
    position: relative;
  }
  .neutral {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background: #333;
    cursor: pointer;
    .ivu-image-img {
      border-radius: 50%;
    }
  }
  .time-log {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    opacity: 0.8;
    color: #fff;
    font-size: 12px;
    background-color: #00000099;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .backpack {
    display: flex;
    margin-top: 5px;
    .backpack-image {
      display: flex;
    }
    .backpack-logo {
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
    .ivu-image-img {
      border-radius: 3px;
    }
  }
  .bp-box {
    position: relative;
    display: flex;
    margin-top: 10px;
    .cover-image {
      color: #f8f8f9;
      font-size: 12px;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.8);
    }
    .bp-item {
      margin-right: 10px;
    }
    .ban {
      position: relative;
      .table-image {
        filter: grayscale(1);
      }
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
        left: -3px;
        right: -3px;
        top: 14px;
        border-top: 2px solid #ff4c4c;
        transform: rotate(-28deg);
      }
    }
  }
}
</style>
