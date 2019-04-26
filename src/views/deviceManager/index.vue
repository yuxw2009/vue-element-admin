<template>
    <div class='cont'>
        <div class='button-cont'>
             <el-button size='mini'   type="primary" class="filter-item" icon='el-icon-download'  style="margin-left: 10px;" @click="downloadTextDiaog()">版本下载</el-button>      
        </div>
        <div class='table-allCont'>
                <div class='table-cont'>
                        <el-table  ref="multipleTable" :data="deviceTableData" border style="width:1000%" height='500' @selection-change="handleDeviceSelectionChange">
                                <el-table-column type="selection" width="55"  align="center">  </el-table-column>

                                <el-table-column prop="dev_id" label="设备id" align="center"> </el-table-column>
                                <el-table-column prop="erp_equipmentNO" label="设备编码" align="center"> </el-table-column>  
                                <el-table-column prop="erp_volume" label="产品类型" align="center"> </el-table-column>             
                                <el-table-column prop="Ver" label="版本号" align="center"> </el-table-column>    
                                
                                <el-table-column  label='版本下载进度' align="center" width='200'>
                                        <template slot-scope="{row,$index}">                                        
                                            <el-progress :text-inside="true" :stroke-width="14" :percentage="row.percentage"></el-progress>
                                        </template>
                                </el-table-column>  
                                <el-table-column label="操作" width='200' align="center"> 
                                    <template slot-scope="scope">
                                        <el-button size="mini"   icon='el-icon-remove-outline' v-if='scope.row.status=="downloading" || scope.row.status=="waiting"' class='oneButton' type="danger" @click="handleStop(scope.row,scope.$index)">停止</el-button>
                                        <el-button size="mini"  v-else  icon=' el-icon-time' class='oneButton' type="primary"  @click="downloadTextDiaog(scope.row)">下载</el-button>             
                                    </template>     
                                  </el-table-column>              
                        </el-table>
                </div> 
        </div>
         <el-dialog title="版本下载"  :visible.sync="dialogVisible"  width="1000px"  height='300' >
                 <el-table  ref="multipleTable" :data="textTableData" border style="width:100%"  height='500'  @selection-change="handleTextSelectionChange"> 
                        <el-table-column type="selection" width="55"  align="center">  </el-table-column>
                        <el-table-column prop="device_type" label="设备类型" align="center"> </el-table-column> 
                        <el-table-column prop="name" label="文件类型" align="center"> </el-table-column>      
                        <el-table-column prop="size" label="文件大小" align="center"> </el-table-column>   
                    </el-table>
                    <div class='downLoad-cont' >
                        <el-button size='mini'  type="primary"  class="filter-item"  icon='el-icon-upload'  @click='downloadText()'>确定下载</el-button>          

                    </div>

         </el-dialog>
              

        </div>

</template>
<script>
import {getDevicesList,getTextList,downloadFile,stopUpLoad} from '@/api/manager'
export default {
    data(){
        return  {
            deviceTableData:[],
            textTableData:[],
            textDataParams:{
                conditions:[]
            },
            dialogVisible:false,
             fileList:[],
             deviceChecked:[],
             textChecked:[],
             downloadtextDataParams:{dev_id:'',ver_filename:""},
             buttonShow:false,
             stopUpLoadParams:{dev_id:''},
             row:''

        }
    },
    created(){
        this.getDevicesListFun()
    },
    methods:{    
        getDevicesListFun(){
            getDevicesList().then(res=>{  
                if(res.data.status=='ok'){
                    this.deviceTableData = res.data.result
                    this.percentageData()
                    _this.goTime()
                }                   
           }) 
        },
        percentageData(){
            for(var i = 0; i <  this.deviceTableData.length; i++){              
                this.deviceTableData[i]['percentage'] = 0
            }
        },
        textTableDataListFun(){         
             getTextList(JSON.stringify(this.textDataParams)).then(res=>{  
                if(res.data.status=='ok'){
                    this.textTableData = res.data.result
                }                 
            })
        },

        handleDeviceSelectionChange(val){
            this.deviceChecked = val
        },
          handleTextSelectionChange(val){
            this.textChecked = val
        },
        downloadTextDiaog(row){
            if(row){
                this.row = row
                this.dialogVisible = true;
                this.textTableDataListFun()

            }else{
                  if(!(this.deviceChecked.length>=1)){
                    this.$message({
                        message: '请选择设备信息进行操作',
                        type: 'warning'
                    });
                    return  false

                    }else{        
                        this.dialogVisible = true;
                        
                        this.textTableDataListFun()            
                    }
            }   
          
        },
        downloadText(){
            if(!(this.textChecked.length==1)){
                this.$message({
                        message: '请选择一条文件数据进行操作',
                        type: 'warning'
                    });
                 return  false
            }else{
                    let objNew = JSON.stringify(this.downloadtextDataParams);
                    let obj = JSON.parse(objNew);
                    obj.ver_filename = this.textChecked[0].name
                if(this.row){                     
                        obj.dev_id = this.row.dev_id
                        downloadFile(obj).then(res=>{
                            if(res.data.status=='ok'){
                                // this.deviceTableData[0].dev_id = 80
                                this.dialogVisible = false
                                this.row.status = 'downloading'
                                this.dialogVisible = false
                                var  _this = this;
                                setInterval(function(){
                                    _this.getDevicesListFun()
                                },5000);
                          }
                    })
                }else{
                    obj.dev_id = this.deviceChecked[0].dev_id
                     downloadFile(obj).then(res=>{
                            if(res.data.status=='ok'){
                                this.deviceTableData[0].status = 'downloading'
                                this.dialogVisible = false
                            }
                    })

                }           
               

            }
        },
        handleStop(row,index){    
            let objNew = JSON.stringify(this.stopUpLoadParams);
                let obj = JSON.parse(objNew);
                obj.dev_id= row.dev_id
                stopUpLoad(JSON.stringify(obj)).then(res=>{
                    row.status = 'online'
                })
        },
        goTime(){
            this.row.percentage = (this.row.sendedlen/this.textChecked[0].size)*100

        }
    }

}
</script>

<style scoped>
.cont{
    padding:20px
}
    .table-cont{
        display: inline-block;
        vertical-align: top;
        width:100%;     
        color: #fff;
        margin-top:20px;
    }
   
    .title{ 
        border-bottom:0;
        font-size: 16px;
        height:45px;
        line-height: 45px;
        text-align: center;
         margin: 0em 0;
    }
    .downLoad-cont{
        margin-top:20px;
        text-align: center;
    }
   .upload-button{
       text-align: center;
        margin-bottom:20px;

   }
   .upload-demo{
       height:300px;
        text-align: center;
   }
   .buttonText{
       margin-right: 10px;
   }
    .el-upload-list{
            margin-left: -93px;
       
    }
    .is-center {
        position: relative;

    }
    .oneButton{
        position:absolute;
        top:50%;
        left:50%;
        margin-left: -23px;
        margin-top:-14px;
    }
    
    
</style>


