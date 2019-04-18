<template>
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
        <el-button  size='small'   class="filter-item" type="primary" icon="el-icon-search"  @click='searchTableFun()'>提交</el-button>
    </div>
    
</template>

<script>
  
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
import bus from '@/main.js'
export default {
    data(){
        return{
            //table头部form搜索数据
            formTypeData:[ ],
            searchParams:{
                "table":"searchConf","attrs":{"modelType":"test"}
            },
            //弹窗的数据
            submitFormData:{} 
        }    
    },
    created(){
        this.getFormSearch()

    },
    methods:{
        //获取form中的搜索值
        getFormSearch(){
            getCommonFun(JSON.stringify(this.searchParams)).then(res=>{
                if(res.data.result=='ok'){
                    this.formTypeData = res.data.data
                }
            }) 
        },
           //条件搜索table
    searchTableFun(){
            //调用table组件的方法
            bus.$emit("tableFun", this.submitFormData,1);
            // this.getTableList(this.tableListParams)
        },
    }
   

}
</script>

<style>

</style>

