import Cookies from 'js-cookie' // 'js-cookie' 是一个可以非常方便的去操作 Cookies 的包

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
