/* 
* 返回格式化后的时间
* timeStamp：时间戳
* startType：要转换的类型<year:yyyy-MM-dd hh:mm:ss|yearDate:yyyy-MM-dd|monthDate:MM-dd|MM-dd hh:mm>
*/
export const getStandardDate = (timeStamp, startType) => {
  const dt = new Date(timeStamp)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const date = (dt.getDate() + '').padStart(2, '0')

  const hours = (dt.getHours() + '').padStart(2, '0')
  const minutes = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')
  let resStr = ''
  if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
  else if (startType === 'yearDate') resStr = year + '年' + month + '月' + date + '日'
  else if (startType === 'monthDate') resStr = month + '月' + date + '日'
  else if (startType === 'hm') resStr = hours + ':' + minutes
  else if (startType === 'ms') resStr = minutes + ':' + second
  else resStr = month + '月' + date + '日' + ' ' + hours + ':' + minutes
  return resStr
}

/* 
* 返回转换后的面值
* convertRMB(value: number, type: string<cent|yuan>)
* value: 面值
* type: 面值类型
*   cent，单位分
*   yuan，表示单位元
*/
export const convertRMB = (value, type) => {
  let errorInfo = {
    function: 'convertRMB(value, type)',
    message: ''
  }
  // value 必须为 number
  if (typeof value === 'number') {
    // type 必须为 string
    if (typeof type === 'string') {
      // 默认转换为分
      if (!type || type === 'yuan') {
        return value * 100
      } else if (type === 'cent') {
        // 分转换为元
        return value / 100
      } else {
        errorInfo.message = 'Unknow Type: param of \'type\''
        console.error(errorInfo)
      }
    } else {
      errorInfo.message = '\'type\' must be string'
      console.error(errorInfo)
    }
  } else {
    errorInfo.message = '\'value\' must be number'
     console.error(errorInfo)
  }
}