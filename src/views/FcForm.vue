<!--
 * @Author        : djkloop
 * @Date          : 2020-09-04 17:30:40
 * @LastEditors   : djkloop
 * @LastEditTime  : 2020-09-09 14:50:54
 * @Description   : generate form with form-create
 * @FilePath      : /vd/src/views/FcForm.vue
-->
<style lang="scss">
.fc-form,
.el-form {
  height: 100%;

  & > .el-row {
    height: 100%;

    & > .el-col {
      height: 100%;

      & > .el-form-item {
        height: 100%;

        & > .el-form-item__content {
          height: 100%;
        }

        .fc-drag-main {
          height: 100%;

          .fc-drag-transition {
            height: 100%;
          }
        }
      }

    }
  }
}
</style>
<template>
  <div class="fc-form">
    <form-create v-model="fApi" :rule="rules" :option="options"></form-create>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from "@vue/composition-api";

export default defineComponent({
  name: "fc-form",
  props: {
    rules: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    /// json to form with form-create
    /// http://www.form-create.com/v2/element-ui/components/input.html
    const state = reactive({
      // instance
      fApi: {},
      // form-create-options
      options: {
        submitBtn: false,
        resetBtn: false
      }
    });

    watch(() => props.rules, (oldRules, newRules) => {
      console.log(oldRules, newRules, ' watch ')
    }, {
      deep: true
    })

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style></style>
