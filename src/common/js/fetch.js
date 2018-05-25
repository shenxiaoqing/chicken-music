// 针对fetch的封装，使用的时候可以节省代码量

function objToStr(obj) {
  let arr = [];
  for (let key in obj) {
    arr.push(key + '=' + (typeof obj[key] === 'object' ? JSON.stringify(obj[key]) : obj[key]))
  }
  return arr.join('&');
}

function commonFetch(url, data, method = 'GET', callback) {
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

  return fetch(url, initObj).then((res) => {
    if (res.status >= 400) {
      return res.json().then((error) => {
        return Promise.reject(error);
      })
    } else{
      return res.json()
    }
  })
}

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