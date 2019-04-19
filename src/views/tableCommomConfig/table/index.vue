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
    <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column  align='center' v-for="(col,index) in cols" :key='index'   :prop="col.prop" :label="col.label" ></el-table-column>
    </el-table>
     <el-pagination v-show="listQuery.total>0" :total="listQuery.total"  :page-sizes="[10, 20, 30, 40,50]"  layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.curpage" :limit.sync="listQuery.page_num" 
       @size-change="handleSizeChange"  @current-change="handleCurrentChange"></el-pagination>  
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
        listLoading: true,
        //table数据
       tableDataList:[],
        //这个是table的每列对应的title
       cols: [],
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
    this.getUrlJurisdin()
    this.getTableTitle()

  },
  mounted(){
    var  _this = this;
    //调用tableFun
          bus.$on("tableFun", function(msg,curpage) {
             _this.submitFormData = msg;
              if(curpage){
                _this.getTableList(_this.tableListParams,curpage)    
              }else{
                _this.getTableList(_this.tableListParams,curpage)    

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
              getCommonFun(JSON.stringify(this.columnParams)).then(res=>{
                    if(res.data.result=='ok'){
                      this.cols = res.data.data 
                      this.getTableList(this.tableListParams)
                  }
              }) 
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

</style>
