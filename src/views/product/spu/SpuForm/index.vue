<template>
  <div>
    <el-form :data="spuForm">
      <el-form-item label="SPU名称" label-width="100px">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          v-model="spuForm.description"
          type="textarea"
          placeholder="SPU描述"
          rows="4"
        />
      </el-form-item>
      <el-form-item label="SPU图片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlePictureSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="unUseSaleAttrIdName"
          :placeholder="
            unUseSaleAttrList.length > 0
              ? `还有${unUseSaleAttrList.length}条未选择`
              : '没有啦！！！'
          "
        >
          <el-option
            v-for="saleAttr in unUseSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          :disabled="!unUseSaleAttrIdName"
          @click="addSaleAttr"
        >添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spuForm.spuSaleAttrList">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column prop="saleAttrName" label="属性名" width="150" />
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                v-for="(spuSaleAttr, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttr.id"
                closable
                :disable-transitions="false"
                @close="handleClose(index, row)"
              >
                {{ spuSaleAttr.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
              >添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ $index }">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除销售属性"
                @click="removeSaleAttr($index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  // eslint-disable-next-line vue/require-prop-types
  props: ['visible'],
  data() {
    return {
      // 和upload相关的动态数据
      dialogImageUrl: '',
      dialogVisible: false,

      spuForm: {
        description: '',
        id: 0,
        spuImageList: [],
        spuName: '',
        spuSaleAttrList: [],
        tmId: 0
      }, // 请求初始化的spu详情数据
      spuImageList: [], // 请求初始化的spu图片列表
      trademarkList: [], // 请求初始化的所有品牌列表
      saleAttrList: [], // 请求初始化的所有销售属性列表
      unUseSaleAttrIdName: '' // 存放商品属性的id和name
    }
  },
  computed: {
    // 根据纵的销售属性列表和已添加的销售属性列表计算出剩余可添加的销售属性列表
    unUseSaleAttrList() {
      return this.saleAttrList.filter(saleAttr =>
        this.spuForm.spuSaleAttrList.every(
          spuSaleAttr => spuSaleAttr.saleAttrName !== saleAttr.name
        )
      )
    }
  },
  methods: {
    // 删除图片功能
    handleRemove(file, fileList) {
      this.spuForm.spuImageList = fileList
    },
    // 图片中的放大镜功能
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加图片功能
    handlePictureSuccess(res, file, fileList) {
      this.spuForm.spuImageList = fileList
    },
    // 请求获取添加spu的初始化数据
    async getAddSpuFormInitData() {
      // 获取所有的品牌列表
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性列表
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },
    // 请求获取修改spu的初始化数据
    async getUpdateSpuFormInitData(spu) {
      // 根据id获取SPU详情信息
      const result = await this.$API.spu.get(spu.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }
      // 获取指定SPU的id对应的图片列表
      const imageResult = await this.$API.sku.getSpuImageList(spu.id)
      if (imageResult.code === 200) {
        // 处理图片的名称和路径，提供给elementui进行展示
        const imgList = imageResult.data
        imgList.map(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = imgList
      }
      // 获取所有的品牌列表
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }
      // 获取所有的销售属性列表
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },
    // 添加销售属性
    addSaleAttr() {
      const arr = this.unUseSaleAttrIdName.split(':') // 取出属性id和name
      const obj = {
        baseSaleAttrId: arr[0],
        saleAttrName: arr[1],
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj) // 添加到表单数据中
      this.unUseSaleAttrIdName = '' // 清空数据
    },
    // 移除属性值
    handleClose(index, row) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 保存销售属性值
    handleInputConfirm(row) {
      const baseSaleAttrId = row.baseSaleAttrId
      const saleAttrValueName = row.inputValue
      // 如果属性值为空，提示信息并返回
      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        // this.$message.info('属性值不能为空')
        return
      }
      // 是否如之前的属性值相同
      const isRepeat = row.spuSaleAttrValueList.some(
        item => item.saleAttrValueName === saleAttrValueName
      )
      if (isRepeat) {
        // 如果相同，提示信息并返回
        row.inputValue = ''
        this.$message.info('属性值不能重复')
        return
      }
      // 构造需要添加的结构
      const obj = { baseSaleAttrId, saleAttrValueName }
      // 添加属性值
      row.spuSaleAttrValueList.push(obj)
      // 切换为标签模式
      row.inputVisible = false
      // 清空input值
      row.inputValue = ''
    },
    // 添加销售属性值
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    removeSaleAttr(index) {
      this.spuForm.spuSaleAttrList.splice(index, 1)
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
