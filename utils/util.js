const formatTime = date => {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const editTime = function(time) {
  let t = Math.round(time/1000)
  if (t / 60 < 10) {
    if (t % 60 > 9) {
      return `0${Math.floor(t / 60)} : ${t % 60}`
    } else {
      return `0${Math.floor(t / 60)} : 0${t % 60}`
    }
  } else {
    if (t % 60 > 9) {
      return `${Math.floor(t / 60)} : ${t % 60}`
    } else {
      return `${Math.floor(t / 60)} : 0${t % 60}`
    }
  }
}

const editCount=function (num) {
  if (num > 100000000) {
    num = (num / 100000000).toFixed(2) + '亿'
  } else if (num > 100000) {
    num = Math.floor(num / 10000) + '万'
  } else if (num > 10000) {
    num = Math.floor(num / 1000)/10 + '万'
  }
  return num
}
const myFormatTime=function(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}.${month}.${day}`
}
module.exports = {
  formatTime,
  editCount,
  editTime,
  myFormatTime
}
