<template>
    <div class='dialog'>
        <el-dialog title="配置属性" :visible.sync="setAddVisibles" width="1050px" >
            <el-form  label-width="80px">
                <div class='item'>
                    <el-form-item label="操作配置"></el-form-item>  
                    <div class='cont'>
                            <div class='button-cont'>
                                <el-button size='mini' type="primary" @click="buttonDialog('添加','add')">添加</el-button> 
                                <el-button size='mini' type="primary" @click="buttonDialog('编辑','update')">编辑</el-button>
                                <el-button size='mini' type="primary" @click="buttonDialog('删除','del')">删除</el-button>
                            </div>
                            <el-table
                                :data="buttontableData"
                                @select='buttontableDataChange'
                                border
                                height='300'
                                style="width: 100%">
                                <el-table-column
                                align="center"
                                type="selection"  width="55" >
                                </el-table-column>
                                <el-table-column
                                align="center"
                                type="index"  width="55" >
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="name"
                                label="按钮名称"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="modelType"
                                label="表名"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="icon"
                                label="图标"
                                width="180">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="colorType"
                                label="按钮颜色">
                            </el-table-column>
                            <el-table-column
                            align="center"
                                prop="clickType"
                                label="事件名称">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="ord"
                                label="排序码">
                            </el-table-column>
                        
                        </el-table>
                    </div>
                </div>
            
            </el-form> 
             <el-form  label-width="80px">
                <div class='item'>
                    <el-form-item label="基本配置"></el-form-item>  
                    <div class='cont'>
                        <div class='button-cont'>
                            <el-button size='mini' type="primary" @click="optionButtonDialog('添加','add')">添加</el-button> 
                            <el-button size='mini' type="primary" @click="optionButtonDialog('编辑','update')">编辑</el-button>
                            <el-button size='mini' type="primary" @click="optionButtonDialog('删除','del')">删除</el-button>
                        </div>
                        <el-table :data="menuTableData" @select='menuTableDataChange'   height='250' border style="width: 100%">
                            <el-table-column align="center" type="selection"  width="55" ></el-table-column>
                            <el-table-column align="center" prop="modelType" label="模块"></el-table-column>
                            <el-table-column align="center" prop="prop" label="属性"></el-table-column>
                            <el-table-column align="center" prop="label" label="显示名称"></el-table-column>
                            <el-table-column align="center" prop="insert" label="添加"></el-table-column>
                            <el-table-column align="center" prop="update" label="修改"></el-table-column>
                            <el-table-column align="center" prop="search" label="搜索"></el-table-column>
                            <el-table-column align="center" prop="table" label="列表"></el-table-column>
                            <el-table-column align="center" prop="ord" label="排序码"></el-table-column>
                            <el-table-column align="center" prop="formType" label="表单类型"></el-table-column>
                            <el-table-column align="center" prop="defaultValues" label="默认值"></el-table-column>
                            
                        </el-table>
                    </div>
                </div>
            </el-form>  
            <div style='margin-top:20px; text-align:center'>
                    <el-button size='mini' align='center'  type="primary" @click="successGetData()">保存</el-button>         
            </div> 
        </el-dialog>
         <el-dialog :title="buttonDialogTitle" :visible.sync="buttonVisibles" width="500px" class='buttonDialog'>
                 <el-form  label-width="80px">
                        <el-form-item  label='表名'>
                            <el-input  v-model="buttonSubmitData.modelType" size="small"  />
                        </el-form-item>  
                        <el-form-item  label='按钮名称 '>
                            <el-input  v-model="buttonSubmitData.name" size="small"  />
                        </el-form-item>  
                        <el-form-item  label='图标' >
                            <el-input  v-model="buttonSubmitData.icon" size="small"  />
                        </el-form-item>
                          <el-form-item  label='按钮颜色' >
                            <el-input  v-model="buttonSubmitData.colorType" size="small"  />
                        </el-form-item>  
                        <el-form-item  label='事件名称' >
                            <el-input  v-model="buttonSubmitData.clickType" size="small"  />
                        </el-form-item>  
                         <el-form-item  label='排序码' >
                            <el-input  v-model="buttonSubmitData.ord" size="small"  />
                        </el-form-item>                  
                    <div class='button-cont1'>
                        <!-- <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button> -->
                        <el-button type="primary" size="small" @click="buttonDialogSubmit()">确认</el-button>
                        <el-button size="small" @click="buttonDialogCancel()">取消</el-button>
                    </div>
                 </el-form>
         </el-dialog>
         <el-dialog :title="optionButtonDialogTitle" :visible.sync="optionButtonVisibles" width="500px" class='buttonDialog'>
                 <el-form  label-width="80px">
                    <el-form-item  label='表名'><el-input  v-model="optionEditObject.modelType" size="small"  /></el-form-item>
                    <el-form-item  label='属性名'><el-input  v-model="optionEditObject.prop" size="small"  /></el-form-item>
                    <el-form-item  label='显示名称 '><el-input  v-model="optionEditObject.label" size="small"  /></el-form-item>
                    <el-form-item  label='添加'><el-input  v-model="optionEditObject.insert" size="small"  /></el-form-item>
                    <el-form-item  label='修改'><el-input  v-model="optionEditObject.update" size="small"  /></el-form-item>
                    <el-form-item  label='搜索'><el-input  v-model="optionEditObject.search" size="small"  /></el-form-item>
                    <el-form-item  label='列表'><el-input  v-model="optionEditObject.table" size="small"  /></el-form-item>
                    <el-form-item  label='排序码'><el-input  v-model="optionEditObject.ord" size="small"  /></el-form-item>
                    <el-form-item  label='表单类型'><el-input  v-model="optionEditObject.formType" size="small"  /></el-form-item>
                    <el-form-item  label='默认值'><el-input  v-model="optionEditObject.defaultValues" size="small"  /></el-form-item>
                    
                    <div class='button-cont1'>
                        <!-- <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button> -->
                        <el-button type="primary" size="small" @click="optionButtonDialogSubmit()">确认</el-button>
                        <el-button size="small" @click="optionButtonDialogCancel()">取消</el-button>
                    </div>
                 </el-form>
         </el-dialog>
    </div>
     
