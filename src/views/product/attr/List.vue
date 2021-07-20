<template>
  <div>
    <!-- 三级分类 -->
    <el-card>
      <CategorySelector :isshowlist="isShowList" @handlerCategory="handlerCategory" />
    </el-card>

    <el-card style="margin: 20px 0">
      <!-- 属性列表 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
        >添加属性</el-button>
        <el-table border :data="attrList" style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width"
          >
            <template slot-scope="{ row }">
              <el-tag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                type="success"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                style="margin-right: 10px;"
                @click="showUpdateDiv(row)"
              />
              <el-popconfirm
                :title="`确定删除${row.attrName}吗?`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或修改属性对话框 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :data="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName.trim()"
          @click="addAttrValue"
        >添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table
          border
          :data="attrForm.attrValueList"
          style="width: 100%;margin: 20px 0"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column prop="valueName" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.isEdit"
                :ref="$index"
                v-model="row.valueName"
                size="mini"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              />
              <span
                v-else
                style="display: block; width: 100%; height: 100%;"
                @click="toEdit(row, $index)"
              >{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrForm.attrValueList.length === 0" @click="save">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],

      isShowList: true,

      attrForm: {
        attrName: '',
        attrValueList: [
          // attrId,
          // id,
          // valueName
        ],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    handlerCategory({ level, categoryId }) {
      if (level === 1) {
        // 接收一级分类的id，清空二级、三级标题的id和列表数据
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        // 接收二级分类的id，清空三级标题的id和列表数据
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []
      } else if (level === 3) {
        this.category3Id = categoryId
        // 发请求拿到平台属性的列表数据
        this.getAttrList()
      }
    },
    // 请求获取平台属性的列表数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 点击添加按钮触发事件
    showAddDiv() {
      this.isShowList = false // 打开添加对话框
      this.attrForm = {
        // 清空选项
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 点击添加属性值按钮触发事件
    addAttrValue() {
      // 新建一个对象占位
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id,
        valueName: '',
        isEdit: true
      })
      // 聚焦
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
      })
    },
    // 点击修改按钮触发事件
    showUpdateDiv(row) {
      this.isShowList = false // 打开修改对话框
      this.attrForm = cloneDeep(row) // 拷贝数据
      // 添加切换模式的属性
      this.attrForm.attrValueList.forEach(item =>
        this.$set(item, 'isEdit', false)
      )
    },
    // 由输入框模式切换为显示模式
    toLook(row) {
      // 如果数据为空不切换
      if (row.valueName.trim() === '') {
        row.valueName = ''
        return
      }
      // 如果数据重复不切换
      const isReapet = this.attrForm.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === row.valueName
        }
      })
      if (isReapet) {
        this.$message.info('数据不能重复')
        row.valueName = ''
        return
      }
      // 切换为显示模式
      row.isEdit = false
    },
    // 由显示模式切换为输入框模式
    toEdit(row, index) {
      // 切换为输入模式
      row.isEdit = true
      // 聚焦
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 保存数据
    async save() {
      const attr = this.attrForm // 获取数据
      // 整理数据
      attr.attrValueList.filter(item => {
        // 1、属性值名称如果为空串，return undefined，从属性值列表当中去除
        if (item.valueName.trim !== '') {
          delete item.isEdit // 2、属性值当中去除 isEdit 属性
          return true
        }
      })
      if (attr.attrValueList.length === 0) {
        // 3、属性值列表如果没有属性值，不发请求
        this.$message.info('属性值为空，无法保存')
        return
      }
      try {
        // 发送请求
        await this.$API.attr.addOrUpdate(attr)
        this.$message.success('保存平台属性成功')
        this.isShowList = true
        this.getAttrList()
      } catch (error) {
        this.$message.error('保存平台属性失败' + error.message)
      }
    },
    async deleteAttr(row) {
      try {
        this.$API.attr.delete(row.id)
        this.$message.success('删除属性成功')
        this.getAttrList()
      } catch (error) {
        this.$message.success('删除属性失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
