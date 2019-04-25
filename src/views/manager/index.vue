
<template>
    <div>
        <el-table  ref="multipleTable" :data="deviceTableData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange"> 
             <el-table-column prop="address" label="地址" align="center"> </el-table-column>
        </el-table>
    </div>
   
   
</template>

<script>
export default {
    data(){
        return  {
            deviceTableData:[
                    {
                        address: '上海市普陀区金沙江路 1518 弄'
                     },
            ]

        }
    },
    created(){
      console.log(1)
     
    },
    methods:{
        handleSelectionChange(val){
            

        }
    }

}
</script>

<style>

</style>

