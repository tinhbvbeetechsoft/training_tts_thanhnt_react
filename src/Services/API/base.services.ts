import axios from 'axios';
import _ from 'lodash';
import { CONFIG } from 'src/Config/app-config';
import { Utils } from 'src/Utils/Utils';
import { DataTableResults } from '../Models/DataTableResults';
import { CachedRequest } from './cached-request';
import { ServiceRespone } from './ServiceResponse';

export class BaseService<T> extends CachedRequest {
    protected baseUrl: String;

    constructor(serviceCode: string, module: string) {
        super();
        const serviceUrl = this._getBaseUrlService(serviceCode);
        this.baseUrl = `${serviceUrl}${(CONFIG.API_PATH as any)[module]}`;
    }

    /**
     * function lấy url của service theo serviceCode
     * @param {*} serviceCode
     * @return {*}
     */
    private _getBaseUrlService(serviceCode: string) {
        let url = null;
        switch (serviceCode) {
            case CONFIG.SERVICE_CODE.OPTICAL:
                url = process?.env?.OPTICAL_SERVICE_URL;
                break;
            default:
                url = process?.env?.OPTICAL_SERVICE_URL;
                break;
        }
        return url;
    }


    /**
     * Hàm thực hiện call api tìm kiếm mặc định
     * @param {*} formData
     * @param {*} event
     * @return {*}
     */
    public async search(formData: any, event?: any): Promise<ServiceRespone<DataTableResults<T>>> {
        formData = _.cloneDeep(formData || {});
        formData['_search'] = Utils.getSearchFromEvent(event);
        const buildParams = Utils.buildParams(formData || {});
        return await this.getCache(`${this.baseUrl}/search`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }

    /**
      * Hàm thực hiện lưu mặc định
     * @param {*} formData
     * @return {*}
     */
    public async saveOrUpdate(formData: any, id?: number): Promise<ServiceRespone<T>> {
        try {
            formData = Utils.convertFormFile(formData);
            const result = await axios.post(`${this.baseUrl}`, formData);
            this.deleteCacheByNamespace(this.constructor.name);
            return ServiceRespone.from<T>(result.data);
        } catch (error) {
            return ServiceRespone.fromError(error);
        }
    }

    /**
     * Hàm thực hiện lấy chi tiết 1 bản ghi mặc định
     * @param {number} id
     * @return {*}
     */
    public async findById(id: number): Promise<ServiceRespone<T>> {
        const url = `${this.baseUrl}/${id}`;
        const config = {
            headers: { ['Content-Type']: 'application/json' },
        };
        return this.getCache<T>(url, config);
    }

    /**
     * Hàm thực hiện lấy chi tiết danh sách bản ghi theo list ids
     * @param {number} ids
     * @return {*}
     */
    public async findByIds(ids: number[]): Promise<ServiceRespone<T[]>> {
        const url = `${this.baseUrl}/find-by-ids`;
        const config = {
            headers: { ['Content-Type']: 'application/json' },
            params: { ids: ids.join(',') }
        };
        return this.getCache<T[]>(url, config);
    }


    /**
     * Hàm thực hiện xóa bản ghi mặc định
     * @param {number} id
     * @return {*}
     */
    public async deleteOne(id: number): Promise<ServiceRespone<T>> {
        try {
            const result = await axios.delete(`${this.baseUrl}/${id}`);
            this.deleteCacheByNamespace(this.constructor.name);
            return ServiceRespone.from<T>(result.data);
        } catch (error) {
            return ServiceRespone.fromError(error);
        }
    }

    /**
     * Hàm thực hiện lấy tất cả danh sách mặc định
     * @return {*}
     */
    public async findAll(): Promise<ServiceRespone<T[]>> {
        const url = `${this.baseUrl}/find-all`;
        return await this.getCache(url);
    }

    /**
     * Call api method get
     * @param {*} url
     * @param {*} config
     * @return {*}
     */
    public async get(url: string, config?: any, isCache: boolean = true): Promise<ServiceRespone<T>>{
        try {
            if (!isCache) {
                const result = await axios.get(url, config)
                return ServiceRespone.from<T>(result.data);
            }
            return await this.getCache<T>(url, config);
        } catch (error) {
            return ServiceRespone.fromError(error);
        }
    }

    /**
     * Call api method post
     * @param {*} url
     * @param {*} data
     * @param {*} config
     * @return {*}
     */
    public async post(url: string, data?: any, config?: any) {
        this.deleteCacheByNamespace(this.constructor.name);
        return await axios.post(url, data, config);
    }

    /**
     * Call api method delete
     * @param {*} url
     * @param {*} config
     * @return {*}
     */
    public async delete(url: string, config?: any) {
        this.deleteCacheByNamespace(this.constructor.name);
        return await axios.delete(url, config);
    }

    /**
     * Call api method put
     * @param {*} url
     * @param {*} data
     * @param {*} config
     * @return {*}
     */
    public async put(url: string, data?: any, config?: any) {
        this.deleteCacheByNamespace(this.constructor.name);
        return await axios.put(url, data, config);
    }
};
