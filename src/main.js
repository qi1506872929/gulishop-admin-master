import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css 使用全局的 css 样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon 引入所有的 svg 图片
import '@/permission' // 引入 token 校验相关（和权限也有关）

import * as API from '@/api/product/index' // 引入axios请求
Vue.prototype.$API = API

import CategorySelector from '@/components/CategorySelector' // 引入三级分类组件
Vue.component('CategorySelector', CategorySelector)
import HintButton from '@/components/HintButton' // 引入HintButton组件
Vue.component('HintButton', HintButton)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
