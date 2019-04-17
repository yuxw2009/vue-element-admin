<template>
  <div class="app-container">
    <div class="filter-container" >
        <div  v-for='(item,index) in formTypeData' :key='index' class='displayInline'>
             <el-select v-model="submitFormData[item.key]"  v-if="item.formType=='select'"  :placeholder="item.placeholder" clearable style="width: 90px" class="filter-item">
                <el-option v-for="(selectItem,selectIndex) in item.defaultValues"   :key="selectIndex" :label="selectItem.value" :value="selectItem.key" />
            </el-select>
            <el-date-picker  v-else-if="item.formType=='time'" 
                v-model="submitFormData[item.key]"
                type="daterange"
                align="left"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
              <el-input  v-else   v-model="submitFormData[item.key]"  :placeholder="item.placeholder"  style="width: 200px;" class="filter-item"/>
        </div> 
        <el-button  size='small' v-waves   class="filter-item" type="primary" icon="el-icon-search"  @click='searchTableFun()'>{{ $t('table.search') }}</el-button>
    </div>
    <div class='bottom'>  
      <el-button size='mini' v-for='(item,index) in commomButtonData'   :key='index' 
      class="filter-item" style="margin-left: 10px;" :type="item.colorType" :ord='item.ord'   @click='opneCover(item.clickType,item.name)' >{{item.name}}</el-button> 
    </div>
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
    <!--table分页 -->
    <el-pagination v-show="listQuery.total>0" :total="listQuery.total"  :page-sizes="[2,10, 20, 30, 40,50]"  layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.curpage" :limit.sync="listQuery.page_num" 
       @size-change="handleSizeChange"  @current-change="handleCurrentChange"></el-pagination>
        
    <!-- 操作的弹出层 -->
    
       <el-dialog :title="dialogTitle" :visible.sync="setAddVisible">
        <el-form  label-width="80px">
          <div v-for='(item,index) in coverFormList'  :key='index'>
            <el-form-item   v-if="item.formType=='text'"    :label="item.label">
              <el-input v-model="dialogSuccessData[item.prop]" size="small" />
            </el-form-item>  
             <el-form-item   v-if="item.formType=='select'"    :label="item.label">

              <el-select v-model="dialogSuccessData[item.prop]" size="small">

                <el-option v-for="(selectItem,selectIndex) in item.defaultValues"   :key="selectIndex" :label="selectItem.value" :value="selectItem.key" />

              </el-select>
            </el-form-item>  
              
          </div>
          <el-form-item>
            <!-- <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button> -->
            <el-button type="primary" size="small" @click="dialogSubmit()">确认</el-button>
            <el-button size="small" @click="dialogCancel()">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  
  
  </div>
