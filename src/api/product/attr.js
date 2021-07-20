import request from '@/utils/request'

// attr属性的增删改查接口
export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id, category2Id, category3Id) {
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  delete(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr) {
    return request.post(`/admin/product/saveAttrInfo`, attr)
  }
}