</template>
<script>
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun,deleteMuliCommonFun,addMultiCommonFun} from '@/api/tableCommom'

export default {
       data(){
           return {
               setAddVisibles:false,
               buttonVisibles:false,
               buttontableDataSelect:[],
               buttonDialogTitle:'',
               clickType:'',
               buttontableData:[],
               buttomTableParams:{"table":"buttonConf","attrs":{"modelType": ""},"sorts":{"ord":1}},
               optionButtomTableParams:{"table":"baseOptionConf","attrs":{"modelType": ""},"sorts":{"ord":1}},
               delMuliButton:{"table":"buttonConf","attrs":{"modelType": ""}},
               delMuliOptionButton:{"table":"baseOptionConf","attrs":{"modelType": ""}},
               addMuliButton:{"table":"buttonConf","attrs":[]},
               addMuliOptionButton:{"table":"baseOptionConf","attrs":[]},
               buttontableRowSelect:{},
               buttonSubmitData:{
                    name:'',
                    icon:'',
                    colorType:'',
                    clickType:'',
                    ord:''
               },
               menuTableData:[
                  
               ],
               optionButtonDialogTitle:"",
               optionButtonVisibles:false,
               optionEditObject:{},
               optionCheckObjects:[],
               optionClickType:""
           }
           
       },
       methods:{
           init(){
                let objNew = JSON.stringify(this.buttomTableParams);
                let obj = JSON.parse(objNew);
                 getCommonFun(JSON.stringify(obj)).then(res=>{                              
                        if(res.data.result=='ok'){                 
                          this.buttontableData = res.data.data
                        
                        }
                    }) 
                 objNew = JSON.stringify(this.optionButtomTableParams);
                 obj = JSON.parse(objNew);
                     getCommonFun(JSON.stringify(obj)).then(res=>{                              
                        if(res.data.result=='ok'){                 
                          this.menuTableData = res.data.data
                        
                        }
                    }) 


           },
           openDialog(modelType){
               console.log(modelType)
               this.buttomTableParams.attrs.modelType=modelType
               this.optionButtomTableParams.attrs.modelType=modelType
               this.delMuliButton.attrs.modelType=modelType
               this.delMuliOptionButton.attrs.modelType=modelType
               console.log(this.buttomTableParams,this.optionButtomTableParams)
               this.init()
               this.setAddVisibles = true
           },
           buttontableDataChange(selection,row){
               this.buttontableDataSelect = selection
               this.buttontableRowSelect = row
           },           
           buttonDialog(title,clickType){
               this.clickType = clickType
               this.buttonSubmitData = {}
                this.buttonDialogTitle = title
               if(clickType=='add'){
                    this.buttonVisibles = true
               }else{
                   if(this.buttontableDataSelect.length!=1){
                       this.$message({
                            message: '请选择一条，需要操作的记录',
                            type: 'warning'
                        });
                   }else{
                       if(clickType=='update'){
                           this.buttonSubmitData = this.buttontableRowSelect
                           this.buttonVisibles = true

                       }else if(clickType=='del'){
                            this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                     for(var i =this.buttontableData.length-1; i >=0; i--){         
                                                      
                                            if(this.buttontableData[i]['_id'] == this.buttontableRowSelect['_id']){
                                                    this.buttontableData.splice(i,1)
                                                    break;
                                            }
                                        }   
                                         this.buttonVisibles = false              


                                }).catch(() => {
                                        // this.$message({
                                        //   type: 'info',
                                        //   message: '已取消删除'
                                        // });          
                                        });

                           
                       }

                   }
               }
              
           },
           buttonDialogSubmit(){
               if(this.clickType=='add'){
                    if(this.buttonSubmitData){
                        this.buttontableData.push(this.buttonSubmitData)
                        this.buttonVisibles = false
                    }
               }else if(this.clickType=='update'){
                   for(var i = 0; i < this.buttontableData.length; i++){
                       if(this.buttontableData[i]['_id']== this.buttontableRowSelect['_id']){
                           console.log(i)
                            this.buttontableData[i] = this.buttonSubmitData
                            break;
                       }
                   }
                    this.buttonVisibles = false

               }
               
           },
           buttonDialogCancel(){
               
                this.buttonVisibles = false

           },
           menuTableDataChange(val){
               console.log(1,val)
               this.optionCheckObjects = val;
           },
           optionButtonDialog(name,clickType){
               this.optionButtonDialogTitle = name ;
               this.optionClickType = clickType;
               if(clickType == "add"){
                   this.optionEditObject = {}
                   this.optionButtonVisibles = true
               }else if(clickType == "update"){
                   if(this.optionCheckObjects.length != 1){
                       this.$message({
                            message: '请选择一条，需要操作的记录',
                            type: 'warning'
                        });
                        return false;
                   }
                   this.optionEditObject = this.optionCheckObjects[0]
                   this.optionButtonVisibles = true


               }else if(clickType == "del"){
                   if(this.optionCheckObjects.length != 1){
                       this.$message({
                            message: '请选择一条，需要操作的记录',
                            type: 'warning'
                        });
                        return false;
                   }

                   this.optionEditObject = this.optionCheckObjects[0]

                   this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        for(let i=0;i<this.menuTableData.length;i++){
                            if(this.menuTableData[i].prop == this.optionEditObject.prop){
                                this.menuTableData.splice(i,1)
                                break;
                            }
                        }

                    }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });          
                    });
               }
               
           },
           optionButtonDialogCancel(){
               this.optionButtonVisibles = false;
           },
           optionButtonDialogSubmit(){
               if(this.optionClickType == "add"){
                   this.menuTableData.push(this.optionEditObject)
                   this.optionButtonVisibles = false
               }else if(this.optionClickType == "update"){
                    for(let i=0;i<this.menuTableData.length;i++){
                        if(this.menuTableData[i].prop == this.optionEditObject.prop){
                            this.menuTableData[i] = this.optionEditObject;
                            break;
                        }
                    }
                    this.optionButtonVisibles = false

               }
           },
           successGetData(){
               //先删除原有数据
                let objNew = JSON.stringify(this.delMuliButton);
                let obj = JSON.parse(objNew);
                deleteMuliCommonFun(JSON.stringify(obj)).then(res=>{                              
                    if(res.data.result=='ok'){                 
                        // this.menuTableData = res.data.data
                        objNew = JSON.stringify(this.addMuliButton);
                        obj = JSON.parse(objNew);

                        for(let i =0;i<this.buttontableData.length;i++){
                            if(this.buttontableData[i].hasOwnProperty("_id")){
                                delete this.buttontableData[i]['_id']
                            }
                        }

                        obj.attrs = this.buttontableData;
                        addMultiCommonFun(JSON.stringify(obj)).then(res=>{                              
                            if(res.data.result=='ok'){                 
                                // this.menuTableData = res.data.data
                                // addMultiCommonFun
                            }
                        }) 
                    }
                }) 
               //批量添加
                objNew = JSON.stringify(this.delMuliOptionButton);
                obj = JSON.parse(objNew);
                deleteMuliCommonFun(JSON.stringify(obj)).then(res=>{                              
                    if(res.data.result=='ok'){                 
                        // this.menuTableData = res.data.data
                        objNew = JSON.stringify(this.addMuliOptionButton);
                        obj = JSON.parse(objNew);

                        for(let i =0;i<this.menuTableData.length;i++){
                            if(this.menuTableData[i].hasOwnProperty("_id")){
                                delete this.menuTableData[i]['_id']
                            }
                        }

                        obj.attrs = this.menuTableData;
                        addMultiCommonFun(JSON.stringify(obj)).then(res=>{                              
                            if(res.data.result=='ok'){                 
                                // this.menuTableData = res.data.data
                                // addMultiCommonFun

                                this.setAddVisibles = false;
                                 this.$message({
                                        message: '保存成功',
                                        type: 'warning'
                                    });

                            }
                        }) 
                    }
                }) 
               

               //获取表单数据，保存到数据库
               

           }
       }
}
</script>

<style scoped>
    .el-form-item{
        margin-bottom: 0px;
    }
   .cont{
        margin-left:90px;
        
   }
   .el-select{
       width: 100%;
   }
    .button-cont{
        margin-bottom: 10px
    }
    .buttonDialog .el-form-item{
        margin-bottom:10px;
    }
    .button-cont1{
        text-align:center
    }
    .el-dialog__body{
    padding: 10px 20px !important;
}


</style>
