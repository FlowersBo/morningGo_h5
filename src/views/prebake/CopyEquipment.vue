<template>
  <div>
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <div class="facility">
      <div>设备编号：{{ deviceno }}</div>
      <div>点位名称：{{ pointname }}</div>
    </div>
    <form report-submit @submit.prevent="submitFn">
      <div class="condition">
        <div>
          <div class="condition-item">
            <div>城市：</div>
            <div class="city" @click="isShowBirth = true" name="city">
              {{ city ? city : "选择城市" }}
            </div>
            <van-popup v-model="isShowBirth" position="bottom" round>
              <van-picker
                :columns="columns"
                show-toolbar
                v-model="isShowBirth"
                title="城市"
                @cancel="isShowBirth = false"
                @confirm="confirmdateFn"
              />
            </van-popup>
          </div>
          <div class="condition-item">
            <div>点位名称：</div>
            <input type="text" name="pt" />
          </div>
          <div class="condition-item">
            <div>合作商：</div>
            <input type="text" name="partner" />
          </div>
        </div>
        <button class="btn" formType="submitFn">查找</button>
      </div>
    </form>

    <!-- 表格 -->
    <vxe-table
      border
      ref="xTable1"
      :data="tableData"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
    >
      <vxe-column class="checkboxType" type="checkbox" width="60"></vxe-column>
      <vxe-column field="code" title="设备编号"></vxe-column>
      <vxe-column field="address" title="点位名称" show-overflow></vxe-column>
    </vxe-table>

    <div class="saveWrap">
      <button class="btn save" @click="saveFn">保存策略</button>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
import VXETable from "vxe-table";
export default {
  components: { HeaderTitle },
  props: {},
  data() {
    return {
      imgUrl: require("@/img/back.png"),
      titleDec: "复制策略",
      textDec: "",
      deviceno: "1111111111111111",
      pointname: "乱七八糟点位",
      isShowBirth: false,
      city: "",
      columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华"],
      tableData: [
        { id: 10001, code: "1161616", address: "温榆河公园犄角旮旯" },
        { id: 10002, code: "1223434", address: "温榆河公园犄角旮旯" },
        { id: 10003, code: "24e3243", address: "温榆河公园犄角旮旯" },
        { id: 10004, code: "3434324", address: "温榆河公园犄角旮旯" },
        { id: 10005, code: "3432423", address: "温榆河公园犄角旮旯" },
      ],
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data中数据变化
  watch: {},
  //方法集合
  methods: {
    confirmdateFn(val) {
      this.isShowBirth = false;
      console.log(val);
      this.city = val;
    },
    submitFn(e) {
      console.log(e.target.pt.value, e.target.partner.value);
    },

    // 表格
    selectAllEvent({ checked }) {
      const records = this.$refs.xTable1.getCheckboxRecords();
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
      this.records = records;
    },
    selectChangeEvent({ checked }) {
      const records = this.$refs.xTable1.getCheckboxRecords();
      console.log(checked ? "勾选事件" : "取消事件", records);
      this.records = records;
    },
    // 保存策略
    saveFn() {},
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
.facility {
  background-color: #f1f1f1;
  box-sizing: border-box;
  padding: 10px;
}

.facility div:last-child {
  margin-top: 10px;
}
.condition {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background: #f1f1f1;
  margin-top: 10px;
  font-size: 12px;
}
.condition-item {
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}
.condition-item input,
.city {
  width: 130px;
  height: 28px;
  border: 1px solid #ddd;
  background: #fff;
  padding-left: 8px;
  line-height: 28px;
  font-size: 12px;
  border-radius: 4px;
}
.btn {
  width: 80px;
  height: 30px;
  background: #ff9900;
  color: #fff;
  text-align: center;
  line-height: 30px;
  border-radius: 4px;
  border: none;
  font-size: 12px;
}
.saveWrap{
  margin: 20px 0;
  display: flex;
  justify-content: center;
}
.save {
  width: 160px;
  height: 36px;
  font-size: 14px;

}

.vxe-table {
  margin-top: 30px;
}
</style>
<style>
.vxe-cell {
  text-align: center;
}
thead {
  background: #f15a24;
  color: #fff;
}

.vxe-checkbox--icon:before {
  border: 1px solid #409eff !important;
}
</style>