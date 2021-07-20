<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="showAddDialog"
    >添加</el-button>

    <el-table border style="width: 100%; margin: 20px 0" :data="trademarkList">
      <el-table-column label="序号" width="80" align="center" type="index" />
      <el-table-column label="品牌名称" prop="tmName" width="width" />
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 60px">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @size-change="handleSizeChange"
      @current-change="getTrademarkInfo"
    />

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form ref="tmForm" style="width: 85%;" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTrademark"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    var validateTmName = (rule, value, callback) => {
      if (value.trim.length < 2 || value.trim.length < 10) {
        callback(new Error('品牌名称长度在 2 到 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false,

      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        // 包括验证规则，失败的提示信息和验证时机 验证时机包括三个 blur-失去焦点 change-内容改变 表单提交时
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // {
          //   min: 2,
          //   max: 10,
          //   message: '品牌名称长度在 2 到 10 个字符',
          //   trigger: 'change'
          // }
          { validator: validateTmName, trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请选择品牌LOGO' }]
      }
    }
  },
  mounted() {
    this.getTrademarkInfo()
  },
  methods: {
    // 发请求获取数据
    async getTrademarkInfo(page = 1) {
      this.page = page
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      )
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器修改每页数量
    handleSizeChange(size) {
      this.limit = size
      this.getTrademarkInfo()
    },

    // 存储图片地址
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 存储图片之前对图片的验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 点击添加弹出添加对话框
    showAddDialog() {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 点击修改弹出修改对话框
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    // 添加或修改数据
    addOrUpdateTrademark() {
      // 表单整体验证
      this.$refs.tmForm.validate(async(valid) => {
        if (valid) { // 验证通过
          // 存储数据
          const trademark = this.tmForm
          try {
            // 发送请求
            await this.$API.trademark.addOrUpdate(trademark)
            // 操作成功提示信息
            this.$message.success(
              trademark.id ? '修改商品信息成功' : '添加商品信息成功'
            )
            // 关闭对话框
            this.dialogFormVisible = false
            // 如果是添加返回列表第一页，修改返回修改的数据那一页
            this.getTrademarkInfo(trademark.id ? this.page : 1)
          } catch (error) {
            // 操作失败提示信息
            this.$message.error(
              trademark.id ? '修改商品信息失败' : '添加商品信息失败'
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除数据
    deleteTrademark(row) {
      this.$confirm(`确定删除${row.tmName}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await this.$API.trademark.delete(row.id)
            this.$message.success('删除商品成功!')
            // 成功后如果页面只有删除的那一条信息，就返回上一页，否则返回删除那一页
            this.getTrademarkInfo(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            )
          } catch (error) {
            this.$message.error('删除商品失败!')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
