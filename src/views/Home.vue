<style lang="scss">
li,
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.home {
  .form-widget {
    &-list {
      padding: 8px 0;
      width: 100%;
      height: 100%;
      ul {
        overflow: hidden;
        padding: 0 10px 10px;
        margin: 0;
        .form-widget-label {
          font-size: 12px;
          display: block;
          width: 47%;
          line-height: 26px;
          left: 0;
          float: left;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 1%;
          color: #333;
          border: 1px solid #f4f6fc;

          & > a {
            display: block;
            cursor: move;
            background: #f4f6fc;
            border: 1px solid #f4f6fc;

            .icon {
              margin-right: 6px;
              margin-left: 8px;
              font-size: 14px;
              display: inline-block;
              vertical-align: middle;
            }

            span {
              display: inline-block;
              vertical-align: middle;
            }
          }

          &:hover {
            color: #409eff;
            border: 1px dashed #409eff;
          }
        }
      }
    }
  }

  .d-main {
    height: 800px;
    border: 1px dashed #ccc;
  }

  .fc {
    &-drag {
      &-grid {
        &-row {
          min-height: 60px;

          .el-col,
          .fc-drag-main,
          .fc-drag-list {
            min-height: 60px;
          }

          .el-col {
            border: 1px dashed #d9d9d9;
            background: white;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="home">
    <el-container>
      <el-aside width="350px">
        <div class="form-widget-list">
          <draggable
            v-model="components"
            tag="ul"
            v-bind="draggableOptions"
            :clone="useFormatDragItem"
          >
            <li
              class="form-widget-label"
              :key="item.id"
              v-for="item in components"
            >
              <a>
                <i class="icon"></i>
                <span>{{ item.label }}</span>
              </a>
            </li>
          </draggable>
        </div>
      </el-aside>
      <el-main class="d-main">
        <fc-form :rules="rules" ref="fcForm" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  nextTick
} from "@vue/composition-api";
import FcForm from "./FcForm";
import { uniqueId } from "lodash";
import classnames from "classnames";
import Sortable from "sortablejs";

export default defineComponent({
  name: "drag-component",
  components: {
    FcForm
  },
  setup() {
    // const vm = getCurrentInstance()
    const fcForm = ref("");
    const state = reactive({
      components: [
        {
          id: 1,
          label: "el-row",
          lib_type: "row"
        },
        {
          id: 2,
          label: "el-input",
          lib_type: "input"
        }
      ],
      draggableOptions: {
        group: { name: "dragGroup", pull: "clone", put: false },
        sort: false,
        animation: 180,
        draggable: ".form-widget-label",
        ghostClass: "moving"
      },
      rules: [],
      visibleIndexes: 0
    });

    /// main data list
    const baseList = ref([]);
    // const draggableOptions = ref({
    //   group: "dragGroup",
    //   ghostClass: "fc-drage-moving",
    //   animation: 180
    // });

    const useCheckParentId = (evt, rule) => {
      const parentId = evt.to.dataset.originId;
      console.log(parentId, evt);
      fcForm.value.fApi.append(rule, parentId, true);

      nextTick(() => {
        fcForm.value.fApi.refresh(true);
      });
    };

    const useDraggableOptions = elements => {
      if (elements.length > 0) {
        elements.forEach(element => {
          new Sortable(element, {
            group: "dragGroup",
            ghostClass: "fc-drage-moving",
            animation: 180,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onAdd: function(evt) {
              /// 获取到对应的rule
              const rule = evt.item._underlying_vm_;
              console.log(evt.item._underlying_vm_, " add - rule ");
              if (rule === undefined) {
                return;
              }
              useCheckParentId(evt, rule);
              setTimeout(() => {
                const wrappers = document.querySelectorAll(
                  ".form-create .fc-drag-list"
                );
                useDraggableOptions(wrappers);
              }, 400);
            },
            onEnd: function(evt) {
              /// 如果是在主区域内来回切换的话，需要在这里进行更新form-create的规则【rules】
              /// 但是这里在主区域的时候已经是真实的dom... 所以获取不到 _underlying_vm_ 这个参数
              /// 所以就更新不了form-create的规则
              const rule = evt.item._underlying_vm_;
              console.log(evt.item._underlying_vm_, " end - rule ", evt);
              fcForm.value.fApi.refresh(true);
              if (rule === undefined) {
                return;
              }
              console.log(evt, " on-end ", state.rules);
              useCheckParentId(evt, rule);
            }
          });
        });
      } else {
        new Sortable(elements, {
          group: "dragGroup",
          ghostClass: "fc-drage-moving",
          animation: 180,
          fallbackOnBody: true,
          swapThreshold: 0.65
        });
      }
    };

    nextTick(() => {
      /// init draggable component
      const id = useUniqueId();
      const initDraggableItem = reactive({
        type: "fc-drag-main",
        children: [
          {
            type: "transition-group",
            props: {
              name: "fc-drag-list",
              tag: "div"
            },
            children: [],
            attrs: {
              "data-origin-id": id
            },
            name: id,
            class: "fc-drag-transition fc-drag-list"
          }
        ]
      });
      fcForm.value.fApi.append(initDraggableItem);
      setTimeout(() => {
        const wrappers = document.querySelectorAll(
          ".form-create .fc-drag-transition"
        );
        useDraggableOptions(wrappers);
      }, 1000);
    });

    /// generate unique id
    const useUniqueId = item => {
      if (item) {
        item._id = uniqueId("drag_key_id_");
      } else {
        return uniqueId("drag_key_id_");
      }
    };

    /// generate field
    const useAutoField = () => {
      return (
        "field_" +
        Math.random()
          .toString(36)
          .substring(3, 7)
      );
    };

    /// common wrapper drag item
    const useWrapperDrag = () => {
      /// TODO ISSUE Error
      /**
       *
       * Dragging is normal for the first time, and an error will be reported when dragging back to the original position
       *
       * Uncaught TypeError: Cannot read property 'element' of null
       *
       *
       */
      // const otherList = ref([]);
      const id = useUniqueId();
      return [
        {
          type: "fc-drag-main",
          children: [
            {
              type: "transition-group",
              props: {
                name: "fc-drag-list",
                tag: "div"
              },
              children: [],
              attrs: {
                "data-origin-id": id
              },
              name: id,
              class: "fc-drag-transition fc-drag-list"
            }
          ]
        }
      ];
    };

    /// transfer - row
    const useRow = item => {
      item["type"] = "el-row";
      (item["class"] = classnames("fc-drag-grid-row")),
        (item["children"] = [
          {
            type: "el-col",
            props: { span: 12 },
            children: useWrapperDrag()
          },
          {
            type: "el-col",
            props: { span: 12 },
            children: useWrapperDrag()
          }
        ]);
    };

    /// transfer - input
    const useInput = item => {
      item["type"] = "el-input";
      item["field"] = useAutoField();
    };

    /// format rules
    const useFormatDragItem = item => {
      const cloneItem = item;
      useUniqueId(cloneItem);
      switch (cloneItem.lib_type) {
        case "row":
          useRow(cloneItem);
          break;
        case "input":
          useInput(cloneItem);
          break;

        default:
          break;
      }
      return cloneItem;
    };

    return {
      ...toRefs(state),
      fcForm,
      baseList,
      useFormatDragItem
    };
  }
});
</script>
