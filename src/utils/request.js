import axios from 'axios'
import { message } from 'antd'

const request = function (loadtip, query) {
    let loadingMessage = null
    if (loadtip) {
        loadingMessage = message.loading({
            content: '正在加载中…',
            duration: 0
        })
    }
    return axios.request(query)
        .then(res => {
            if (loadtip && loadingMessage) {
                loadingMessage()
            }
            if (res.data.code === 401) {
                window.location.href = '/login'
                return Promise.reject(res.data)
            } else if (res.data.code === 500) {
                return Promise.reject(res.data)
            } else if (res.data.code === 501) {
                return Promise.reject(res.data)
            } else if (res.data.code === 502) {
                window.location.href = '/login'
                return Promise.reject(res.data)
            } else {
                return Promise.resolve(res.data)
            }
        })
        .catch(e => {
            if (loadtip && loadingMessage) {
                loadingMessage()
            }
            message.error(e.message)
            return Promise.reject(e.message)
        })
}

const post = function (url, params) {
    const query = {
        baseURL: import.meta.env.VITE_API_URL,
        url: url,
        method: 'post',
        withCredentials: true,
        timeout: 30000,
        data: params,
        headers: { 'Content-Type': 'application/json', 'request-ajax': true }
    }
    return request(false, query)
}

const postWithLoadTip = function (url, params) {
    const query = {
        baseURL: import.meta.env.VITE_API_URL,
        url: url,
        method: 'post',
        withCredentials: true,
        timeout: 30000,
        data: params,
        headers: { 'Content-Type': 'application/json', 'request-ajax': true }
    }
    return request(true, query)
}

const postWithOutLoadTip = function (url, params) {
    const query = {
        baseURL: import.meta.env.VITE_API_URL,
        url: url,
        method: 'post',
        withCredentials: true,
        timeout: 30000,
        data: params,
        headers: { 'Content-Type': 'application/json', 'request-ajax': true }
    }
    return request(false, query)
}

const get = function (url, params) {
    const query = {
        baseURL: import.meta.env.VITE_API_URL,
        url: url,
        method: 'get',
        withCredentials: true,
        timeout: 30000,
        params: params,
        headers: { 'request-ajax': true }
    }
    return request(false, query)
}

const form = function (url, params) {
    const query = {
        baseURL: import.meta.env.VITE_API_URL,
        url: url,
        method: 'post',
        withCredentials: true,
        timeout: 30000,
        data: params,
        headers: { 'Content-Type': 'multipart/form-data', 'request-ajax': true }
    }
    return request(false, query)
}

export {
    post,
    postWithLoadTip,
    postWithOutLoadTip,
    get,
    form
}
