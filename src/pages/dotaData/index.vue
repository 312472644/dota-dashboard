<template>
  <div class="dota-data-box">
    <team-top class="card" />
    <rank-top class="card" />
    <hero-top class="card" />
    <hot-match class="card" />
  </div>
</template>
<script setup>
import teamTop from './components/teamTop.vue';
import hotMatch from './components/hotMatch.vue';
import rankTop from './components/rankTop.vue';
import heroTop from './components/heroTop.vue';
</script>
<style lang="scss">
.dota-data-box {
  .card {
    margin-bottom: 15px;
    .ivu-card-head {
      span {
        color: #515a6e;
      }
    }
    .href {
      color: #2d8cf0 !important;
      cursor: pointer;
    }
    .ivu-card-body {
      min-height: 70px;
    }
    .sub-title {
      color: #808695;
      font-size: 12px;
      padding-bottom: 8px;
    }
    .href {
      color: #808695;
      cursor: pointer;
    }
    .rank-item {
      padding: 10px 0;
      &:nth-of-type(1) .rank-no {
        color: #fff;
        background-image: linear-gradient(-39deg, #ffd500 0%, #fa0 99%);
      }
      &:nth-of-type(2) .rank-no {
        color: #fff;
        background-image: linear-gradient(135deg, #8993a6 0%, #aab3c3 100%);
      }
      &:nth-of-type(3) .rank-no {
        color: #fff;
        background-image: linear-gradient(149deg, #ff9a57 0%, #ffbb80 100%);
      }
    }
    .rank-no {
      color: initial;
      font-size: 12px;
      font-style: italic;
      margin: 0 auto 0;
      height: 18px;
      line-height: 18px;
      text-align: center;
      width: 40px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 0 1px 0 #ebedf2, 0 2px 4px 0 rgb(2 5 13 / 8%);
    }
    .name {
      margin-top: 4px;
      font-size: 13px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
