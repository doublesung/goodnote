<template>
  <div class="d-flex h-100">
    <Sidebar/>
    <router-view></router-view>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style lang='scss'>
  @import './assets/customize.scss';

  html, body, #app {
    height: 100%;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  li {
    list-style-type: none;
  }

  i {
    vertical-align: -10%;
  }

  textarea { 
    resize : none; 

     &:focus {
      outline: none;
    }
  }

  .pointer {
    cursor: pointer;
  }
</style>
