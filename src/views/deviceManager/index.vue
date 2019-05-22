<template>
  <div class="cont">
    <div class="button-cont">
      <el-button size="mini" type="primary" class="filter-item" icon="el-icon-download" style="margin-left: 10px;" @click="downloadVerDiaog(checkedDevIds)">版本下载</el-button>

    </div>
    <div class="table-allCont">
      <div class="table-cont">
        <el-form id="box" :inline="true" class="demo-form-inline">
          <el-form-item label="SIM卡号">
            <el-input v-model="conditions.conditions.dev_id[2]" size="small" placeholder="SIM卡号" />
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="conditions.conditions.erp_equipmentNO[2]" size="small" placeholder="设备编号" />
          </el-form-item>

          <el-form-item label="产品类型">
            <el-input v-model="conditions.conditions.erp_volume[2]" size="small" placeholder="产品类型" />
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="conditions.conditions.erp_customerName[2]" size="small" placeholder="客户名称" />
          </el-form-item>

          <el-form-item label="安装地址">
            <el-input v-model="conditions.conditions.erp_address[2]" size="small" placeholder="安装地址" />
          </el-form-item>
          <el-form-item label="版本号">
            <el-input v-model="conditions.conditions.Ver[2]" size="small" placeholder="版本号" />
          </el-form-item>

          <!-- <el-form-item label="状态">
                                <el-select v-model="conditions.Ver" size="small" placeholder="下载中" />
                            </el-form-item> -->
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTableDev" :data="serverDevInfos" border style="width:1000%" height="500" @select="HandleDeviceSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="dev_id" label="SIM卡号" align="center" />
          <el-table-column prop="erp_equipmentNO" label="设备编号" align="center" />
          <el-table-column prop="erp_volume" label="产品类型" align="center" />
          <el-table-column prop="erp_customerName" label="客户名称" align="center" />
          <el-table-column prop="erp_address" label="安装地址" align="center" />
          <el-table-column prop="Ver" label="版本号" align="center" />
          <el-table-column label="下载进度" align="center" width="200">
            <template slot-scope="{row}">
              <el-progress v-if="IsDownloading(row)" :percentage="getPercent(row)" :stroke-width="14" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="IsDownloading(scope.row)" size="mini" icon="el-icon-remove-outline" class="oneButton" type="danger" @click="handleStop(scope.row,scope.$index)">{{ getOperationText(scope.row) }}</el-button>
              <el-button v-else size="mini" icon=" el-icon-time" class="oneButton" type="primary" @click="downloadVerDiaog([scope.row.dev_id])">{{ getOperationText(scope.row) }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :current-page="pages.offset"
          :page-sizes="pagination.pageSizes"
          :page-size="pages.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog title="版本下载" :visible.sync="dialogVisible" width="1000px" height="300" @close="closeFun">
      <el-table ref="multipleTableText" :data="verTableData" border style="width:100%" height="500" @selection-change="handleVerSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="device_type" label="设备类型" align="center" />
        <el-table-column prop="name" label="文件类型" align="center" />
        <el-table-column prop="size" label="文件大小" align="center" />
      </el-table>
      <div class="downLoad-cont">
        <el-button size="mini" type="primary" class="filter-item" icon="el-icon-upload" @click="download()">确定下载</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
import { getDevicesList, getVerList, downloadFile, stopUpLoad } from '@/api/manager'
import { getObjectValues } from '@/utils'

// var data = []
export default {
  data() {
    return {
      pages: {
        offset: 1,
        limit: 10
      },
      conditions: {
        page_num: 10,
        curpage: 1,
        conditions: {
          'erp_equipmentNO': ['erp_equipmentNO', 'like', ''],
          'dev_id': ['dev_id', 'like', ''],
          'Ver': ['Ver', 'like', ''],
          'erp_volume': ['erp_volume', 'like', ''],
          'erp_address': ['erp_address', 'like', ''],
          'erp_customerName': ['erp_customerName', 'like', '']
        }
      },
      serverDevInfos: [],
      checkedDevIds: [],
      // checkedDevIds:[],
      verTableData: [],
      textDataParams: {
        conditions: []
      },
      dialogVisible: false,
      fileList: [],
      verChecked: [],
      downloadtextDataParams: { dev_id: '', ver_filename: '' },
      buttonShow: false,
      stopUpLoadParams: { dev_id: '' },
      sendedlen: '',
      filesize: '',
      rowsData: [],
      checkedDev: [],
      pagination: {// 分页相关
        pageSizes: [10, 20, 30, 50], // 初始化后台传值默认
        total: 0// 初始化后台传值默认
      }

    }
  },
  created() {
    this.getDevicesListFun({ page_num: this.conditions.page_num, curpage: this.conditions.curpage, conditions: getObjectValues(this.conditions.conditions) })
    // setInterval(()=>{this.getDevicesListFun();},1000*60);
  },
  methods: {
    getDevicesListFun(conditions) {
      getDevicesList(conditions).then(res => {
        if (res.data.status === 'ok') {
          this.serverDevInfos = JSON.parse(res.data.result.result)
          // console.log(this.serverDevInfos)
          this.pagination.total = res.data.result.count
          // console.log(1, this.serverDevInfos)
          this.$nextTick(() => {
            this.SetSelection(this.checkedDevIds)
          })
        }
      })
    },
    SetSelection(rows) {
      var _this = this
      this.$refs.multipleTableDev.clearSelection()
      if (rows) {
        rows.forEach(function(row) {
          var selected = _this.serverDevInfos.find((i) => i.dev_id === row)
          _this.$refs.multipleTableDev.toggleRowSelection(selected)
        })
      } else {
        this.$refs.multipleTableDev.clearSelection()
      }
    },
    IsDownloading(Row) {
      // return Row.status=="downloading" || Row.status=="waiting";
      return Row.status !== 'online'
    },
    getOperationText(row) {
      if (row.status === 'done') return '完成确认'
      if (row.status === 'online') {
        return '下载'
      } else { return '停止' }
    },
    getPercent(row) {
      if (row.status === 'done') return 100
      return Math.min(row && row.sendedlen && row.sendedlen && row.filesize && parseInt(row.sendedlen / row.filesize * 1000) / 10 || 0, 99.9)
    },
    VerTableDataListFun() {
      getVerList(JSON.stringify(this.textDataParams)).then(res => {
        if (res.data.status === 'ok') {
          this.verTableData = res.data.result
        }
      })
    },
    HandleDeviceSelectionChange(val, rows) {
      this.checkedDevIds = val.map(i => i.dev_id)
    },
    HandleDeviceSelectionChangeAll(val) {
      this.checkedDevIds = val.map(i => i.dev_id)
    },
    handleVerSelectionChange(val) {
      this.verChecked = val
    },
    downloadVerDiaog(rows) {
      this.rowsData = rows
      if (this.rowsData && this.rowsData.length > 0) {
        this.checkedDev = this.rowsData
        this.dialogVisible = true
        // data = this.checkedDev

        this.VerTableDataListFun()
      } else {
        this.$message({
          message: '请选择设备进行操作',
          type: 'warning'
        })
        return false
      }
    },
    download() {
      if (!(this.verChecked.length === 1)) {
        this.$message({
          message: '请选择一条文件数据进行操作',
          type: 'warning'
        })
        return false
      } else {
        // var _this = this
        const objNew = JSON.stringify(this.downloadtextDataParams)

        const obj = JSON.parse(objNew)
        obj.ver_filename = this.verChecked[0].name

        obj.dev_id = this.checkedDev
        downloadFile(obj).then(res => {
          if (res.data.status === 'ok') {
            this.getDevicesListFun() //
            this.dialogVisible = false
          }
        })
      }
    },
    handleStop(row, index) {
      const objNew = JSON.stringify(this.stopUpLoadParams)
      const obj = JSON.parse(objNew)
      obj.dev_id = row.dev_id
      stopUpLoad(JSON.stringify(obj)).then(res => {
        this.getDevicesListFun() //
      })
    },

    closeFun() {
      this.rowsData = []
    },
    onSubmit() {
      this.getDevicesListFun({ page_num: this.conditions.page_num, curpage: this.conditions.curpage, conditions: getObjectValues(this.conditions.conditions) })
    },
    handleSizeChange(limit) {
      this.getDevicesListFun({ page_num: limit, curpage: this.conditions.curpage, conditions: getObjectValues(this.conditions.conditions) })
    },
    handleCurrentChange(offset) {
      // console.log(offset);

      this.getDevicesListFun({ page_num: this.conditions.page_num, curpage: offset, conditions: getObjectValues(this.conditions.conditions) })
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

