<template>
  <div class="header">
    <!-- 返回箭头 -->
    <div class="header_arrow" @click="getBack">
      <slot name="header_arrow">
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-fanhui" />
        </svg> -->
        <img :src="imgSrc" alt="" />
      </slot>
    </div>
    <!-- 中间标题 -->
    <div class="header_title">
      <slot name="header_title">
        <span>{{ title }}</span>
      </slot>
    </div>
    <!-- 文字与图标 -->
    <div class="header_icon" @click="gotoHome">
      <slot name="header_icon">
        <span>{{ text }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Header",
    props: {
      title: {
        type: String,
      },
      imgSrc: {
        type: String,
      },
      text: {
        type: String,
      },
    },
    methods: {
      // 返回上一页
      getBack() {
        // this.$router.back(-1);
        this.$router.go(-1);
        // window.history.back();
        // this.$router.back();
      },
      // 跳转修改密码
      gotoHome() {
        // this.$router.push({path: '/Home'});
        // 命名的路由
        this.$router.push({
          name: 'Home',
          params: {
            userId: 123
          }
        })
      }
    },
  };
</script>
<style lang="less">
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #F15A24;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .header .header_title {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #fff;
    font-weight: 700;
    margin-right: -20%;
  }

  .header_title span {
     width: 300px;
     text-align: center;
    display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /* 溢出用省略号*/
    -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
  }

  .header_arrow {
    position: absolute;
    left: 4px;
    width: 50px;
  }

  .header_arrow img {
    width: 34px;
    vertical-align: middle;
  }

  .header_icon {
    width: 20%;
    font-size: 14px;
    color: #11ebfb;
  }
</style>