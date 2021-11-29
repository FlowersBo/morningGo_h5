<template>
  <div class="loadingWrap">
    <van-loading class="loading" type="spinner" color="#fff" text-color="#fff" vertical size="24px">加载中...</van-loading>
  </div>
</template>

<script>
  export default {
    props: {
      isLoading: {
        type: Boolean,
      }
    },
    data() {
      return {};
    },
    computed: {},
    created() {},
    mounted() {},
  };
</script>

<style scoped>
  .loadingWrap{
    position: fixed;
    top:0;
    left:0;
    z-index:121;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .loading{
    margin:7.5rem auto;
  }

</style>