import { ServiceRespone } from './ServiceResponse';
import axios from 'axios';
import { Mutex } from 'async-mutex';
export class CachedRequest {
    private static stored: any = {};
    private static readonly TIMEOUT = 1000 * 60;
    private mutex = new Mutex();
    /**
     * hasCache
     * @param token
     * @returns
     */
    hasCache(namespace: string, token: string) {
        const module = CachedRequest.stored[namespace];
        return module ? module[token] : false;
    }

    /**
     * getDataCache
     * @param token
     * @returns
     */
    getDataCache(namespace: string, token: string) {
        return CachedRequest.stored[namespace][token];
    }

    generateToken(data: any): string {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    }

    /**
     * Lưu cahce
     * @param token
     * @param response
     */
    putCache(namespace: string, token: string, response: any) {
        CachedRequest.stored[namespace] = CachedRequest.stored[namespace] || {}
        CachedRequest.stored[namespace][token] = response;
        console.info(">>>> CachedRequest.stored: ", CachedRequest.stored);
        setTimeout(() => {
            console.info(">>>> deleteCache: ", token);
            this.deleteCache(namespace, token);
        }, CachedRequest.TIMEOUT);
    }

    /**
     * xóa cache by Namespace
     * @param token
     */
    deleteCacheByNamespace(namespace: string) {
        delete CachedRequest.stored[namespace];
    }

    /**
     * xóa cache by token
     * @param token
     */
    deleteCache(namespace: string, token: string) {
        delete CachedRequest.stored[namespace][token];
    }

    /**
     * Call api method get
     * @param {*} url
     * @param {*} config
     * @return {*}
     */
     public async getCache<T>(url: string, config?: any): Promise<ServiceRespone<T>> {
        const namespace = this.constructor.name;
        const token = this.generateToken({ url: url, config: config || {} });
        let dataCache: any;
        if (this.hasCache(namespace, token)) {
            dataCache = this.getDataCache(namespace, token);
            if (dataCache instanceof Mutex) {
                const release = await dataCache.acquire();
                try {
                    const dataCache = this.getDataCache(namespace, token);
                    return ServiceRespone.from<T>(dataCache);
                } finally {
                    release();
                }
            } else {
                const dataCache = this.getDataCache(namespace, token);
                return ServiceRespone.from<T>(dataCache);
            }
        } else {
            const newMutex = new Mutex();
            this.putCache(namespace, token, newMutex);
            const release = await newMutex.acquire();
            try {
                const result = await axios.get(url, config);
                this.putCache(namespace, token, result.data);
                return ServiceRespone.from<T>(result.data);
            } finally {
                release();
            }
        }
    }

    /**
     * Hàm thực hiện lấy chi tiết 1 bản ghi mặc định
     * @param {number} id
     * @return {*}
     */
    public async findByIdCache<T>(url: string, id: number) {
        try {
            const namespace = this.constructor.name;
            const token = this.generateToken({ url, id });
            if (this.hasCache(namespace, token)) {
                const dataCache = this.getDataCache(namespace, token);
                return ServiceRespone.from<T>(dataCache);
            }
            url = `${url}/${id}`;
            return await this.getCache(url, {
                headers: { ['Content-Type']: 'application/json' }
            });
        } catch (error) {
            return ServiceRespone.fromError(error);
        }
    }
}