</template>
<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
        searchParams:{
                "table":"searchConf","attrs":{"modelType":"test"}
        },
        buttonParams:{
                "table":"buttonConf","attrs":{"modelType":"test"}
        },
        columnParams:{
                "table":"columnConf","attrs":{"modelType":"test"}
        },
        tableListParams:{
           "table":"test","attrs":{}
        },
        coevrListParams:{
          "table":"baseOptionConf","attrs":{ "modelType": "test"}
        },
      dialogFormParams:{

            "table":"test","attrs":{}
        },
        updateDisplayParams:{
           "table":"test","attrs":{}
        },
        updateSubmitDisplayParams:{
           "table":"test","updates":{},"attrs":{}
        },
        deleteDisplayParams:{
          "table":"test","attrs":{}
        },
        

        
        //table头部按钮数据
        commomButtonData:[],
        //table头部form搜索数据
       formTypeData:[ ],
      
      //这个是table的每列对应的title
       cols: [],
        //table数据
       tableDataList:[],
       //弹窗的数据
       coverFormList:[],
       //弹窗的title
       dialogTitle:'',
       dialogClickType:'',
      //控制弹窗打开关闭的数据
      setAddVisible:false,
      //弹窗的数据
      submitFormData:{},
      //弹窗提交的数据
      dialogSuccessData:{},
      //复选框选中的数据
      multipleSelection:[],
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        curpage: 1,
        page_num: 2,
        total:0,
       
     
      }
   
    }
  },
  created() {
    this.getFormSearch()
    this.getTableButton()
    this.getTableTitle()
  },
  methods: {
      //通用的
    //获取table列的title
    getTableTitle(){
           getCommonFun(JSON.stringify(this.columnParams)).then(res=>{
                if(res.data.result=='ok'){
                   this.cols = res.data.data 
                   this.getTableList(this.tableListParams)
               }
           }) 
    },
    //获取form中的搜索值
    getFormSearch(){
           getCommonFun(JSON.stringify(this.searchParams)).then(res=>{
              if(res.data.result=='ok'){
                   this.formTypeData = res.data.data
               }
           }) 
    },
    //获取table的操作按钮
    getTableButton(){         
          getCommonFun(JSON.stringify(this.buttonParams)).then(res=>{               
                if(res.data.result=='ok'){
                    this.commomButtonData = res.data.data
                    
                }
           }) 
    },
    //获取table的列表
    getTableList(data){
       let objNew = JSON.stringify(data);
        let obj = JSON.parse(objNew);
        obj.curpage = this.listQuery.curpage
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
                         this.listQuery.total =7
                        this.listLoading = false
                    }
              }) 
    },
    //分页点击到当前所在页的事件
     handleCurrentChange(val) {
          this.listQuery.curpage = val
          this.getTableList(this.tableListParams)
      },     
    //分页中每行显示的多少数据的事件
     handleSizeChange(val) {
        this.listQuery.page_num = val;
         this.getTableList(this.tableListParams)
      },
     

    //条件搜索table
    searchTableFun(){
      this.tableListParams.attrs = this.submitFormData
      this.getTableList(this.tableListParams)
    },
    //table复选框改变事件
    changeChecked(val){
        this.multipleSelection = val;
    },
    //弹窗打开时间获取弹窗的内容
    opneCover(clickType,name){
      this.dialogTitle = name
      this.dialogClickType = clickType;
      //添加功能
      if(clickType=='add'){   
        let objNew = JSON.stringify(this.coevrListParams);
        let obj = JSON.parse(objNew);
        obj.attrs.insert = true
        getCommonFun(JSON.stringify(obj)).then(res=>{               
                    if(res.data.result=='ok'){              
                        this.coverFormList = res.data.data

                        this.setAddVisible = true;
                    }
              }) 
        
        //修改功能
      }else if(clickType=='update'){
        if( this.multipleSelection.length!=1){
            this.$message({
              message: '请选择一条，需要修改的记录',
              type: 'warning'
            });
          return false;
        }
        let objNew = JSON.stringify(this.coevrListParams);
        let obj = JSON.parse(objNew);
        obj.attrs.update = true

        getCommonFun(JSON.stringify(obj)).then(res=>{               
              if(res.data.result=='ok'){              
                  this.coverFormList = res.data.data
                  this.updateDisplay();
                  
              }
          }) 
        //删除功能
      }else if(clickType=='delete'){
        if( this.multipleSelection.length!=1){
            this.$message({
              message: '请选择一条，需要修改的记录',
              type: 'warning'
            });
          return false;
        }
      }
      let objNew = JSON.stringify(this.deleteDisplayParams);
      let obj = JSON.parse(objNew);
       obj.attrs['_id'] = this.multipleSelection[0]['_id']    
        this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           deleteCommonFun(JSON.stringify(obj)).then(res=>{ 
              if(res.data.result=='ok'){
                this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                  this.getTableList(this.tableListParams);
              }
                
           })
         
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
     
    },
    //修改的值回显
    updateDisplay(){
         let objNew = JSON.stringify(this.updateDisplayParams);
        let obj = JSON.parse(objNew);
        obj.attrs['_id'] = this.multipleSelection[0]['_id']     
         getCommonFun(JSON.stringify(obj)).then(res=>{               
                    if(res.data.result=='ok'){              
                      console.log(res)
                        this.dialogSuccessData = res.data.data[0]
                        this.$delete( this.dialogSuccessData, "_id" )
                        this.setAddVisible = true;
                    }
            }) 


    },    
    //关闭弹出层
    dialogCancel(){
      this.setAddVisible = false;
    },
    //弹窗form数据提交
    dialogSubmit(){
      if(this.dialogClickType=='add'){
        let objNew = JSON.stringify(this.dialogFormParams);
        let obj = JSON.parse(objNew);
        obj.attrs = this.dialogSuccessData
          addCommonFun(JSON.stringify(obj)).then(res=>{
              if(res.data.result=='ok'){  
                    this.setAddVisible = false;
                    this.dialogSuccessData={};
                    this.getTableList(this.tableListParams);
                }
          })
      }else if(this.dialogClickType=='update'){
        let objNew = JSON.stringify(this.updateSubmitDisplayParams);
        let obj = JSON.parse(objNew);
        obj.updates = this.dialogSuccessData
        obj.attrs['_id'] = this.multipleSelection[0]['_id']  
          updateCommonFun(JSON.stringify(obj)).then(res=>{
              if(res.data.result=='ok'){  
                    this.setAddVisible = false;
                    this.dialogSuccessData={};
                    this.getTableList(this.tableListParams);
                }
          })

      }     
    }

  }
}
</script>

<style>
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

