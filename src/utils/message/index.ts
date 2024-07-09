import { ElMessage } from "element-plus"
import { h } from 'vue'

export function Message(msg: string) {
  console.log('发送一条 msg:' + msg)
  ElMessage({
    message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
      h('span', null, msg)
    ]),
  })
}