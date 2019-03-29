<template>
  <div class="app-container" style="height:100%">

    <el-form id="box" :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="设备编号">
        <el-input v-model="listQuery.equipmentNO" size="small" placeholder="设备编号" />
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="listQuery.simcard" size="small" placeholder="SIM卡号" />
      </el-form-item>

      <el-form-item label="安装位置">
        <el-input v-model="listQuery.location" size="small" placeholder="安装位置" />
      </el-form-item>

      <el-form-item label="安装地址">
        <el-input v-model="listQuery.address" size="small" placeholder="安装地址" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table id="table" ref="crudTable" v-loading="listLoading" :data="maps" :height="tableHeight" border>
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" label="设备编号" prop="equipmentNO" class="el-table-column" width="250" />
      <el-table-column align="center" label="sim卡号" prop="simcard" class="el-table-column" width="300" />
      <el-table-column align="center" label="客户名称" prop="clientele" class="el-table-column" width="300" />
      <el-table-column align="center" label="产品型号" prop="volume" class="el-table-column" width="250" />
      <el-table-column align="center" label="安装地址" prop="address" class="el-table-column" width="250" />
      <el-table-column align="center" label="安装位置" prop="location" class="el-table-column" width="250" />
      <el-table-column align="center" label="滤芯信息" prop="filters" class="el-table-column" width="500">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.filters " :key="index" size="mini" style="margin-bottom:5px; margin-right:5px">
            <el-tag v-if="item.life>0">{{ item.ord +'级：'+ '正常' }}</el-tag>
            <el-tag v-else type="danger">{{ item.ord +'级：'+ '异常' }}</el-tag>
          </span>

        </template>
      </el-table-column>
      <el-table-column align="center" label="在线状态" prop="detail.onlineState" class="el-table-column">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.detail && scope.row.detail.onlineState === '离线'" type="danger">{{ scope.row.detail&&scope.row.detail.onlineState }}</el-tag>
          <el-tag v-else>{{ scope.row.detail && scope.row.detail.onlineState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总用水量" prop="detail.totalFlow" class="el-table-column" />
      <el-table-column align="center" label="操作" prop=" " class="el-table-column" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEveryUse(scope.row)">每次记录</el-button>
          <el-button size="mini" type="primary" @click="handleDayUse(scope.row)">每天记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="listQuery.offset"
      :page-sizes="pagination.pageSizes"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="每日上报数据" :visible.sync="isDayUsePopupVisible" height="400px">
      <el-table :data="dayUseList" style="width: 100%" size="small" border height="400">

        <el-table-column prop="time" label="日期" min-width="250" />
        <el-table-column prop="flow" label="用水量" min-width="250" />
      </el-table>
      <el-pagination
        background
        small
        :current-page="dayUseQuery.offset"
        :page-sizes="pagination.pageSizes"
        :page-size="dayUseQuery.limit"
        layout="total, sizes, prev, pager, next"
        :total="dayUseQuery.total"
        @size-change="handleSizeChange_day"
        @current-change="handleCurrentChange_day"
      />
    </el-dialog>
    <el-dialog title="每次上报数据" :visible.sync="isEveryUsePopupVisible" height="400px">

      <el-table :data="everyUseList" style="width: 100%" size="small" border height="400">
        <el-table-column prop="time" label="时间" min-width="200" />
        <el-table-column prop="flow" label="用水量" min-width="200" />
      </el-table>
      <el-pagination
        background
        small
        :current-page="everyUseQuery.offset"
        :page-sizes="everyUseQuery.pageSizes"
        :page-size="everyUseQuery.limit"
        layout="total, sizes, prev, pager, next"
        :total="everyUseQuery.total"
        @size-change="handleSizeChange_every"
        @current-change="handleCurrentChange_every"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getEquipmentList, getFilterList, getDayUseList, getEveryUseList, getEquipmentDetail } from '@/api/equipment'
import Cookies from 'js-cookie'

export default {
  name: 'EquipmentMnage',
  data() {
    return {
      tableHeight: 0,
      dayUseViewRates: {},
      formInline: {
        user: '',
        region: ''
      },
      list: [],
      maps: [],
      listLoading: false,

      listQuery: {// 分页相关
        offset: 1, // 初始化后台传值默认1
        limit: 20, // 初始化后台传值默认10

        equipmentNO: '',
        simcard: '',
        location: '',
        address: '',

        conditions: []
      },
      pagination: {// 分页相关
        pageSizes: [10, 20, 30, 50], // 初始化后台传值默认【10，20，30，40】
        total: 0// 初始化后台传值默认100
      },
      isDayUsePopupVisible: false,
      isEveryUsePopupVisible: false,

      // 每日上报数据数据
      dayUseList: [],
      dayUseQuery: {
        limit: 10,
        offset: 1,
        equipmentNo: '',
        row: '',
        total: 0,
        pageSizes: [10, 20, 30, 50]
      },
      everyUseList: [],
      everyUseQuery: {
        limit: 10,
        offset: 1,
        equipmentNo: '',
        row: '',
        total: 0,
        pageSizes: [10, 20, 30, 50]
      }

    }
  },
  created() {
    this.getWindow_height()
    this.getList()
  },
  mounted() {
    window.onresize = () => {
      this.getWindow_height()
    }
  },
  methods: {
    getWindow_height() {
      if (window.innerHeight) {
        var winHeight = window.innerHeight
      } else if ((document.body) && (document.body.clientHeight)) {
        var winHeight = document.body.clientHeight
      }

      this.$nextTick(function() {
        var boxHeight = document.getElementById('box')
        var contentHeight = boxHeight.offsetHeight
        var table = document.getElementById('table')
        this.tableHeight = (winHeight - contentHeight) - 150
      })
    },
    getList() {
      this.listLoading = true
      this.listQuery.conditions = JSON.parse(Cookies.get('userData')).filters
      // 获取设备
      getEquipmentList(this.listQuery).then(response => {
        console.log(response)
        this.maps = response.data.rows
        const filtersTemp = []
        response.data.rows.forEach(element => {
          filtersTemp.push(element.equipmentNO)
        })
        // 获取滤芯
        getFilterList({ equipmentNos: filtersTemp }).then(response => {
          let filters
          this.maps.forEach((map, i) => {
            filters = new Array()
            response.data.forEach(element => {
              if (map.equipmentNO == element.equipmentNo) {
                filters.push(element)
              }
            })
            this.$set(this.maps[i], 'filters', filters)
          })
        })
        // 获取详情
        getEquipmentDetail({ equipmentNos: filtersTemp }).then(response => {
          response.data.forEach((detail, i) => {
            for (let i = 0; i < this.maps.length; i++) {
              if (detail.equipmentNo == this.maps[i].equipmentNO) {
                const strTemp = detail.totalFlow.split(',')
                detail.totalFlow = strTemp.join('')
                this.$set(this.maps[i], 'detail', detail)
                break
              }
            }
          })
        })
        this.pagination.total = response.data.total
        this.listLoading = false
      })
    },
    handleSizeChange(limit) {
      this.listQuery.limit = limit
      this.getList()
    },
    handleCurrentChange(offset) {
      this.listQuery.offset = offset
      this.getList()
    },
    onSubmit() {
      this.getList()
    },
    get_width(equipmentNO) {
      return (this.dayUseViewRates[equipmentNO] || 1) * 200 + 'px'
    },
    get_height(equipmentNO) {
      return (this.dayUseViewRates[equipmentNO] || 1) * 150 + 'px'
    },

    // 每日上报数据函数
    handleDayUse(row) {
      if (row) this.dayUseQuery.row = row
      row = this.dayUseQuery.row
      this.dayUseQuery.equipmentNo = row.equipmentNO
      getDayUseList(this.dayUseQuery).then(res => {
        this.dayUseList = res.data.rows
        this.dayUseQuery.total = res.data.total
      })
      // getDayUseList({limit:10,offset:1,equipmentNo:row.equipmentNO}).then(res=>{
      //   this.dayUseList=res.rows;
      // })
      this.isDayUsePopupVisible = true
    },
    // 每次上报数据函数
    handleEveryUse(row) {
      if (row) this.everyUseQuery.row = row
      row = this.everyUseQuery.row
      this.everyUseQuery.equipmentNo = row.equipmentNO
      getEveryUseList(this.everyUseQuery).then(res => {
        this.everyUseList = res.data.rows
        this.everyUseQuery.total = res.data.total
      })
      this.isEveryUsePopupVisible = true
    },

    handleSizeChange_day(limit) {
      this.dayUseQuery.limit = limit
      this.handleDayUse()
    },
    handleCurrentChange_day(offset) {
      this.dayUseQuery.offset = offset
      this.handleDayUse()
    },
    handleSizeChange_every(limit) {
      this.everyUseQuery.limit = limit
      this.handleEveryUse()
    },
    handleCurrentChange_every(offset) {
      this.everyUseQuery.offset = offset
      this.handleEveryUse()
    },

    echartsBig(equipmentNo) {
      this.dayUseViewRates[equipmentNo] = 3
    }

  }
}

window.onresize = function() {
  app.getWindow_height()
}

</script>

<style >
  #app .main-container{
  }
  .app-main[data-v-6beed8bc] {
  }
  #app {
    overflow: hidden;
}
   .el-pagination {
     margin-top:10px;
  }
.el-table thead.is-group th{
  padding:0

}
</style>
