<template>
  <div class="app-container">

    <el-row class="filter-container" :gutter="20" style="margin-bottom: 20px">
      <el-col :span="2"><el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAccountAdd">新增账号</el-button></el-col>
    </el-row>
    <!-- 增加账号弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="accountAddVisible">
      <el-form :model="accountTemp" label-width="80px">
        <div v-show="dialogTitle == '增加账号'">
          <el-form-item label="账号">
            <el-input v-model="accountTemp.username" size="small" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="accountTemp.password" size="small" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select size="small" v-model="accountTemp.role" placeholder="请选择用户角色">
              <el-option label="管理员" value="admin" ></el-option>
              <el-option label="用户" value="user" ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="权限值"  v-if='add'>
          <el-button size="small" type="primary" icon="el-icon-tickets" @click="dialogFilterAdd">增加权限值</el-button>
          <el-table :data="accountTemp.filters" style="width: 100%; margin-top:10px; margin-bottom:10px" size="small" border>
            <el-table-column prop="key" label="权限名称" min-width="160">
              <template slot-scope="scope">
                <el-select v-model="scope.row.key" size="small" placeholder="请选择权限名称">
                  <el-option v-for="item in filterKeyItems" :key="item.value" :label="item.name" :value="item.value" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="op" label="查询条件" min-width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.op" size="small" placeholder="请选择查询条件">
                  <el-option label="包含" value="like" />
                  <el-option label="等于" value="=" />
                  <el-option label="不等于" value="!=" />
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="value" label="查询值" min-width="110">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" size="small" />
              </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" align="center" min-width="80">
              <template slot-scope="scope">
                <el-button size="small" type="danger" @click="dialogFiltersDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button v-if="modify_filter_flag" type="primary" size="small" @click="modifyDialogSubmit">确认</el-button>
          <el-button v-else type="primary" size="small" @click="dialogSubmit">确认</el-button>
          <el-button size="small" @click="dialogCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 菜单权限设置弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="accountMenuVisible" :data="list" width="300px" style="’‘">
      <div class="custom-tree-container">
        <div class="block" style="margin-bottom:30px">
       
          <el-tree
            ref="tree"
            :data="data4"
            show-checkbox
            default-expand-all
            node-key="path"
            highlight-current
            :props="defaultProps"
          />

        </div>
        <span slot="footer" class="dialog-footer" style="margin:20px  0">
          <el-button type="primary" size="small" @click="submitMenu()">确 定</el-button>
          <el-button size="small" @click="dialogMenu">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 客户账户权限设置弹框 -->
    <el-table ref="crudTable" v-loading="listLoading" :data="list" style="width: 100%; margin: 0 auto" height="550" border stripe>
      <el-table-column label="用户名" align="center"   prop="username" class="el-table-column" min-width="100px" />
      <!-- <el-table-column label="角色" prop="role" class="el-table-column" min-width="100px"></el-table-column> -->
      <el-table-column type="expand" label=" " width="60">
        <template slot-scope="props">
          <el-row class="filter-container" style="margin-bottom: 20px">
            <el-col :span="13" :offset="11">
              <el-table ref="crudTable" v-loading="listLoading" :data="props.row.filters" size="mini" border>
                <el-table-column label="权限名称" align="center"  prop="key" class="el-table-column" min-width="100px">
                  <template slot-scope="scope1">
                    {{ getname(scope1.row.key) }}
                  </template>
                </el-table-column>
                <el-table-column label="查询条件" align="center" prop="op" class="el-table-column" min-width="100px" />
                <el-table-column label="查询值"  align="center" prop="value" class="el-table-column" min-width="100px" />
              </el-table>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column label="权限值" prop="filterkeys"   align="center" class="el-table-column" min-width="100px" />
      <el-table-column label="操作" width="500" align="center">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="handleRole(scope.$index, scope.row)">修改角色</el-button> -->
          <el-button size="mini" type="primary" @click="handleFilters(scope.$index, scope.row)">客户账户权限设置</el-button>
          <el-button size="mini" type="primary" @click="handleMenu(scope.$index, scope.row)">菜单权限设置</el-button>
          <el-button size="mini" type="primary" @click="handlePassword(scope.$index, scope.row)">重置密码</el-button>
           <el-button size="mini" type="primary" @click="delAccount(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { addAccount, getAccountList, updateFilters, resetPassword, menuFilters,isdelAccount } from '@/api/account'
