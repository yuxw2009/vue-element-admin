<template>
    <div>
        <!-- 头部按钮 -->
        <div class='bottom'>
            <el-button size='mini' v-for='(item,index) in commomButtonData'   :key='index' 
            class="filter-item" style="margin-left: 10px;" :type="item.colorType" :ord='item.ord'   @click='opneCover(item.clickType,item.name)' >{{item.name}}
            </el-button> 
        </div>
       <Dialog ref='dialog' :coverFormList='coverFormList' :editData='editData' @formSubmit='formSubmit'  ></Dialog>
    </div>
    
</template>

<script>
import bus from '@/main.js'
import {getCommonFun,addCommonFun,updateCommonFun,deleteCommonFun} from '@/api/tableCommom'
import Dialog from '../dialog'
export default {
    props:['tableName','coverFormList'],
    components:{
        Dialog
    },
    data(){
        return{
            //弹窗添加确定的接口
            addFormParams:{"table":"menuConf","attrs":{}},
            getUpdateDataParams:{"table":"menuConf","attrs":{}},
            delFormParams:{"table":"menuConf","attrs":{}},
            updateFormParams:{"table":"menuConf","updates":{},"attrs":{}},
            fatherSelect:[],
            childSelect:[],
            commomButtonData:[
                {"modelType":"test","name":"添加","icon":"","colorType":"primary","ord":1,"clickType":'add'},
                {"modelType":"test","name":"编辑","icon":"","colorType":"primary","ord":2,"clickType":'edit'},
                {"modelType":"test","name":"删除","icon":"","colorType":"primary","ord":3,"clickType":'del'},
                {"modelType":"test","name":"添加子菜单","icon":"","colorType":"primary","ord":4,"clickType":'addChildren'},
                 {"modelType":"test","name":"配置属性","icon":"","colorType":"primary","ord":5,"clickType":'device'}          
            ],
            opt:"",
            editData:{}
        }
    },
    created(){
    },
     mounted(){
        var  _this = this;
        //在search中调用的
        bus.$on("checkeFun", function(fatherSelect, childSelect) {
            //  _this.fatherSelect = msg;
            // console.log(11,fatherSelect,childSelect)
             _this.fatherSelect = fatherSelect;
             _this.childSelect = childSelect;
        });
    },
    methods:{
        //打开弹窗
        opneCover(clickType,name){
            console.log(this.fatherSelect, this.childSelect)
            this.opt=clickType;
            if(clickType=='add'){   
              //修改功能                  
                this.editData = {}
                this.$refs.dialog.openDialog(clickType,name); 
            }else{

                if(!(this.fatherSelect.length + this.childSelect.length==1)){
                    this.$message({
                        message: '请选择一条，需要修改的记录',
                        type: 'warning'
                    });
                    return false;
                }
                 if(clickType=='edit'){
                     this.editOpen(clickType,name);
                 }else if(clickType=='del'){
                    let objNew = JSON.stringify(this.delFormParams);
                    let obj = JSON.parse(objNew);
                    if(this.fatherSelect.length>0){
                        obj.attrs['_id'] = this.fatherSelect[0]['_id']

                        this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            console.log(JSON.stringify(obj))
                            deleteCommonFun(JSON.stringify(obj)).then(res=>{ 
                                if(res.data.result=='ok'){
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                     this.$emit('fatherMethod');
                                    // bus.$emit("tableFun");
                                
                                }
                                    
                            })
                        
                        }).catch(() => {
                        // this.$message({
                        //   type: 'info',
                        //   message: '已取消删除'
                        // });          
                        });
                    }else{
                        obj.attrs['_id'] = this.childSelect[0]['_id'] 
                    }
        
                 }else if(clickType=='addChildren'){
                    if(!(this.fatherSelect.length==1 && this.childSelect.length==0)){
                        this.$message({
                            message: '请选择一条父级菜单',
                            type: 'warning'
                        });
                        return false;
                    }
                    this.$refs.dialog.openDialog(clickType,name); 
                    
                    //打开弹出层

                    

                 }else if(clickType=='device'){

                
                }
            }
        
        },
        editOpen:function(clickType,name){
            // let objNew = JSON.stringify(this.updateFormParams);
            // let obj = JSON.parse(objNew);
            if(this.fatherSelect.length>0){
                //先去获取数据
                    let objNew = JSON.stringify(this.getUpdateDataParams);
                     let obj = JSON.parse(objNew);
                    obj.attrs['_id'] = this.fatherSelect[0]['_id']
                    console.log(JSON.stringify(obj))

                    getCommonFun(JSON.stringify(obj)).then(res=>{          
                      
                        if(res.data.result=='ok'){
                            
                            this.editData = res.data.data[0]
                            console.log(this.editData)
                            //打开弹出层，获取默认值
                            this.$refs.dialog.openDialog(clickType,name);


                        
                        }
                    }) 


            }else{
                this.editData = this.childSelect[0]
                console.log(this.editData)
                //打开弹出层，获取默认值
                this.$refs.dialog.openDialog(clickType,name);
                
            }
        },
        formSubmit(formData){
            console.log(formData)
            if(this.opt=="add"){
                let objNew = JSON.stringify(this.addFormParams);
                let obj = JSON.parse(objNew);
                obj.attrs = formData
                // console.log(JSON.stringify(obj))
                // return false;
                addCommonFun(JSON.stringify(obj)).then(res=>{          
                    console.log(res)     
                    if(res.data.result=='ok'){
                        //调用父级函数刷新表格
                         this.$emit('fatherMethod');
                         
                         //调用弹窗函数关闭弹出层
                        this.$refs.dialog.dialogCancel(); 
                    }
                })    
            }else if(this.opt=='edit'){
                
                if(this.fatherSelect.length>0){
                    let objNew = JSON.stringify(this.updateFormParams);
                    let obj = JSON.parse(objNew);
                    obj.attrs['_id'] = formData._id
                    delete formData['_id'];
                    obj.updates= formData;
                    console.log(JSON.stringify(obj))
                    // return false;
                    updateCommonFun(JSON.stringify(obj)).then(res=>{          
                        if(res.data.result=='ok'){
                            console.log(res.data)
                            //调用父级函数刷新表格
                            this.$emit('fatherMethod');
                                
                            //调用弹窗函数关闭弹出层
                            this.$refs.dialog.dialogCancel(); 
                        }
                    })
                }else{
                    //获取父级数据
                    let objNew = JSON.stringify(this.getUpdateDataParams);
                    let obj = JSON.parse(objNew);
                    obj.attrs['_id'] = formData._id
                    console.log(JSON.stringify(obj))

                    getCommonFun(JSON.stringify(obj)).then(res=>{          
                      
                        if(res.data.result=='ok'){
                            
                            //替换修改的子集数据
                            let fdata = res.data.data[0]
                            let child = fdata.children;
                            // let flag=-1;
                            for(let i=0;i<child.length;i++ ){
                                if(child[i].path==formData.path){
                                    delete formData['_id']
                                    child[i]=formData;
                                    // flag=i;
                                    break;
                                }
                            }
                            // fdata.children = child;
                            // if(flag>-1){
                            //     //删除旧数据
                            //     child.splice(flag, 1);
                            //     //插入新数据
                            // }
                            //更新
                            //打开弹出层，获取默认值
                            // this.$refs.dialog.openDialog(clickType,name);

                            // console.log(9,JSON.stringify(fdata))
                            objNew = JSON.stringify(this.updateFormParams);
                            obj = JSON.parse(objNew);
                            obj.attrs['_id'] = fdata._id
                            // delete formData['_id'];
                            obj.updates= {
                                "children": child
                            };
                            console.log(JSON.stringify(obj))
                            // return false;
                            updateCommonFun(JSON.stringify(obj)).then(res=>{          
                                if(res.data.result=='ok'){
                                    console.log(res.data)
                                    //调用父级函数刷新表格
                                    this.$emit('fatherMethod');
                                        
                                    //调用弹窗函数关闭弹出层
                                    this.$refs.dialog.dialogCancel(); 
                                }
                            })
                        
                        }
                    }) 

                    

                    // let objNew = JSON.stringify(this.updateFormParams);
                    // let obj = JSON.parse(objNew);
                    // obj.attrs['_id'] = formData._id
                    
                }


            }else if(this.opt=='addChildren'){
                //提交数据，获取数据

                    //查询选中的父级数据
                let objNew = JSON.stringify(this.getUpdateDataParams);
                let obj = JSON.parse(objNew);
                obj.attrs['_id'] = this.fatherSelect[0]['_id']
                console.log(JSON.stringify(obj))

                getCommonFun(JSON.stringify(obj)).then(res=>{          
                    
                    if(res.data.result=='ok'){
                        
                        // this.editData = 
                        if(!res.data.data[0].hasOwnProperty('children')){
                            res.data.data[0].children= []
                        }
                        res.data.data[0].children.push(formData)
                        console.log(res.data.data[0])

                        let objNew = JSON.stringify(this.updateFormParams);
                        let obj = JSON.parse(objNew);
                        obj.attrs['_id'] = res.data.data[0]._id
                        delete res.data.data[0]['_id'];
                        obj.updates= res.data.data[0];
                        console.log(JSON.stringify(obj))
                        // return false;
                        updateCommonFun(JSON.stringify(obj)).then(res=>{          
                            if(res.data.result=='ok'){
                                console.log(res.data)
                                //调用父级函数刷新表格
                                this.$emit('fatherMethod');
                                    
                                //调用弹窗函数关闭弹出层
                                this.$refs.dialog.dialogCancel(); 
                            }
                        })

                    
                    }
                })

                    //表单数据添加到子集中

                    //接口修改父级数据

            }else if(this.opt=='device'){

            }

        }

    },

}
</script>

<style scoped>
    .bottom{
        margin-bottom:20px;
    }
</style>
