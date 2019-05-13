<template>
    <div class='cont'>
        <div class='button-cont'>
            <el-button size='mini'   type="primary" class="filter-item" icon='el-icon-download'  style="margin-left: 10px;" @click="downloadVerDiaog(checkedDevIds)">版本下载</el-button>   

        </div>     
        <div class='table-allCont'>
                <div class='table-cont'>
                        <el-table  ref="multipleTableDev" :data="serverDevInfos" border style="width:1000%" height='500' @select="HandleDeviceSelectionChange">
                                <el-table-column type="selection" width="55"  align="center" >  </el-table-column>
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
                                        <el-button size="mini"   icon='el-icon-remove-outline' v-if='IsDownloading(scope.row)' class='oneButton' type="danger" @click="handleStop(scope.row,scope.$index)">{{getOperationText(scope.row)}}</el-button>
                                        <el-button size="mini"  v-else  icon=' el-icon-time' class='oneButton' type="primary"  @click="downloadVerDiaog([scope.row.dev_id])">{{getOperationText(scope.row)}}</el-button>             
                                    </template>     
                                  </el-table-column>              
                        </el-table>
                </div> 
        </div>
         <el-dialog title="版本下载"  :visible.sync="dialogVisible"  width="1000px"  @close='closeFun' height='300' >
                 <el-table  ref="multipleTableText" :data="verTableData" border style="width:100%"  height='500'  @selection-change="handleVerSelectionChange"> 
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

var  data = []
export default {
    data(){
        return  {
            serverDevInfos:[],  
            checkedDevIds:[],
            // checkedDevIds:[],
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
             rowsData:[],
             checkedDev:[]
         
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
                    this.$nextTick(()=>{
                        this.SetSelection(this.checkedDevIds)
                    })
            }                   
           }) 
        },
        SetSelection(rows) {
            var  _this = this
            this.$refs.multipleTableDev.clearSelection();
            if (rows) {
                rows.forEach(function(row){
                    var selected=_this.serverDevInfos.find((i)=>i.dev_id==row);
                    _this.$refs.multipleTableDev.toggleRowSelection(selected);
                });
            }else{
                this.$refs.multipleTableDev.clearSelection();
            }
        },
        IsDownloading(Row){
            // return Row.status=="downloading" || Row.status=="waiting";
            return Row.status!="online";
        },
        getOperationText(row){
            if(row.status=='done') return '完成确认'
            if(row.status=='online') {return '下载'
            }else{ return '停止'}
        },
        getPercent(row){
            if(row.status=='done') return 100;
            return Math.min(row && row.sendedlen && row.sendedlen && row.filesize && parseInt(row.sendedlen/row.filesize*1000)/10 ||0,99.9);
        },
        VerTableDataListFun(){         
             getVerList(JSON.stringify(this.textDataParams)).then(res=>{  
                if(res.data.status=='ok'){
                    this.verTableData = res.data.result
                }                 
            })
        },
        HandleDeviceSelectionChange(val,rows){ 
            this.checkedDevIds = val.map(i=>i.dev_id)
        },
        HandleDeviceSelectionChangeAll(val){
            this.checkedDevIds = val.map(i=>i.dev_id)
        },
        handleVerSelectionChange(val){
            this.verChecked = val
        },
        downloadVerDiaog(rows){      
            this.rowsData = rows
            if(this.rowsData&&this.rowsData.length>0){
                this.checkedDev=this.rowsData;
                this.dialogVisible = true;
                data =  this.checkedDev
            
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
                
                obj.dev_id = this.checkedDev;
                downloadFile(obj).then(res=>{
                    if(res.data.status=='ok'){
                        this.getDevicesListFun()
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
        },

        closeFun(){
             this.rowsData  = []

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


