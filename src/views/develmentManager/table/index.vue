<template> 
  <div>
      <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableDataList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
     @selection-change="changeChecked"
     >  
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column type="expand" label=" " width="60">
        <template slot-scope="props">
          <el-row class="filter-container" style="margin-bottom: 20px" >
            <el-col   class="demo-table-expand" >
              <el-table ref="crudTable" v-loading="listLoading" :data="props.row.children" size="mini" border  label-position="left"  inline>
                <!-- <el-table-column type="expand" label=" " width="60"></el-table-column> -->
                    <el-table-column  align='center'  v-for="(col,index) in cols" :key='index'   height='50px'  :prop="col.prop" :label="col.label" >               
                      </el-table-column>     
              </el-table>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
        <el-table-column  align='center' v-for="(col,index) in cols" :key='index'  height='30px'  :prop="col.prop" :label="col.label" ></el-table-column>
         <el-pagination v-show="listQuery.total>0" :total="listQuery.total"  :page-sizes="[10, 20, 30, 40,50]"  layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.curpage" :limit.sync="listQuery.page_num" 
      @size-change="handleSizeChange"  @current-change="handleCurrentChange"></el-pagination>  
    </el-table>

   
  </div>  
  
</template>

<script>
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
import bus from '@/main.js'
export default {
  props:['tableName'],
  data(){
    return{
        columnParams:{"table":"columnConf","attrs":{"modelType":''}},
        tableListParams:{"table":"","attrs":{}},
        tableKey: 0,
        listLoading: false,
        //table数据
        tableDataList:[
        {
            "_id": "5cb9801b763f4eb14ac26261",
            "path": "/systemManager",
            "component": "Layout",
            "redirect": "/permission/index",
            "alwaysShow": true,
            "label": "系统配置",
            "meta": {
                "title": "SystemConfig",
                "icon": "lock"
            },
            "children": [
                {
                    "path": "/systemManager/accountManage",
                    "name": "AccountManage",
                    "component": "/views/accountManage/index",
                    "label": "账户信息",
                    "meta": {
                        "title": "accountManage",
                        "icon": "form"
                    },
                    "menuType": "native"
                },
                {
                    "path": "/systemManager/tableCommomConfig",
                    "name": "tableCommomConfig",
                    "component": "/views/tableCommomConfig/index",
                    "label": "通用配置",
                    "meta": {
                        "title": "tableCommomConfig",
                        "icon": "form"
                    },
                    "menuType": "mongo",
                    "tableName": "test"
                }
            ]
        },
        {
            "_id": "5cb9802d763f4eb14ac26262",
            "path": "/platformMaintenance",
            "component": "Layout",
            "redirect": "/permission/index",
            "alwaysShow": 'true',
            "label": "平台维护",
            "meta": {
                "title": "develmentManager",
                "icon": "guide"
            },
            "children": [
                {
                    "path": "/platformMaintenance/develmentManager",
                    "name": "develmentManager",
                    "component": "/views/develmentManager/index",
                    "label": "元数据管理",
                    "meta": {
                        "title": "develmentManager",
                        "icon": "guide"
                    },
                    "menuType": "mongo",
                    "tableName": "test"
                }
            ]
        },
        {
            "_id": "5cb98036763f4eb14ac26263",
            "path": "/customerManager",
            "component": "Layout",
            "redirect": "/permission/index",
            "alwaysShow": true,
            "label": "客户信息",
            "meta": {
                "title": "customerInfo",
                "icon": "lock"
            },
            "children": [
                {
                    "path": "/customerManager/equipmentManage",
                    "name": "equipmentManage",
                    "component": "/views/equipmentManage/index",
                    "label": "设备信息",
                    "meta": {
                        "title": "equipmentManage",
                        "icon": "guide"
                    },
                    "menuType": "native"
                }
            ]
        }
       ],
        cols:  [
              {"modelType":"test",prop: 'label', label: '菜单名称'},
              {"modelType":"test",prop: 'path', label: '菜单路径'},
               {"modelType":"test",prop: 'component', label: '组件'},
               {"modelType":"test",prop: 'menuType', label: '模板类型'},
               {"modelType":"test",prop: 'tableName', label: '表名'},
              {"modelType":"test",prop: 'meta.icon', label: '图标'},
              {"modelType":"test",prop: 'alwaysShow', label: '显示状态'},
       ],  
        listQuery: {
          curpage: 1,
          page_num: 10,
          total:0,     
      },
      submitFormData:{

      }

    }
  },
  created(){
    // this.getUrlJurisdin()
    // this.getTableTitle()

  },
  mounted(){
    var  _this = this;
    //调用tableFun
          bus.$on("tableFun", function(msg,curpage) {
             _this.submitFormData = msg;
              if(curpage){
                // _this.getTableList(_this.tableListParams,curpage)    
              }else{
                // _this.getTableList(_this.tableListParams,curpage)    

              }

           
    });
  },
  methods:{
      //匹配url
      getUrlJurisdin(){
        this.columnParams.attrs.modelType= this.tableName
        this.tableListParams.table= this.tableName

      },
        //获取table列的title
        getTableTitle(){   
          
             
        },
       
      //获取table的列表
      getTableList(data,curpage){
        let objNew = JSON.stringify(data);
          let obj = JSON.parse(objNew);
          obj.attrs = this.submitFormData
          obj.curpage = curpage || this.listQuery.curpage
          obj.page_num = this.listQuery.page_num
          var  jsonData = {
              }
          for(var index in obj.attrs){//遍历json对象的每个key/value对,p为key   
                if(obj.attrs[index]){
                    jsonData[index] = obj.attrs[index]
                }

            }
            obj.attrs = jsonData
            getCommonFun(JSON.stringify(obj)).then(res=>{               
                      if(res.data.result=='ok'){
                          this.tableDataList = res.data.data
                          this.listQuery.total =res.data.count
                          this.listLoading = false
                      }
                }) 
      },
     //table复选框改变事件
      changeChecked(val){
             bus.$emit("checkeFun", val);
      },
        //分页中每行显示的多少数据的事件
        handleSizeChange(val) {
            this.listQuery.page_num = val;
            this.getTableList(this.tableListParams)
        },
         //分页点击到当前所在页的事件
         handleCurrentChange(val) {
            this.listQuery.curpage = val
            this.getTableList(this.tableListParams)
         }   
  }

}
</script>

<style scoped>

.has-gutter{
  background-color: #babbbd;
  font-size: 16px;
}
.el-table__expanded-cell:hover {
    background-color: #f5f7fa!important;
}

</style>
