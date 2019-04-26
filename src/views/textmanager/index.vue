
<template>
    <div class='cont'>
        <div class='button-cont'>
             <el-button size='mini'  type="primary"  class="filter-item"  icon='el-icon-upload2' style="margin-left: 10px;" @click='uploadText()'>版本上传</el-button>          
        </div>
        <div class='table-allCont'>

                <div class='table-cont table-cont2'>
                        <el-table  ref="multipleTable" :data="textTableData" border style="width:100%"  height='500'  @selection-change="handleTextSelectionChange"> 
                        <el-table-column type="selection" width="55"  align="center">  </el-table-column>
                        <el-table-column prop="device_type" label="设备类型" align="center"> </el-table-column> 
                        <el-table-column prop="name" label="文件类型" align="center"> </el-table-column>      
                        <el-table-column prop="size" label="文件大小" align="center"> </el-table-column>                  
                    </el-table>
                </div>
        </div>
       <el-dialog title="版本上传"  :visible.sync="dialogVisible"  width="400px"  height='300' > 
                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="http://priv.x9water.com:18080/upload_ver.yaws"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :on-success='handlesuccess'
                    :on-error='handleerror'
                    :auto-upload="false">
                    <div class='upload-button'>
                        <el-button   class='buttonText' icon='el-icon-zoom-out' slot="trigger" size="mini" type="primary">选取文件</el-button>
                    </div>
                </el-upload>
                <el-button  class='buttonText  buttonText2' icon='el-icon-upload' style="margin-left: 10px;" size="mini" type="success" @click="submitUpload()">上传到服务器</el-button>
        </el-dialog>
    </div>

</template>
<script>
import {getDevicesList,getTextList,downloadFile} from '@/api/manager'
export default {
    data(){
        return  {
            textTableData:[],
            textDataParams:{
                conditions:[]
            },
            dialogVisible:false,
             fileList:[],
             textChecked:[],
             textDataParams:{dev_id:'',ver_filename:""},
        }
    },
    created(){
        this.fileList = []
        this.textTableDataListFun()
      
    },
    methods:{
        submitUpload() {
            if(this.fileList.length==0){
                this.$message({
                    message: '请选择需要上传的文件',
                    type: 'error'
                });
                return  false;

            }
             this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
      },
      handleerror(err, file, fileList){


      },
        handlePreview(file) {
        },
        handleSelectionChange(val){
        
        },
        handlesuccess(response, file, fileList){
            if(file.response.status=='ok'){
                  this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                    this.dialogVisible = false
                    this.fileList = []


            }
        },
       
        textTableDataListFun(){         
             getTextList(JSON.stringify(this.textDataParams)).then(res=>{  
                if(res.data.status=='ok'){
                    this.textTableData = res.data.result

                }   
              
        
            })
        },
      uploadText(){
            this.dialogVisible = true;
        },
     
         handleTextSelectionChange(val){
            this.textChecked = val

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
    .upload-demo{
       height:300px;
        text-align: center;
   }
 
    .el-upload-list{
        text-align: center;
       
    }
    .el-progress-bar__outer{
        height:14px;
    }
    .buttonText2{
        position: absolute;
        top: 84px;
        left: 202px;
    }
    .buttonText{
      margin-left: -174px;
      margin-bottom: 10px;


    }
    
</style>

