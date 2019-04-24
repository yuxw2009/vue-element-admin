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
     <el-table-column type="selection" width="50" align='center' ></el-table-column>
        <el-table-column type="expand" label=" "  align='center' width="60">
        <template slot-scope="props">
          <el-row class="filter-container" style="margin-bottom: 20px" >
            <el-col   class="demo-table-expand" >
              <el-table ref="crudTable" v-loading="listLoading" :data="props.row.children" size="mini" border  label-position="left"  inline 
              @select="changeCheckedid"   @selection-change="changeCheckeds(props.row._id)"   @select-all='selectAllChildren'>
                <el-table-column type="selection" label=" " align='center' width="50"></el-table-column>
                    <el-table-column  align='center'  v-for="(col,index) in cols" :key='index'   height='50px'  :prop="col.prop" :label="col.label" >               
                      </el-table-column>     
              </el-table>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      
       <el-table-column  align='center' v-for="(col,index) in cols" :key='index'  height='30px'  :prop="col.prop" :label="col.label" ></el-table-column>
      <!-- <el-table-column label="操作"  align='center' width='400px'>
          <template slot-scope="scope" >  
            <div  v-for = '(item,index) in  tableRowButton' :key='index' >
              <el-button   :size="item.size" @click="handleEvent(scope.row,index)">{{item.name}}</el-button>
              <Dialog ref="dialog" v-if="coverFormList.length>0" :coverFormList='coverFormList' @formSubmit='editSubmit'></Dialog>
             </div>
          </template>
        </el-table-column> -->
         <el-pagination v-show="listQuery.total>0" :total="listQuery.total"  :page-sizes="[10, 20, 30, 40,50]"  layout="total, sizes, prev, pager, next, jumper" :page.sync="listQuery.curpage" :limit.sync="listQuery.page_num" 
          @size-change="handleSizeChange"  @current-change="handleCurrentChange"></el-pagination>  
      </el-table>
     
  </div>  
  
</template>
<script>
import bus from '@/main.js'
import Dialog from '../dialog'
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
export default {
  props:['tableName','coverFormList'],
  components:{
    Dialog
  },
  data(){
    return{
        columnParams:{"table":"columnConf","attrs":{"modelType":''}},

        tableListParams:{"table":"menuConf","attrs":{}},
        //table每行的按钮的值
        tableRowButton:[
          {size:'mini',name:'编辑',type:'danger',clickType:1},
          {size:'mini',name:'删除',type:'danger',clickType:2},
          {size:'mini',name:'添加子菜单',type:'danger',clickType:3},
          {size:'mini',name:'配置属性',type:'danger',clickType:4}

        ],
        tableKey: 0,
        listLoading: false,
        //table数据
        tableDataList:[],
        cols:  [
              {"modelType":"test",prop: 'label', label: '菜单名称'},
               {"modelType":"test",prop: 'meta.title', label: '名称映射'},
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

      },
      m:0,
      fatherSelect:[],
      childSelect:[],
      childAllChecked:[],
      // childCureentSelect:[],
      // fidChild:[],//{"fid":"","path":""}
      fid:""
    }
  },
  created(){
    // this.getUrlJurisdin()
    // this.getTableTitle()
    this.getTableList()

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
      getTableList(){
          this.fatherSelect = [],
          this.childSelect = [],
          getCommonFun(JSON.stringify(this.tableListParams)).then(res=>{               
                    if(res.data.result=='ok'){
                          this.tableDataList = res.data.data
                        this.listLoading = false
                    }
              }) 
      },
     //table复选框改变事件
      changeChecked(val){
        this.fatherSelect = val;
        // console.log(4,this.fatherSelect, this.childSelect)
        bus.$emit("checkeFun", this.fatherSelect, this.childSelect);
      },
      //全选
      selectAllChildren(val){ 
        //全部选中
        if(val.length>0){
          //如果已经选中，不添加进去
          //未选中，则添加进去
          // for(var i = 0; i < val.length; i++){
          //     val[i]._id = this.fid
          //     this.childSelect.push(val[i])
          // }
            let flag = false;
            for(let i=0;i<val.length;i++){
                flag = false;
                for(let j=0;j<this.childSelect.length;j++){
                    if( this.fid==this.childSelect[j]['_id'] && val[i].path==this.childSelect[j].path ){
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    val[i]['_id']=this.fid
                    this.childSelect.push(val[i])
                }
            }
        //取消选中
        }else{
          //无数据，所以根据fid，删除所有属性中_id等于fid的数据
          //数组索引删除记住倒叙循环根据索引删除
             for(var i = this.childSelect.length-1; i >=0; i--){
               if(this.fid== this.childSelect[i]['_id']){
                  this.childSelect.splice(i, 1);   
               }
          }
          
        }
       bus.$emit("checkeFun", this.fatherSelect, this.childSelect);
        // console.log("kk",this.fatherSelect, this.childSelect)
      },
      //table复选框改变事件
      changeCheckeds(id){
        this.fid = id;
      },
      changeCheckedid(val,row){
        let flag =-1;
        // console.log(this.childSelect)
        for(let i=0;i<this.childSelect.length;i++ ){
            if(this.childSelect[i].path==row.path  &&  this.childSelect[i].name==row.name){
              flag=i;
              break;
            }
        }
        if(flag>-1){
          this.childSelect.splice(flag, 1);
        }else{
          row['_id']=this.fid
          this.childSelect.push(row)
        }
        bus.$emit("checkeFun", this.fatherSelect, this.childSelect);
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
         },
         //table每行按钮的事件
        handleEvent(row,index){
          this.m=index;
            this.$refs.dialog[index].openDialog(row); 
        },
        //弹窗的修改
        editSubmit(){
          alert(this.m)
          if("edit"){
          }else if("del"){

          }
        },
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
