import axios from 'axios';
import settings from './settings';
import Cookies from 'js-cookie';

axios.defaults.headers.ContentType = 'multipart/form-data';
const apiClient = axios.create({
    baseURL: settings.api_url,
    // credentials: true,
    withCredentials: true,
    headers:{Authorization: "Bearer " + Cookies.get('vp_token')}
});

// const apiClient = axios;

export default apiClient;