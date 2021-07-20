import request from '@/utils/request'

// 品牌的增删改查接口
export default {
  // DELETE  /admin/product/baseTrademark/remove/{id}
  // 根据品牌id删除某个品牌
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // POST /admin/product/baseTrademark/save
  // 新增一个品牌
  // PUT /admin/product/baseTrademark/update
  // 修改一个品牌
  addOrUpdate(trademark) {
    if (trademark.id) {
      // 有id，进行修改操作
      return request.put('/admin/product/baseTrademark/update', trademark)
    } else {
      // 无id，准备新增
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },
  // GET /admin/product/baseTrademark/{page}/{limit}
  // 查询品牌的分页列表数据
  getPageList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  // 获取所有的品牌列表而不是分页列表
  // GET /admin/product/baseTrademark/getTrademarkList
  getList() {
    return request.get(`/admin/product/baseTrademark/getTrademarkList`)
  }
}
