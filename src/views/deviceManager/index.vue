<template>
    <div class='cont'>
        <div class='button-cont'>
             <el-button size='mini'   type="primary" class="filter-item" icon='el-icon-download'  style="margin-left: 10px;" @click="downloadVerDiaog(checkedDevInfos)">版本下载</el-button>      
        </div>
        <div class='table-allCont'>
                <div class='table-cont'>
                        <el-table  ref="multipleTable" :data="serverDevInfos" border style="width:1000%" height='500' @selection-change="HandleDeviceSelectionChange">
                                <el-table-column type="selection" width="55"  align="center">  </el-table-column>

                                <el-table-column prop="dev_id" label="设备id" align="center"> </el-table-column>
                                <el-table-column prop="erp_equipmentNO" label="设备编码" align="center"> </el-table-column>  
                                <el-table-column prop="erp_volume" label="产品类型" align="center"> </el-table-column>             
                                <el-table-column prop="Ver" label="版本号" align="center"> </el-table-column>    
                                
                                <el-table-column  label='下载进度' align="center" width='200'>
                                        <template slot-scope="{row}">   
                                            <el-progress  v-if='IsDownloading(row)' :percentage="getPercent(row)" :stroke-width="14" ></el-progress>                                     
                                        </template>
                                </el-table-column>  
                                <el-table-column label="操作" width='200' align="center"> 
                                    <template slot-scope="scope">
                                        <el-button size="mini"   icon='el-icon-remove-outline' v-if='IsDownloading(scope.row)' class='oneButton' type="danger" @click="handleStop(scope.row,scope.$index)">停止</el-button>
                                        <el-button size="mini"  v-else  icon=' el-icon-time' class='oneButton' type="primary"  @click="downloadVerDiaog([scope.row])">下载</el-button>             
                                    </template>     
                                  </el-table-column>              
                        </el-table>
                </div> 
        </div>
         <el-dialog title="版本下载"  :visible.sync="dialogVisible"  width="1000px"  height='300' >
                 <el-table  ref="multipleTable" :data="verTableData" border style="width:100%"  height='500'  @selection-change="handleVerSelectionChange"> 
                        <el-table-column type="selection" width="55"  align="center">  </el-table-column>
                        <el-table-column prop="device_type" label="设备类型" align="center"> </el-table-column> 
                        <el-table-column prop="name" label="文件类型" align="center"> </el-table-column>      
                        <el-table-column prop="size" label="文件大小" align="center"> </el-table-column>   
                    </el-table>
                    <div class='downLoad-cont' >
                        <el-button size='mini'  type="primary"  class="filter-item"  icon='el-icon-upload'  @click='download()'>确定下载</el-button>          
                    </div>

         </el-dialog>
              

        </div>

</template>
<script>
import {getDevicesList,getVerList,downloadFile,stopUpLoad} from '@/api/manager'
export default {
    data(){
        return  {
            serverDevInfos:[],  
            checkedDevInfos:[],


            verTableData:[],
            textDataParams:{
                conditions:[]
            },
            dialogVisible:false,
             fileList:[],
             verChecked:[],
             downloadtextDataParams:{dev_id:'',ver_filename:""},
             buttonShow:false,
             stopUpLoadParams:{dev_id:''},
             sendedlen:'',
             filesize:'',
           
        
        }
    },
    created(){
        this.getDevicesListFun();
        setInterval(()=>{this.getDevicesListFun();},10000);
    },
    methods:{    
        getDevicesListFun(){
            getDevicesList().then(res=>{  
                if(res.data.status=='ok'){
                    this.serverDevInfos = res.data.result      
            }                   
           }) 
        },
        IsDownloading(Row){
            return Row.status=="downloading" || Row.status=="waiting";
        },
        getPercent(row){
            return row && row.sendedlen && row.sendedlen && row.filesize && row.sendedlen/row.filesize ||0;
        },
        VerTableDataListFun(){         
             getVerList(JSON.stringify(this.textDataParams)).then(res=>{  
                 console.log(res)
                if(res.data.status=='ok'){
                    this.verTableData = res.data.result
                }                 
            })
        },
        HandleDeviceSelectionChange(val){
            this.checkedDevInfos = val
        },
        handleVerSelectionChange(val){
            this.verChecked = val
        },
        downloadVerDiaog(rows){
            // console.log(rows)
            if(rows&&rows.length>0){
                this.checkedDevInfos=rows;
                this.dialogVisible = true;
                this.VerTableDataListFun();
            }else{
                this.$message({
                    message: '请选择设备进行操作',
                    type: 'warning'
                });
                 return  false
            }
        },
        download(){
            if(!(this.verChecked.length==1)){
                this.$message({
                        message: '请选择一条文件数据进行操作',
                        type: 'warning'
                    });
                 return  false
            }else{
                var  _this = this;
                let objNew = JSON.stringify(this.downloadtextDataParams);

                let obj = JSON.parse(objNew);
                obj.ver_filename = this.verChecked[0].name
                
                // SetVer(this.verChecked[0].size)
                

                obj.dev_id = this.checkedDevInfos.map(row=>row.dev_id);
                downloadFile(obj).then(res=>{
                    if(res.data.status=='ok'){
                        this.dialogVisible = false  
                    }
                })
            }
        },

        handleStop(row,index){       
            let objNew = JSON.stringify(this.stopUpLoadParams);
                let obj = JSON.parse(objNew);
                obj.dev_id= row.dev_id
                stopUpLoad(JSON.stringify(obj)).then(res=>{
                    this.getDevicesListFun()
                })
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


