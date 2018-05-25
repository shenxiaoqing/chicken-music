function objToStr(obj) {
  let arr = [];
  for (let key in obj) {
    arr.push(key + '=' + (typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]))
  }
  return arr.join('&');
}

function commonFetch(url, data, method = 'GET', callback) {
  // callback.beforeEach()
  let initObj = {};
  if (method === 'GET') {
    url = url + '?' + objToStr(data);
    initObj = {
      method,
      mode: 'no-cors',
      credentials: 'include'
    }
  } else {
    initObj = {
      method,
      mode: 'no-cors',
      credentials: 'include',
      headers: {
        'Contnet-Type': 'application/json'
      },
      body: data
    }
  }

  console.log(url)
  return fetch(url, initObj).then((res) => {
    // callback.afterEach()
    console.log(res)
    if (res.status >= 400) {
      return res.json().then((error) => {
        return Promise.reject(error);
      })
    } else{
      return res.json()
    }
  })
}
// commonFetch('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=h5&uin=0&needNewCode=1&param=jsonCallback', {
//   g_tk: 5381,
//   inCharset: 'utf-8',
//   outCharset: 'utf-8',
//   notice: 0,
//   format: 'json',
//   platform: 'h5',
//   uin: 0,
//   needNewCode: 1,
//   param: 'jsonCallback'
// }).then((data, fn) => {
//   console.log(data)
//   console.log(fn)
// })


export default {
  install(Vue, options) {
    Vue.prototype.$fetch = {
      get(url, data) {
        return commonFetch(url, data, 'GET', {
          beforeEach: () => {
            options.beforeEach()
          },
          afterEach: () => {
            options.afterEach()
          }
        }).catch((error) => {
          options.catchEach()
        })
      }
    }
  }
}