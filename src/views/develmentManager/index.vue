<template>
  <div class="app-container">
    <!-- 搜索 -->
     <!-- <Search  :tableName='tableName'></Search> -->
     <Button  :coverFormList='coverFormList' :childFormList='childFormList' :tableName='tableName'   @fatherMethod="fatherButtonMethod"></Button>
     <Table   ref='table' :coverFormList='coverFormList' :childFormList='childFormList'  :tableName='tableName' ></Table>
   </div>
</template>
<script>
    import Cookies from 'js-cookie'
      //引入组件
      import Button from './button';
    //   import Search from './search';
      import Table from './table';
    export default {
      name: 'ComplexTable',
      components: {
          Table,
          Button
      },
      data() {
        return{
          urlJurisdiction:[],
          currentRouterPath:'',
          tableName:'',
          coverFormList:[  
            {"modelType":"test","prop": "path","label": "菜单路径","insert":true,"update":true,"ord":2,"formType":"text"},
            {"modelType":"test","prop": "component","label": "组件","insert":true,"update":true,"ord":3,"formType":"text"},
            {"modelType":"test","prop": "redirect","label": "重定向","insert":true,"update":true,"ord":8,"formType":"text"},
            {"modelType":"test","prop": "alwaysShow","label": "显示状态","insert":true,"update":true,"ord":7,"formType":"text"},
            {"modelType":"test","prop": "label","label": "菜单名称","insert":true,"update":true,"ord":1,"formType":"text"},
            {"modelType":"test","prop": "meta.title","label": "名称映射","insert":true,"update":true,"ord":6,"formType":"text"},
            {"modelType":"test","prop": "meta.icon","label": "图标","insert":true,"update":true,"ord":6,"formType":"text"}
          ],
          childFormList:[               
            {"modelType":"test","prop": "path","label": "菜单路径","insert":true,"update":true,"ord":2,"formType":"text"},
            {"modelType":"test","prop": "component","label": "组件","insert":true,"update":true,"ord":3,"formType":"text"},
            {"modelType":"test","prop": "name","label": "组件名称","insert":true,"update":true,"ord":8,"formType":"text"},
            {"modelType":"test","prop": "label","label": "菜单名称","insert":true,"update":true,"ord":1,"formType":"text"},
            {"modelType":"test","prop": "meta.title","label": "名称映射","insert":true,"update":true,"ord":6,"formType":"text"},
            {"modelType":"test","prop": "meta.icon","label": "图标","insert":true,"update":true,"ord":6,"formType":"text"},
            {"modelType":"test","prop": "menuType","label": "模板类型","insert":true,"update":true,"ord":4,"formType":"text"},
            {"modelType":"test","prop": "tableName","label": "表名","insert":true,"update":true,"ord":5,"formType":"text"}
          ]
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
        },
        //子组件头部事件触发的函数
        fatherButtonMethod(){
            //调用子组件table的函数,刷新表格
            this.$refs.table.getTableList(); 
    
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

