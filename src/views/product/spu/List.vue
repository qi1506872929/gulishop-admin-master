<template>
  <div>
    <el-card>
      <CategorySelector
        :isshowlist="isShowList"
        @handlerCategory="handlerCategory"
      />
    </el-card>
    <el-card style="margin: 20px 0;">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
        >添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="操作" label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU"
                @click="showAddSKuForm(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                style="margin: 0 10px"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU的SKU列表"
              />
              <HintButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除SPU"
                style="margin: 0 10px"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center;"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :pager-conut="5"
          :page-sizes="[2, 4, 6]"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        />
      </div>

      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event" /> -->
      <SpuForm v-show="isShowSpuForm" ref="spu" :visible.sync="isShowSpuForm" />
      <SkuForm v-show="isShowSkuForm" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      isShowList: true,
      category1Id: '',
      category2Id: '',
      category3Id: '', // 三级分类数据
      spuList: [], // 列表页初始化数据
      page: 1,
      limit: 2,
      total: 0, // 分页器数据
      isShowSpuForm: false, // 列表页和添加SPU页的切换
      isShowSkuForm: false // 列表页和添加SKU页的切换
    }
  },
  methods: {
    // 三级分类存储数据
    handlerCategory({ level, categoryId }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = []
      } else if (level === 3) {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    // 初始化数据
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },
    // 切换页面显示数量
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },
    // 点击添加Spu的回调
    showAddSpuForm() {
      this.isShowSpuForm = true // 显示添加页
      this.isShowList = false // 禁用三级分类
      this.$refs.spu.getAddSpuFormInitData() // 调用子组件的方法请求初始化数据
    },
    // 点击修改Spu的回调
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true // 显示添加页
      this.isShowList = false // 禁用三级分类
      this.$refs.spu.getUpdateSpuFormInitData(row) // 调用子组件的方法请求初始化数据
    },
    // 点击添加Sku的回调
    showAddSKuForm(row) {
      this.isShowSkuForm = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
