<template>
  <a href="javascript:;" :title="title">
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  // eslint-disable-next-line vue/require-prop-types
  props: ['title']
}
</script>
