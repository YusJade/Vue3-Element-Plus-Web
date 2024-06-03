<template>
  <!-- 除了需要传columns，其它api与el-table完全一致 -->
  <BaseTable v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      
      <!-- slot就是接收到的子组件插槽里面的绑定的属性，可以任意命名，里面包含多条属性 -->
      <!-- <template v-slot:handle="slot">
          <el-button type="primary" size="mini" @click="handleUpdate(slot.scope.row, slot.scope.$index)">
              修改
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete()">
              清空
          </el-button>
      </template> -->

      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
          <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
              修改
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete()">
              清空
          </el-button>
      </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/components/BaseTable.vue'  // 根据实际子组件路径引入
export default {
  name: 'TabelDemo',
  components: {
      BaseTable
  },
  data() {
    return {
      loading: true,
      list: [],
      columns: Object.freeze([
        {
          attrs: {
            prop: 'date',
            label: '标题',
            width: '150',
            align: 'center'
          },
          id: 1
        },
        {
          attrs: {
            prop: 'author',
            label: '作者',
            width: '110',
            'show-overflow-tooltip': true
          },
          id: 2
        },
        {
          attrs: {
            prop: 'pulished',
            label: '出版商',
            'show-overflow-tooltip': true
          },
          id: 3
        },
        {
          attrs: {
            prop: 'pulished',
            label: '出版商',
            'show-overflow-tooltip': true
          },
          id: 4
        }
      ])
    }
  },
  created() {
      setTimeout(() => {
          this.list = [
              {
                  date: '2020-10-13',
                  author: '南巢',
                  des: '我是南方来的燕啊，为何也会迷恋北方的寒。'
              },
              {
                  date: '2019-05-14',
                  author: '测试超出文本显示是否正常测试超出文本显示是否正常测试超出文本显示是否正常测试超出文本显示是否正常',
                  des: '我是南方来的燕啊，为何也会迷恋北方的寒。'
              },
              {
                  date: '2019-02-14',
                  author: '自卑感',
                  des: '低头瞥见自己的影子在前疯狂的跑着躲的离你不远沉默走的路不知几个光年我还原地打转连微笑也腼腆一事无成是最好描述要怎么往前'
              }
          ]
          this.loading = false
      }, 1000)
  },
  methods: {
      handleUpdate(row, index) {
          console.log(row, index)
      },
      handleDelete() {
          this.list = []
      }
  },
}
</script>
