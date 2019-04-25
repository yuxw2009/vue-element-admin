<template>
     <el-dialog :title="dialogTitle" :visible.sync="setAddVisible" width="500px">
        <el-form  label-width="80px">
            <div v-for='(item,index) in formList'  :key='index'>
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
</template>
<script>
export default {
    props:['formLists','editData'],
    data(){
        return{
            dialogTitle:'',
            setAddVisible:false,
            dialogSuccessData:{},
            formList:[]
        }
    },
    created(){
    },
    watch:{
        editData:{
            handler(n,o){
                this.dialogSuccessData = this.editData;
                console.log(this.dialogSuccessData)
                // console.log(this.coverFormList)
            }
        },
        formLists:{
            handler(n,o){
                this.formList = this.formLists;
                console.log(2,this.formList)
                // console.log(this.coverFormList)
            }
        }
    },
    methods:{
        //打开弹窗事件
        openDialog(clickType,name){
            this.dialogSuccessData = {}
            this.setAddVisible = true;
            this.dialogTitle = name
        },
        // 提交数据事件
        dialogSubmit(){
            let objNew = JSON.stringify(this.dialogSuccessData);
            let obj = JSON.parse(objNew);
            for(var key in obj){
                if(key.indexOf(".")>-1){
                    let arr = key.split(".");
                   
                    if(!obj.hasOwnProperty(arr[0])){
                        obj[arr[0]] = {}
                    }
                    
                    obj[arr[0]][arr[1]]=obj[key]
                    delete obj[key]
                }
                
            }
            //回调父级方法（name）
            // 子组件中触发父组件方法ee并传值cc12345
            this.$emit('formSubmit', obj);          
            },
        // 取消提交
        dialogCancel(){
            this.setAddVisible = false;
        }
        

    }

}
</script>

<style scoped>
.el-dialog{
    margin-top:0px !important;
}
.button-cont{
        text-align: center;
}


</style>
