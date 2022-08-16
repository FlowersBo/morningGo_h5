<template>
  <div>
    <HeaderTitle
      :imgSrc="imgUrl"
      :title="titleDec"
      :text="textDec"
    ></HeaderTitle>
    <div class="facility">
      <div>设备编号：{{ factoryNo }}</div>
      <div>点位名称：{{ pointName }}</div>
    </div>
    <form report-submit @submit.prevent="submitFn">
      <div class="condition">
        <div>
          <div class="condition-item">
            <div>城市：</div>
            <div class="city" @click="isShowBirth = true" name="cities">
              {{ city ? city : "选择城市" }}
            </div>
            <van-popup v-model="isShowBirth" position="bottom" round>
              <van-picker
                :columns="cities"
                value-key="name"
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
      <vxe-column field="factoryNo" title="设备编号"></vxe-column>
      <vxe-column field="pointName" title="点位名称" show-overflow></vxe-column>
    </vxe-table>
    <div class="saveWrap">
      <span class="upload" @click="bindUpload" v-if="tableData.length > 0">{{
        pages > pageindex ? "加载更多" : "加载完成"
      }}</span>
      <button class="btn save" @click="saveFn">保存策略</button>
    </div>
  </div>
</template>

<script>
import HeaderTitle from "../../components/HeaderTitle.vue";
import VXETable from "vxe-table";
import { Dialog } from "vant";
export default {
  components: { HeaderTitle },
  props: {},
  data() {
    return {
      imgUrl: require("@/img/back.png"),
      titleDec: "复制策略",
      textDec: "",
      factoryNo: "",
      pointName: "",
      isShowBirth: false,
      city: "",
      cities: [],
      tableData: [],
      records: [],
      pageindex: 1,
      pagesize: 10,
      regionId: "",
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
      this.city = val.name;
      this.regionId = val.id;
    },
    // 查询表格
    submitFn(e) {
      console.log(e.target.pt.value, e.target.partner.value);
      this.partner = e.target.partner.value;
      this.pt = e.target.pt.value;
      this.tableData = [];
      this.pageindex = 1;
      this.PointsFn();
    },

    bindUpload() {
      if (this.pages > this.pageindex) {
        this.pageindex += 1;
      } else {
        this.$toast("加载完成");
        return;
      }
      this.PointsFn();
    },

    PointsFn() {
      this.$api
        .Points({
          regionId: this.regionId,
          agencyName: this.partner,
          pointName: this.pt,
          pageindex: this.pageindex,
          pagesize: this.pagesize,
        })
        .then((res) => {
          console.log("设备列表", res);
          this.tableData = this.tableData.concat(res.data.data.list.list);
          this.pages = res.data.data.list.pages;
        });
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
    saveFn() {
      Dialog.confirm({
        title: "提示",
        message: "确定复制该策略吗？",
      }).then(() => {
        let dates;
        if (this.selectDate && this.selectDate.length > 0) {
          dates = this.selectDate;
        }
        let records = this.records;
        let devicesIds = [];
        if (records.length <= 0) {
          this.$toast("请先勾选设备");
          return;
        }
        records.forEach((element) => {
          devicesIds.push(element.id);
        });
        this.$api
          .CopyStrategy({
            deviceId: this.deviceId,
            dates,
            devicesIds,
          })
          .then((res) => {
            console.log("保存策略", res);
            if (res.data.code === 200) {
              this.$toast(res.data.message);
            } else {
              this.$toast(res.data.message);
            }
          })
          .catch((err) => {
            this.$toast(res.data.message);
          });
      });
    },

    // 城市列表
    cityListFn() {
      this.$api.Cities({}).then((res) => {
        console.log("城市", res);
        this.cities = res.data.data.cities;
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.deviceId = this.$route.query.deviceId;
    this.selectDate = this.$route.query.selectDate;
    this.factoryNo = this.$route.query.factoryNo;
    this.pointName = this.$route.query.pointName;
    this.cityListFn();
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
.saveWrap {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.save {
  margin-top: 20px;
  width: 160px;
  height: 36px;
  font-size: 14px;
}
.upload {
  font-size: 12px;
  margin-top: 2px;
  color: rgb(97, 97, 97);
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