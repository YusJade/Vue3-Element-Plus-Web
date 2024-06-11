import { ElMessage } from "element-plus"
import { h } from 'vue'

export function Message(msg: string) {
  ElMessage({
    message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
      h('span', null, msg)
    ]),
  })
}