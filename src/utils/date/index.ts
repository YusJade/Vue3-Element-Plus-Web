export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // console.log(`日期格式化(${date} -> ${`${year}年${month}月${day}日`})`)
  return `${year}年${month}月${day}日`
}

export function formatDateFromStr(dateStr: string) {
  if (dateStr == null) {
    return ''
  }
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // console.log(`日期格式化(${dateStr} -> ${`${year}年${month}月${day}日`})`)
  return `${year}年${month}月${day}日`
}

export class DateUtils {
  public formatDate(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // console.log(`日期格式化(${date} -> ${`${year}年${month}月${day}日`})`)
    return `${year}年${month}月${day}日`
  }

  public formatDateFromStr(dateStr: string) {
    if (dateStr == null) {
      return ''
    }
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // console.log(`日期格式化(${dateStr} -> ${`${year}年${month}月${day}日`})`)
    return `${year}年${month}月${day}日`
  }
}

export default new DateUtils();