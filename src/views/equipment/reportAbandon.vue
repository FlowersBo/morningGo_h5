<template>
  <div id="">
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="abandonWrap">
      <div class="abandon">
        <div class="abandonQuantity">
          今日总废弃量: {{abandonData.wasteSumA+abandonData.wasteSumB}}根（A:{{abandonData.wasteSumA}}
          &nbsp; &nbsp;B:{{abandonData.wasteSumB}}）
        </div>
        <div class="abandonQuantityDetail">
          <div class="orderMoney">
            <div>订单退款：</div>
            <div class="orderMoneyDetail">
              <div>未取货：{{abandonData.unTakeA+abandonData.unTakeB}}根（A:{{abandonData.unTakeA}}&nbsp;
                &nbsp;B:{{abandonData.unTakeB}}）</div>
              <div style="color: #ff9900;">已取货：{{abandonData.takeA+abandonData.takeB}}根（A:{{abandonData.takeA}}&nbsp;
                &nbsp;B:{{abandonData.takeB}}）</div>
            </div>
          </div>
          <div class="abandon-item">超时废弃：{{abandonData.oneA+abandonData.oneB}}根（A:{{abandonData.oneA}}&nbsp;
            &nbsp;B:{{abandonData.oneB}}）</div>
          <div class="abandon-item">烤制过程废弃：{{abandonData.twoA+abandonData.twoB}}根（A:{{abandonData.twoA}}&nbsp;
            &nbsp;B:{{abandonData.twoB}}）</div>
          <div class="abandon-item">营业结束废弃：{{abandonData.threeA+abandonData.threeB}}根（A:{{abandonData.threeA}}&nbsp;
            &nbsp;B:{{abandonData.threeB}}）</div>
          <div class="abandon-item">其它废弃(人工上报)：{{abandonData.fiveA+abandonData.fiveB}}根（A:{{abandonData.fiveA}}&nbsp;
            &nbsp;B:{{abandonData.fiveB}}）</div>
        </div>
      </div>
      <div class="reportView">
        <div>其他废弃上报：</div>
        <table>
          <thead>
            <tr>
              <th>商品名称</th>
              <th>废弃数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A: {{deviceStock.paname}}</td>
              <td>
                <input type="number" v-model="numberA" v-on:input="numberInpChange(numberA,0)" />
              </td>
            </tr>
            <tr>
              <td>B: {{deviceStock.pbname}}</td>
              <td>
                <input type="number" v-model="numberB" v-on:input="numberInpChange(numberB,1)" />
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:10px;">上传照片：{{fileList.length}}/2</div>
        <van-uploader class="uploader" v-model="fileList" :max-count="2" :after-read="afterRead" />
      </div>
      <div class="submitBtnWrap">
        <button class="submitBtn" @click="submitFn">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderTitle from '../../components/HeaderTitle.vue';
  import {
    Dialog
  } from 'vant';
  export default {
    data() {
      return {
        imgUrl: require('@/img/back.png'),
        titleDec: "上报废弃",
        textDec: "",
        abandonData: '',
        deviceStock: '',
        numberA: 0,
        numberB: 0,
        fileList: []
      }
    },
    components: {
      HeaderTitle
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      abandonQuantityFn(factoryno) { //预烤设置
        this.$api.SelectWaste({
          factoryno
        }).then(res => {
          if (res.data.code == '200') {
            console.log('获取废弃', res);
            this.abandonData = res.data.data;
            this.deviceStock = res.data.data.deviceStock;
          } else {
            this.$toast(res.message);
          }

        }).catch((err) => {
          console.log(err)
        })
      },
      numberInpChange(number, index) { //废弃数
        if (number.length == 1) {
          number = number.replace(/[^1-9]/g, '0')
          number = number.replace(/[^1-9]/g, '0')
        } else {
          number = number.replace(/\D/g, '')
          number = number.replace(/\D/g, '')
        }
        if (index == 0) {
          this.numberA = number
        } else {
          this.numberB = number
        }
      },

      afterRead(file) { //上传图片
        let that = this;
        console.log(file)
        // file.status = 'uploading';
        // file.message = '上传中...';
        // let img = new Image(); //创建对象，这个img就是传给compress
        // img.src = file.content
        //   let id_card = that.compress(img) //这个id_card就是压缩后的一串base64代码，目测3M图片压缩后800kb
        let formData = new FormData();
        file.file.factoryNo = this.factoryno;
        formData.append("files", file.file);
        console.log(formData.get('files'));
        this.$api.WasteSave({
            formData
          })
          .then(result => {
            console.log(result)
          })
        file.status = 'done';
      },


      compress(img) { //压缩图片
        let url = ''
        var w = Math.min(700, img.width); //当图片像素>700的时候，等比例压缩，这个数字可以调
        var h = img.height * (w / img.width);
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        canvas.width = w
        canvas.height = h
        ctx.drawImage(img, 0, 0, w, h)
        url = canvas.toDataURL('image/png', 1) //1代表精细度，越高越好
        return url
      },






      submitFn() { //提交
        if (this.fileList.length <= 0) {
          this.$toast('请添加废弃实拍照片！');
          return;
        }
        this.$api.WasteSave({
          factoryNo: this.factoryno
        }).then(res => {
          console.log('上传成功过', res)
        }).catch(err => {
          this.$toast(err.message);
        })
      },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {
      this.factoryno = this.$route.query.factoryno;
      this.abandonQuantityFn(this.$route.query.factoryno);
    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
      // console.log(this.$route.params.phoneNumber);//获取上一页路由传参
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
<style scoped lang="less">
  .abandonWrap {
    width: 360px;
    margin: 0 auto;
  }

  .abandon {
    width: 100%;
    background: #f1f1f1;
    border-radius: 10px;
    margin-top: 50px;
    box-sizing: border-box;
    padding: 10px;
  }

  .abandonQuantity {
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 6px;
    border-bottom: 2px solid #ddd;
    color: #ff9900;
  }

  .abandonQuantityDetail {
    box-sizing: border-box;
    padding: 0 6px;
  }

  .orderMoney {
    display: flex;
    margin: 6px 0;
  }

  .abandon-item {
    margin: 6px 0;
  }

  .reportView {
    width: 100%;
    background: #f1f1f1;
    border-radius: 10px;
    margin-top: 10px;
    box-sizing: border-box;
    padding: 10px;
  }

  table {
    width: 100%;
  }

  tr {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
  }

  th,
  td {
    flex: 1;
    text-align: center;
  }

  td input {
    width: 56px;
    height: 32px;
    line-height: 32px;
    border: none;
    border-radius: 6px;
    text-align: center;
  }

  .uploader {
    margin-top: 10px;
  }

  .submitBtnWrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .submitBtn {
    width: 300px;
    height: 40px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    line-height: 40px;
    background: #F15A24;
    border-radius: 10px;
    border: none;
    margin: 30px 0;
  }
</style>