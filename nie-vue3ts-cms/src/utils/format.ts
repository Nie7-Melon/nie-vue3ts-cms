import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
// 上面这两行导入虽然爆红，但是不影响，时间已经被格式化了
dayjs.extend(utc)

export function formatUTC(utcString: string, format: string = 'YYYY/MM/DD HH:mm:ss') {
  // 默认格式化后的时间是零时区，东八区要.utcOffset(8)加八个小时
  //也可以在形参上不规定 format: string = 'YYYY/MM/DD HH:mm:ss'
  //在下面.format('YYYY/MM/DD HH:mm:ss')
  //现在的写法更优雅，上面注释掉的更顺着思路
  const resultTime = dayjs.utc(utcString).utcOffset(8).format(format)
  return resultTime
}
