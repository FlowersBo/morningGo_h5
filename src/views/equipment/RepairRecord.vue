<template>
  <div>
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <table>
      <thead>
        <tr>
          <th>操作人</th>
          <th>时间</th>
          <th>商品名称</th>
          <th>补货数</th>
        </tr>
      </thead>
      <tbody>
        <van-list
          v-model="loading"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          :finished="finished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <van-cell v-for="item in recordList" :key="item.id">
            <tr>
              <td>{{ item.productName }}</td>
              <td>{{ item.createDate }}</td>
              <td>{{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
            </tr>
          </van-cell>
        </van-list>
      </tbody>
    </table>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
export default {
  components: {
    HeaderTitle,
  },
  props: {},
  data() {
    //这里存放数据
    return {
      titleDec: "补货记录",
      textDec: "",
      imgUrl: require("@/img/back.png"),
      recordList: [],
      pageindex: 1,
      pagesize: 100,
      loading: false,
      finished: false, //是否已加载完成，加载完成后不再触发load事件
      error: false, //是否加载失败，加载失败后点击错误提示可以重新触发load事件
      isShow: true,
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: {
    suppleList(deviceId) {
      this.$api
        .SuppleList({
          pageindex: this.pageindex,
          pagesize: this.pagesize,
          deviceId,
        })
        .then((res) => {
          if (res.data.code == "200") {
            console.log("获取补货记录", res);
            this.total = res.data.data.total;
            this.recordList.push(...res.data.data.data);
          } else {
            this.$toast(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onLoad() {
      // 数据全部加载完成
      if (this.isShow || this.recordList.length >= this.total) {
        console.log("加载完成");
        this.finished = true;
        return true;
      } else {
        console.log("加载未完成");
        this.pageindex++;
        this.DevicelistFn();
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.deviceid = this.$route.query.deviceid;
    this.suppleList(this.$route.query.deviceid);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //生命周期-创建之前
  beforeCreated() {},
  //生命周期-挂载之前
  beforeMount() {},
  //生命周期-更新之前
  beforUpdate() {},
  //生命周期-更新之后
  updated() {},
  //生命周期-销毁之前
  beforeDestory() {},
  //生命周期-销毁完成
  destoryed() {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
table {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}

tr {
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  background-color: #f1f1f1;
  align-items: center;
  box-sizing: border-box;
  padding: 0 4px;
}

th,
td {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

th:first-child,
td:first-child,
th:last-child,
td:last-child {
  flex: 0.5;
}
</style>
<style lang="less">
.van-cell {
  width: 375px;
  padding: 0;
}
</style>