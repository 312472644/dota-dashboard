<template>
  <div class="player-category">
    <page-loading :show="loading" />
    <div v-if="!loading" class="player-content">
      <div class="card-item">
        <div class="card-title">所有比赛</div>
        <div class="card-content">
          <div class="row">
            <div class="card-content-item">
              <div class="text">击杀</div>
              <div class="value">{{ totalList?.[0]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">死亡</div>
              <div class="value">{{ totalList?.[1]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">助攻</div>
              <div class="value">{{ totalList?.[2]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">正补</div>
              <div class="value">{{ totalList?.[6]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">反补</div>
              <div class="value">{{ totalList?.[7]?.sum || '-' }}</div>
            </div>
          </div>
          <div class="row">
            <div class="card-content-item">
              <div class="text">等级</div>
              <div class="value">{{ totalList?.[10]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">英雄伤害</div>
              <div class="value">{{ totalList?.[11]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">防御塔伤害</div>
              <div class="value">{{ totalList?.[12]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">英雄治疗</div>
              <div class="value">{{ totalList?.[13]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">时长</div>
              <div class="value">{{ totalList?.[9]?.sum || '-' }}s</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-item">
        <div class="card-title">已分析的比赛</div>
        <div class="card-content">
          <div class="row">
            <div class="card-content-item">
              <div class="text">控制时间</div>
              <div class="value">{{ totalList?.[14]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">摧毁防御塔</div>
              <div class="value">{{ totalList?.[15]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">击杀野怪</div>
              <div class="value">{{ totalList?.[16]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">击杀信使</div>
              <div class="value">{{ totalList?.[17]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">购买TP</div>
              <div class="value">{{ totalList?.[18]?.sum || '-' }}</div>
            </div>
          </div>
          <div class="row">
            <div class="card-content-item">
              <div class="text">购买假眼</div>
              <div class="value">{{ totalList?.[19]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">购买真眼</div>
              <div class="value">{{ totalList?.[20]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">购买宝石</div>
              <div class="value">{{ totalList?.[21]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">购买圣剑</div>
              <div class="value">{{ totalList?.[22]?.sum || '-' }}</div>
            </div>
            <div class="card-content-item">
              <div class="text">小地图信号</div>
              <div class="value">{{ totalList?.[23]?.sum || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { getTotalsAPI } from '../api';
import { toThousands } from '@/utils';

const totalList = ref([]);
const loading = ref(false);
const getTotals = async accountId => {
  if (totalList.value.length > 0) {
    return;
  }
  loading.value = true;
  const response = await getTotalsAPI(accountId);
  const dataList = (response.data || []).map(item => {
    return {
      ...item,
      sum: toThousands(parseInt(item.sum))
    };
  });
  totalList.value.push(...dataList);
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

defineExpose({
  getTotals
});
</script>
<style lang="scss">
.player-category {
  min-height: 50px;
  .card-item {
    margin-bottom: 10px;
    .card-title {
      font-size: 14px;
      padding-bottom: 10px;
    }
    .card-content {
      .row {
        display: flex;
        margin-bottom: 10px;
      }
      .card-content-item {
        flex: 1;
        border: 1px solid #ebedf2;
        border-radius: 3px;
        &:not(:nth-of-type(5n)) {
          margin-right: 10px;
        }
        .text {
          padding: 5px 10px;
          color: #fff;
          font-size: 15px;
          text-align: center;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(-45deg, #485563 0%, #29323c 100%);
        }
        .value {
          color: #515a6e;
          padding: 12px;
          text-align: center;
        }
      }
    }
  }
}
</style>
