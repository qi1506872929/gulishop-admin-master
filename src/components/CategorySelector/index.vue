/* eslint-disable vue/prop-name-casing */
<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm" :disabled="!isshowlist">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          @change="handlerCategory1"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          @change="handlerCategory2"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          @change="handlerCategory3"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  // eslint-disable-next-line
  props: ['isshowlist'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategory1()
      if (result.code === 200) {
        this.category1List = result.data
      }
    },
    // 选中一级分类的回调
    async handlerCategory1(category1Id) {
      // 清空二、三级分类数据
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.category2List = []
      this.category3List = []
      // 将 category1Id 传递给父组件
      this.$emit('handlerCategory', { level: 1, categoryId: this.cForm.category1Id })

      const result = await this.$API.category.getCategory2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },
    // 选中二级分类的回调
    async handlerCategory2(category2Id) {
      // 清空三级分类数据
      this.cForm.category3Id = ''
      this.category3List = []
      // 将 category2Id 传递给父组件
      this.$emit('handlerCategory', { level: 2, categoryId: this.cForm.category2Id })

      const result = await this.$API.category.getCategory3(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },
    // 选中三级分类的回调
    async handlerCategory3(category3Id) {
      // 将 category3Id 传递给父组件
      this.$emit('handlerCategory', { level: 3, categoryId: this.cForm.category3Id })
    }
  }
}
</script>
