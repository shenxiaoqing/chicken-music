import JSONP from 'jsonp'
import axios from 'axios'
import Vue from 'vue'

function jsonp (url, data, option) {
  console.log('jsonp')
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data)
  return new Promise((resolve, reject) => {
    JSONP(url, option, (err, data) => {
      if (!err) {
        // console.log(data)
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function params (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}

export default {
  install () {
    Object.defineProperty(Vue.prototype, '$http', {
      value: axios
    })
    Object.defineProperty(Vue.prototype, '$jsonp', {
      value: jsonp
    })
  }
}