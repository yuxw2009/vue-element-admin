<template>
  <div class="app-container">
    <!-- 搜索 -->
     <!-- <Search  :tableName='tableName'></Search> -->
     <!-- <Button  :tableName='tableName'></Button> -->
     <Table   :tableName='tableName'></Table>
   </div>
</template>
<script>
import Cookies from 'js-cookie'
  //引入组件
//   import Button from './button';
//   import Search from './search';
  import Table from './table';
export default {
  name: 'ComplexTable',
  components: {
      Table
   },
  data() {
    return{
      urlJurisdiction:[],
      currentRouterPath:'',
      tableName:''


    }
  },
  created() {
    //获取当前页面的path
    this.currentRouterPath = this.$route.path;
    this.getUrlJurisdiction()  
  },
  methods: {
    //获取菜单权限关系的url的表
    getUrlJurisdiction(){
      this.urlJurisdiction = JSON.parse(Cookies.get('urlJurisdiction'))
      for(var i = 0; i < this.urlJurisdiction.length; i++){
        if(this.urlJurisdiction[i].path==this.currentRouterPath ){
          this.tableName = this.urlJurisdiction[i].tableName

        }
      }
    }
  }
}
</script>
<style scoped>
    .bottom{
    margin-bottom: 10px;
    }
    .displayInline{
    display: inline-block;
    margin-right: 10px;
        vertical-align: top;
    }
    .el-range-editor .el-range-input{
    margin-left:3px;
    }
</style>

