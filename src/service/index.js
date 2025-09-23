import axios from 'axios';
import { Message } from 'view-ui-plus';
import JsonBig from 'json-bigint';
import { cacheData } from './cache';

const service = axios.create({
  transformResponse: [
    data => {
      // JSON.parse精度丢失的问题
      const json = JsonBig({ storeAsString: true });
      const responseData = json.parse(data);
      return responseData;
    }
  ],
  timeout: 15 * 1000
});

service.interceptors.request.use(config => {
  cacheData();
  return config;
});

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Message.error({
      content: '请求错误，请刷新下页面试试~'
    });
    return Promise.reject(error);
  }
);

export default service;
