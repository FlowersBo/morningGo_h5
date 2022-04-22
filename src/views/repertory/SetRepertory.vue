<template>
  <div class="view">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="repertory">
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>当前库存</th>
            <th>补货数</th>
            <th>报警值</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in plateData">
            <td class="name">{{item.name}}</td>
            <td>
              <div class="library">{{item.count}}</div>
            </td>
            <td><input type="number" v-model="item.number" v-on:input="numberInpChange(index)" /></td>
            <td><input type="number" v-model="item.warn" v-on:input="numberInpChange(index)" /></td>
            <td>
              <button class="btn" @click="saveFn(index,'sub')">清零</button>
              <button class="btn" @click="saveFn(index,'add')">保存</button>
            </td>
            <!-- <td><button @click="insert">insert</button></td> -->
          </tr>
          <tr>
          </tr>
        </tbody>
      </table>
      <button class="clearAwayBtn" @click="removeReportFn">清除全部库存告警</button>
    </div>
  </div>
</template>

<script>
  //这里可以导入其它文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
  //例如：import 《组件名称》from ‘《组件路径》';
  import HeaderTitle from '../../components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    //import引入的组件需要注入到对象中才能使用
    components: {
      HeaderTitle
    },
    props: {},
    data() {
      //这里存放数据
      return {
        imgUrl: require('@/img/back.png'),
        titleDec: "库存设置",
        textDec: "",
        plateData: [{
            'name': 'A区',
            'count': '',
            'number': '0',
            'warn': ''
          },
          {
            'name': 'B区',
            'count': '',
            'number': '0',
            'warn': ''
          },
          {
            'name': '签子',
            'count': '',
            'number': '0',
            'warn': ''
          },
          {
            'name': '废弃盒',
            'count': '',
            'number': '0',
            'warn': ''
          },
        ]
      }
    },
    //计算属性 类似于data概念
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      readRepertoryFn(factoryno) {
        this.$api.Getstock({
          factoryno
        }).then(res => {
          console.log('库存数据', res);
          if (res.data.code == 200) {
            let stock = res.data.data.stock;
            this.plateData[0].count = stock.astock;
            this.plateData[1].count = stock.bstock;
            this.plateData[2].count = stock.pegwood;
            this.plateData[3].count = stock.discardedbox;
            this.plateData[0].warn = stock.aStockLimit;
            this.plateData[1].warn = stock.bStockLimit;
            this.plateData[2].warn = stock.pegwoodLimit;
            this.plateData[3].warn = stock.discardedLimit;
          } else {
            this.$toast(res.data.message);
          }
        }).catch(err => {})
      },

      removeFn(index) { //库存清零
        let that = this;
        this.plateData.forEach((element, item) => {
          if (index == item) {
            Dialog.confirm({
                title: '提示',
                message: `${element.name}库存清零`,
              })
              .then(() => {
                // if(res.data.code == 200){
                //   element.count = 0;
                // }else{
                //   this.$toast(res.data.message);
                // }
              }).catch(() => {

              });
          }
        });
      },

      numberInpChange(index) { //补货数
        this.plateData.forEach((element, item) => {
          if (element.number.length == 1 || element.warn.length == 1) {
            element.number = element.number.replace(/[^1-9]/g, '0')
            element.warn = element.warn.replace(/[^1-9]/g, '0')
          } else {
            element.number = element.number.replace(/\D/g, '')
            element.warn = element.warn.replace(/\D/g, '')
          }
          if (index == item) {
            console.log(element)
          }
        });
      },

      saveFn(index, calculate) {
        this.plateData.forEach((element, item) => {
          if (index == item) {
            let that = this;
            Dialog.confirm({
                title: '提示',
                message: `${element.name}${calculate==='add'?'库存保存':'库存清零'}?`,
              })
              .then(() => {
                let num = '',
                  warnLimit = ''
                if (calculate === 'sub') {
                  num = 0 - element.count;
                  warnLimit = 0 - element.warn;
                } else {
                  num = element.number;
                  warnLimit = element.warn;
                }
                console.log('保存数据', element);
                console.log('保存数据', num, warnLimit);
                that.$api.Changestock({
                  factoryno: that.factoryno,
                  type: index + 1,
                  num,
                  warnLimit
                }).then(res => {
                  console.log('库存设置', res);
                  if (res.data.code == 200) {
                    that.$toast(res.data.message);
                  } else {
                    that.$toast(res.data.message);
                  }
                }).catch(err => {
                  console.log('保存错误', err);
                })
              }).catch(() => {

              });
          }
        });
      },
      removeReportFn() {
        Dialog.confirm({
            title: '提示',
            message: '确认要消除全部库存告警吗?',
          })
          .then(() => {
            this.$api.Pubcmd({
              factoryno: this.factoryno,
              deviceid: this.deviceid,
              command: 'stockWarning'
            }).then(res => {
              this.$toast(res.data.message);
            }).catch(err => {
              this.$toast(res.data.message);
            })
          }).catch(() => {

          });
      }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.titleDec = `${this.titleDec} (${this.$route.query.pointname})`;
      this.factoryno = this.$route.query.factoryno;
      this.deviceid = this.$route.query.deviceid

      this.readRepertoryFn(this.$route.query.factoryno);
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
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
    activated() {}
  }
</script>
<style scoped>
  @import url(../../styles/view.css);

  /* 引入css类 */
  .view {
    width: 375px;
  }

  table {
    width: 100%;
  }

  tr {
    height: 50px;
  }

  th,
  td {
    text-align: center;
    border-bottom: 1px solid #ddd;
    background-color: #f1f1f1;
  }

  .name {
    font-weight: bold;
  }

  td input {
    width: 44px;
    height: 26px;
    line-height: 26px;
    border: none;
    border-radius: 6px;
    text-align: center;
  }

  .library {
    display: inline-block;
    width: 36px;
    height: 26px;
    line-height: 26px;
    border-radius: 6px;
    border: 1px solid #FF9900;
    background-color: #fff;
    color: #FF9900;
  }

  .btn {
    width: 46px;
    height: 26px;
    border: none;
    border-radius: 6px;
    background: #FF9900;
    color: #fff;
    font-size: 10px;
  }

  .btn:first-child {
    background: #F15A24;
    margin-right: 4px;
  }

  .clearAwayBtn {
    width: 300px;
    height: 50px;
    margin-left: 37px;
    margin-top: 50px;
    background: #FF9900;
    border-radius: 12px;
    border: none;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
</style>