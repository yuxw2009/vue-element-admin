<template>
     <el-dialog :title="dialogTitle" :visible.sync="setAddVisible">
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
          <el-form-item>
            <!-- <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button> -->
            <el-button type="primary" size="small" @click="dialogSubmit()">确认</el-button>
            <el-button size="small" @click="dialogCancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
</template>

<script>
export default {

}
</script>

<style>

</style>
