<template>
  <div class="home">
    <!-- <input type="text" v-model="name" /> -->
    <HelloWorld msg="报表" />
    <!-- <el-button type="primary" icon="el-icon-search">搜索</el-button> -->
    <!-- <router-link to="/about">About</router-link> -->
  </div>
</template>

<script>
  import HelloWorld from '@/components/HelloWorld.vue'
  export default {
    data() {
      return {
        name: '名称'
      }
    },
    components: {
      HelloWorld
    }
  }
</script>