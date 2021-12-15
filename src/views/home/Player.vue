<template>
  <div>
    <HeaderTitle :imgSrc="imgUrl" :title="titleDec" :text="textDec"></HeaderTitle>
    <div class="test_two_box">
      <video-player id="myVideo" class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
        :options="playerOptions">
      </video-player>
    </div>
  </div>
</template>

<script>
  import HeaderTitle from '/src/components/HeaderTitle.vue';
  export default {
    data() {
      return {
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            src: '', // 路径
            type: 'video/mp4' // 类型
          }, {
            src: '',
            type: 'video/webm'
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true //全屏按钮
          }
        },
        imgUrl: require('@/img/back.png'),
        titleDec: "告警视频",
        textDec: "",
        timer: null
      }
    },
    created() {
      this.alarmId = this.$route.query.alarmId;
      this.factoryno = this.$route.query.factoryno;
      this.getVideo(this.$route.query.alarmId, this.$route.query.factoryno);
    },
    mounted() {},
    components: {
      HeaderTitle
    },
    computed: {},
    //监控data中数据变化
    watch: {},
    //方法集合
    methods: {
      getVideo(alarmId, factoryno) {
        let data = {
          alarmId,
          factoryno
        }
        this.$api.Getvideo(data).then(res => {
            if (res.data.code === 1001) {
              this.timer = setTimeout(() => {
                this.getVideo(this.alarmId, this.factoryno);
              }, 3000);
            } else if (res.data.code == 200) {
              console.log('视频',res)
              this.playerOptions.sources[0].src = res.data.data.video;
              // this.playerOptions.sources[0].src = 'https://media.w3.org/2010/05/sintel/trailer.mp4'
            }
          })
          .catch(err => {
            console.log(err)
          })
        this.$nextTick(() => {

        });
      },
    },
    beforeDestroy() {
      clearTimeout(this.timer);
      this.timer = null;
    }

  };
</script>
<style>
  .test_two_box {
    margin-top: 45px;
  }

  .video-js .vjs-big-play-button {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -45px;
    margin-top: -25px;
  }
</style>