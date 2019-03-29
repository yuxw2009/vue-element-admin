import request from '@/utils/request'

export function getEquipmentList(query) {
  return request({
    // url: 'pdeEquipment/page',
    // baseURL: 'http://inner.x9water.com/',
    baseURL: 'http://139.196.83.31/',
    url: 'api/pudow-service-erp/pdeEquipment/page',
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        // console.log(encodeURIComponent(it),encodeURIComponent(data[it]))
        if (it == 'conditions') {
          ret += it + '=' + JSON.stringify(data[it]); +'&'
        } else {
          ret += it + '=' + data[it] + '&'
        }
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getFilterList(query) {
  return request({
    // baseURL: 'http://inner.x9water.com/',
    baseURL: 'http://139.196.83.31/',
    url: 'api/pudow-service-equipment/equipment/getFiltersByEquipmentNos',
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        // console.log(encodeURIComponent(it),encodeURIComponent(data[it]))
        ret += it + '=' + data[it] + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getDayUseList(query) {
  return request({
    // baseURL: 'http://inner.x9water.com/',
    baseURL: 'http://139.196.83.31/',
    url: 'api/pudow-service-flow/flow/getDayFlowByEquipmentNo',
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        // console.log(encodeURIComponent(it),encodeURIComponent(data[it]))
        ret += it + '=' + data[it] + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getEveryUseList(query) {
  return request({
    // baseURL: 'http://inner.x9water.com/',
    baseURL: 'http://139.196.83.31/',
    url: 'api/pudow-service-flow/flow/getEveryFlowByEquipmentNo',
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        // console.log(encodeURIComponent(it),encodeURIComponent(data[it]))
        ret += it + '=' + data[it] + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getEquipmentDetail(query) {
  return request({
    // baseURL: 'http://inner.x9water.com/',
    baseURL: 'http://139.196.83.31/',
    url: 'api/pudow-service-flow/flow/getStateInfoByEquipmentNos',
    method: 'post',
    data: query,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        // console.log(encodeURIComponent(it),encodeURIComponent(data[it]))
        ret += it + '=' + data[it] + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
