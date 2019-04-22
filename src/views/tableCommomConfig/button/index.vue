<template>
    <div>
        <!--头部按钮 -->
    <div class='bottom'>  
        <el-button size='mini' v-for='(item,index) in commomButtonData'   :key='index' 
        class="filter-item" style="margin-left: 10px;" :type="item.colorType" :ord='item.ord'   @click='opneCover(item.clickType,item.name)' >{{item.name}}
        </el-button> 
        </div>
        <!--弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="setAddVisible" width="500px">
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
            <div class='button-cont'>
                <!-- <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button> -->
                <el-button type="primary" size="small" @click="dialogSubmit()">确认</el-button>
                <el-button size="small" @click="dialogCancel()">取消</el-button>
            </div>
            </el-form>
      </el-dialog>
    </div>
</template>
<script>
import bus from '@/main.js'
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
export default {  
    props:['tableName'],
    data(){
        return {
         coevrListParams:{
          "table":"baseOptionConf","attrs":{ "modelType": ""}
        },
        //弹窗提交的数据
         dialogSuccessData:{},
        //弹窗的数据
         coverFormList:[],
         //控制弹窗打开关闭的数据
        setAddVisible:false,
        //弹窗的title
        dialogTitle:'',
        dialogClickType:'',
        //table头部按钮数据
        commomButtonData:[],
          updateDisplayParams:{
           "table":"test","attrs":{}
        },
        //复选框选中的数据
        multipleSelection:[],
        buttonParams:{
                "table":"buttonConf","attrs":{"modelType":""}
        },
         dialogFormParams:{
            "table":"","attrs":{}
        },
         updateSubmitDisplayParams:{
           "table":"","updates":{},"attrs":{}
        },
        deleteDisplayParams:{
          "table":"","attrs":{}
        },
    }
},
    created(){
      this.getUrlJurisdin()
      this.getTableButton()
    },
    mounted(){
        var  _this = this;
        //在search中调用的
        bus.$on("checkeFun", function(msg) {
                _this.multipleSelection = msg;
        });
    },
    methods:{
      //匹配url
     getUrlJurisdin(){
     
        this.coevrListParams.attrs.modelType= this.tableName
        this.buttonParams.attrs.modelType= this.tableName
        this.dialogFormParams.table= this.tableName
         this.updateSubmitDisplayParams.table= this.tableName
        this.deleteDisplayParams.table= this.tableName

      },   
       //获取table的操作按钮
    getTableButton(){         
          getCommonFun(JSON.stringify(this.buttonParams)).then(res=>{               
                if(res.data.result=='ok'){
                    this.commomButtonData = res.data.data
                    
                }
           }) 
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
                         bus.$emit("tableFun");
                
                }
                    
            })
            
            }).catch(() => {
            // this.$message({
            //   type: 'info',
            //   message: '已取消删除'
            // });          
            });
     
      }
     
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
                      bus.$emit("tableFun");
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
                      bus.$emit("tableFun");
                }
          })

      }     
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
    //取消操作按钮
    dialogCancel(){
        this.setAddVisible= false

    }
}

}
</script>

<style scoped> 
        .el-form-item__label{
           width: 90px !important;
        }
        .el-form-item__content{
                margin-left: 100px;
        }
        .el-input{
            width:70%;

        }
        .button-cont{
            text-align: center;
        }
        .bottom{
           margin-bottom:20px;
        }

</style>
