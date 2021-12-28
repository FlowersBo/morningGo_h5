<template>
  <div class="tabbar">
    <van-tabbar v-model="tabbarTempValue" :placeholder="true" active-color="#F15A24" inactive-color="hotpink"
      @change="onChange">

      <van-tabbar-item :badge="badgeNumber?badgeNumber:assBadgeNumber" class="tabbar">
        <van-icon class="iconfont" class-prefix='icon' slot="icon" slot-scope="props"
          :name="props.active ? 'alarm':'alarm'"></van-icon>
        <span>告警</span>
      </van-tabbar-item>

      <van-tabbar-item badge="" class="tabbar">
        <van-icon class="iconfont" class-prefix='icon' slot="icon" slot-scope="props"
          :name="props.active ? 'kucunpandian':'kucunpandian'"></van-icon>
        <span>库存</span>
      </van-tabbar-item>

      <van-tabbar-item class="tabbar">
        <van-icon class="iconfont" class-prefix='icon' slot="icon" slot-scope="props"
          :name="props.active ? 'yuyuedingdan':'yuyuedingdan'"></van-icon>
        <span>预烤</span>
      </van-tabbar-item>
      <van-tabbar-item badge="" class="tabbar">
        <van-icon class="iconfont" class-prefix='icon' slot="icon" slot-scope="props"
          :name="props.active ? 'shebeiguanli':'shebeiguanli'"></van-icon>
        <span>设备</span>
      </van-tabbar-item>
      <van-tabbar-item class="tabbar">
        <van-icon class="iconfont" class-prefix='icon' slot="icon" slot-scope="props"
          :name="props.active ? 'wode':'wode'"></van-icon>
        <span>我的</span>
      </van-tabbar-item>

    </van-tabbar>
  </div>
</template>

<script>
  export default {
    props: {
      active: Number,
      badgeNumber: Number
    },
    data() {
      return {
        tabbarTempValue: this.active,
        assBadgeNumber: null
      }
    },
    methods: {
      onChange(index) {
        const routerArray = [
          "/Home",
          "/Repertory",
          "/Prebake",
          "/Equipment",
          "/Mine"
        ];
        this.$router.push(routerArray[index]);
      },
      updateBadgeNumber() {
        // setTimeout(() => {
        this.assBadgeNumber = JSON.parse(sessionStorage.getItem('badgeNumber'))
        // }, 500)
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updateBadgeNumber()
      });
    },
    watch: {
      badgeNumber(val, newval) {
        console.log(val)
        console.log(newval)
      }
    },
    //生命周期-更新之后
    updated() {

    },
  }
</script>

<style>
  .iconfont {
    font-size: 22px;
  }

  .header_arrow {
    width: 40px;
    display: flex;
    justify-content: center;
  }
</style>