import { setToken } from '@/utils/auth'
// import Cookies from 'js-cookie'
export default {
  name: 'AccountManage',
  data() {
    const data = [{
      label: '系统配置',
      path:'/systemManager',
      children: [
        {
          path: '/systemManager/accountManage',
          label: '权限设置'
        },
         {
          path: '/systemManager/tableCommomConfig',
          label: '通用配置'
        }
      ]
    },
    {
      label: '客户信息',
      path:'/customerManager',
      children: [
         {
          path: '/customerManager/equipmentManage',
          label: '设备管理'
      }

      ]
    }
   
   ]
    return {
      add:false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treePath: [],
      data4: JSON.parse(JSON.stringify(data)),
      accountAddVisible: false,
      accountMenuVisible: false,
      dialogVisible: false,
      menuJurisdiction: [],
      accountTemp: {
        username: '',
        password: '',
        role: '',
        filters: []
      },
      filterKeyItems: [
        { name: '设备编号', value: 'equipmentNO' },
        { name: 'SIM卡号', value: 'SimNO' },
        { name: '客户', value: 'clientele' },
        { name: '产品类型', value: 'Volume' },
        { name: '安装位置', value: 'location' },
        { name: '安装地址', value: 'address' }
      ],
      list: [],
      listLoading: false,
      modify_filter_flag: false, // 弹窗确认按钮切换
      dialogTitle: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getCurrentKey(data) {
      const treeDate = data
    },
    getname(key) {
      for (var i = 0; i < this.filterKeyItems.length; i++) {
        if (key === this.filterKeyItems[i].value) {
          return this.filterKeyItems[i].name
        }
      }
      return ''
    },
    getList() {
      this.listLoading = true
      getAccountList().then(response => {
        this.list = []
        response.data.result.forEach(element => {
          const listTemp = {}
          listTemp.username = element.username[1]
          listTemp.filters = []
          listTemp.filterkeys = ''
          listTemp.right = element.right
          element.filters.forEach(item => {
            const filterTemp = {}
            filterTemp.key = item.key
            filterTemp.op = item.op
            filterTemp.value = item.value
            listTemp.filterkeys = this.getname(item.key) + '' + listTemp.filterkeys
            listTemp.filters.push(filterTemp)
          })
          this.list.push(listTemp)
        })

        this.listLoading = false
      })
    },
    delAccount(index,data){
       this.$confirm('删除此账户', '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var  sendData = {"table":"user_permission_t","key":["new_oam",data.username]}
          isdelAccount(sendData).then(res=>{
              this.list.splice(index,1)
             this.$message({
            type: 'success',
            message: '删除成功!'
          });
          })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });   
    },
    handleAccountAdd() { // 增加账号按钮事件
      this.accountTemp.username = ''
      this.accountTemp.password = ''
      this.accountTemp.filters = []
      this.dialogTitle = '增加账号'
      this.modify_filter_flag = false
      this.accountAddVisible = true
    },
    handleFilters(index, row) { //
      this.add = true;
      this.accountTemp.username = row.username
      this.accountTemp.filters = row.filters
      this.dialogTitle = '客户账户权限设置'
      this.modify_filter_flag = true
      this.accountAddVisible = true
    },
    treeNode() {
      this.menuJurisdiction.length = 0
      const treeCheckedData =this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      for (var i = 0; i < treeCheckedData.length; i++) {
          const jsonData = {
            path: treeCheckedData[i]
          }
          this.menuJurisdiction.push(jsonData)
          
      }
    },
    // 修改菜单权限设置提交
    submitMenu() {
      this.treeNode()
      // let accountSended = {table:"user_permission_t",key:["new_oam",this.accountTemp.username],attrs:{"right": [{"path":`${this.accountTemp.right[0].path}`},{"path":`${this.accountTemp.right[1].path}`}] }};
      // console.log(JSON.stringify(accountSended))
      const accountSended = { table: 'user_permission_t', key: ['new_oam', this.accountTemp.username], attrs: { 'right': this.menuJurisdiction }}
      menuFilters(JSON.stringify(accountSended)).then(response => {
        this.$message('修改成功')
        //  actions:{
        //     getMenuAction:({commit}) =>{
        //          commit('SET_TOKEN',this.menuJurisdiction)
        //     }
        // }
        // setToken(this.menuJurisdiction)
        this.getList()
      }).catch(error => {
        this.$message('修改失败')
      })
      this.accountMenuVisible = false
    },
    // 密码重置
    handlePassword(idnex, row) {
      this.$confirm('确认重置密码为:888888？').then(_ => {
        resetPassword(JSON.stringify({ 'username': ['new_oam', row.username] })).then(response => {
          this.$message('密码已重置')
        }).catch(error => {
          this.$message('重置失败')
          console.log(error)
        })
      })
        .catch(_ => {
          this.$message('已取消重置')
        })
    },
    
    // 点击菜单权限设置动态渲染
    handleMenu(index, row) {
       Array.prototype.removeByValue = function(val) {
      for(var i = 0; i < this.length; i++) {
        if(this[i] == val) {
          this.splice(i, 1);
          break;
        }
      }
    }
      this.treePath.length = 0
      // 权限的默认选中的回显
      var  parentPath = [];
      for(var i = 0; i < this.data4.length; i++){
        if(this.data4[i].children){
             parentPath.push(this.data4[i].path)
        }
        
      }
      if (row.right != undefined && row.right.length > 0) {
        this.treePath.length = 0
        var arrar = []
        for (var i = 0; i < row.right.length; i++) {
           arrar.push(row.right[i].path)
        }
        
        for(var  q = 0; q < parentPath.length; q++){
            arrar.removeByValue(parentPath[q]);
        }
        this.treePath =arrar
      } else {
        this.treePath = []
        // this.treePath.length = 0;
      }
      //数组去重
      
    

      this.dialogTitle = '菜单权限设置'
      this.accountTemp.username = row.username
      // this.accountTemp.filters = row.filters
      this.accountTemp.right = row.right
      // console.log(row.right)
      // localStorage.setItem('right', JSON.stringify(row.right))
      this.accountMenuVisible = true
      this.$nextTick(function() {
        this.$refs.tree.setCheckedKeys(this.treePath)
      })
    },
    dialogFiltersDelete(index, row) {
      this.accountTemp.filters.splice(index, 1)
    },
    // 新增账号提交
    dialogSubmit() { //
      this.treeNode()
      const accountSended = {
        username: ['new_oam', this.accountTemp.username],
        password: this.accountTemp.password,
        // filters: this.accountTemp.filters,
        // attrs: { 'right': this.menuJurisdiction }
        // right：this.accountTemp.right
      }
      addAccount(JSON.stringify(accountSended)).then(response => {
        this.$message('增加成功')
        this.getList()
        // console.log(response)
      }).catch(error => {
        this.$message('增加失败')
        console.log(error)
      })

      this.accountAddVisible = false
    },
    // 修改客户账户权限设置
    modifyDialogSubmit() { //
   
      const accountSended = { table: 'user_permission_t', key: ['new_oam', this.accountTemp.username], attrs: { filters: this.accountTemp.filters, right: this.menuJurisdiction }}
      // console.log(JSON.stringify(accountSended))
      updateFilters(JSON.stringify(accountSended)).then(response => {
        this.$message('修改成功')
        this.getList()
        console.log(response)
      }).catch(error => {
        this.$message('修改失败')
        console.log(error)
      })

      this.accountAddVisible = false
    },
    dialogFilterAdd() { // 弹窗增加权限值按钮
      const item = {
        key: '',
        op: '',
        value: ''
      }
      this.accountTemp.filters.push(item)
      this.accountAddVisible = true
    },
    dialogCancel() { // 弹窗关闭按钮
      this.$message('已取消')
      this.accountAddVisible = false
    },
    dialogMenu() {
      this.$message('已取消')
      this.accountMenuVisible = false
    }
  }
}
</script>

<style>
.el-table td, .el-table th{
  padding:5px  0;
}
.el-table__expanded-cell[class*=cell] {
    padding: 2px 0 10px ;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree{
  margin-top:10px;
  margin-bottom:10px
}
.el-dialog{
  text-align: center;
}
</style>
