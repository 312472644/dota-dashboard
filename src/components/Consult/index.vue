<template>
  <div class="consult-box">
    <ul>
      <!--小程序-->
      <li class="consult-item">
        <Poptip trigger="hover" placement="left">
          <template #content>
            <div class="wx-code-box">
              <img class="wx-code" src="../../assets/images/wx_bar_code.jpg" />
            </div>
          </template>
          <div class="icon">
            <img src="../../assets/icons/icon-wechat.svg" />
          </div>
        </Poptip>
      </li>
      <li class="consult-item">
        <Poptip trigger="hover" placement="left">
          <template #content>
            <span>联系：</span>
            <span class="link">312472644@qq.com</span>
          </template>
          <div class="icon">
            <Icon type="ios-call" size="30" color="#838da9" />
          </div>
        </Poptip>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.consult-box {
  position: fixed;
  right: 30px;
  bottom: 120px;
  .wx-code-box {
    text-align: center;
    .wx-code {
      width: 150px;
      height: 150px;
    }
  }
  .link {
    color: #2d8cf0;
    cursor: pointer;
  }

  .consult-item {
    text-align: center;
    cursor: pointer;
    .icon {
      display: inline-block;
      img {
        width: 30px;
        height: 30px;
      }
    }
    .icon-text {
      color: #525a6c;
      font-size: 12px;
    }
  }
}
</style>
