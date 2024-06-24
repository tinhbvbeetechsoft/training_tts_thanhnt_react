import axios from 'axios';
import { Toast } from 'src/Components/Toast/toast.utils';
import LocalStorage from '../Utils/LocalStorage';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
// axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = (onUnauthenticated: any) => {
    const onRequestSuccess = (config: any) => {
        // store.dispatch(setLoading(true));
        const token = LocalStorage.get('token');
        if (token && !config.headers.noAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    };
    const onResponseSuccess = (response: any) => {
        const { code, type, message } = response.data || {};
        if (type && (code || message)) {
            Toast.show(type, code, message);
        }
        // store.dispatch(setLoading(false));
        return response;
    };
    const onResponseError = (err: any) => {
        // xu ly neu co loi o day
        // Toast.error('Có lỗi xảy ra!');
        // store.dispatch(setLoading(false));
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
