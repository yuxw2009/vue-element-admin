<template>
  <div class="app-container">
    <div class="filter-container" >
        <div  v-for='(item,index) in formTypeData' :key='index' class='displayInline'>
             <el-select v-model="submitFormData[item.key]"  v-if="item.formType=='select'"  :placeholder="item.formType" clearable style="width: 90px" class="filter-item">
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
      class="filter-item" style="margin-left: 10px;" :type="item.colorType" :ord='item.ord'  :clickType ='item.clickType'  >{{item.name}}</el-button> 
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableDataList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
     >
    <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column  align='center' v-for="(col,index) in cols" :key='index'   :prop="col.prop" :label="col.label" ></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  
  
  </div>
</template>
<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import {getCommonFun} from '@/api/tableCommom'
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
        //table头部按钮数据
        commomButtonData:[],
        //table头部form搜索数据
       formTypeData:[ ],
      
      //这个是table的每列对应的title
       cols: [],
        //table数据
       tableDataList:[],
        
     submitFormData:{},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    // this.getTableTitle()
    // this.getList()
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
        this.listLoading = true
        var  jsonData = {

             }
         for(var index in data.attrs){//遍历json对象的每个key/value对,p为key      
              if(data.attrs[index]){
            
                  jsonData[index] = data.attrs[index]
              }

          }
          this.data.attrs = jsonData
      console.log( this.data)
      getCommonFun(JSON.stringify(data)).then(res=>{               
                    if(res.data.result=='ok'){
                        this.tableDataList = res.data.data
                         this.listLoading = false
                    }
              }) 
    },
    //条件搜索table
    searchTableFun(){
      this.tableListParams.attrs = this.submitFormData
      this.getTableList(this.tableListParams)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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

