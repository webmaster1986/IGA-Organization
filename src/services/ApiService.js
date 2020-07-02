import axios from "axios";
import { getAuthHeaders } from "./common";


// const apiEndPoint = `http://25a4e8669de9.ngrok.io/idcsdemo/api/v1/`;
const apiEndPoint = `https://preview.kapstonellc.com/idcsdemo/api/v1/`;

const axiosInstance = axios.create({
  baseURL: apiEndPoint,
});


export class ApiService {

  getAuthToken = () => localStorage.getItem('accessToken');

  async getData(url, headers, cancelToken, data) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      },
    };
    if (data) {
      config.data = data;
    }
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    const response = await axiosInstance.get(url, config).catch((err) => {
      data = {error: 'something went wrong'};
    });
    return data || response.data;
  }

  async postMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.post(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  async putMethod(url, data, headers) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      }
    };
    let resData = '';
    const response = await axiosInstance.put(url, data, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async deleteMethod(url, data, headers) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      },
      data
    };
    let resData = '';
    const response = await axiosInstance.delete(url, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async createUser(payload) {
    return await this.postMethod(`${apiEndPoint}createuserwithorganisation`, payload);
  }

}
