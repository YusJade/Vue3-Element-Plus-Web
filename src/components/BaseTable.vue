<template>
  <!-- 通过v-bind="$attrs" v-on="$listeners"，把父组件传的属性全部绑定到子组件上，保证了api和el-table一致 -->
  <el-table style="width: 100%" v-bind="$attrs" v-on="$listeners">
      
      <!-- 考虑到v-for和v-if同时使用存在性能问题，这里直接使用computed把需要循环的数据过滤一遍，去除v-if -->
      <!-- <template v-for="item in columns">
          <el-table-column v-if="item.slot" :key="item.id" v-bind="item.attrs">
              <template slot-scope="scope">
                  <slot :scope="scope" :name="item.slot"></slot>
              </template>
          </el-table-column>
          <el-table-column v-else :key="item.id" v-bind="item.attrs"></el-table-column>
      </template> -->

      <el-table-column v-for="item in normalColumns" :key="item.id" v-bind="item.attrs"></el-table-column>
      <el-table-column v-for="item in slotColumns" :key="item.id" v-bind="item.attrs">

          <!-- vue2.6及以上版本，具名插槽和作用域插槽引入了一个新的统一的语法 (即 v-slot 指令)。它取代了 slot 和 slot-scope。
              但考虑到element-ui官方文档依然使用的是slot-scope，这里不做更改。-->            
          <template slot-scope="scope">

              <!-- :scope是绑定的动态属性，可以起任意喜欢的名字，但要注意在父组件中获取数据时key要对应 -->
              <slot :scope="scope" :name="item.slot"></slot>
          </template>
      </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
      columns: {
          type: Array,
          default: () => []
      }
  },
  computed: {
      // 获取普通的columns数据
      normalColumns() {
          return this.columns.filter(item => !item.slot) 
      },
      // 获取是插槽的columns数据
      slotColumns() {
          return this.columns.filter(item => item.slot) 
      }
  },
}
</script>
