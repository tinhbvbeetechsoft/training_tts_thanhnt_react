import { REQUEST, FAILURE, SUCCESS } from './../Services/Reducers/action-type.util';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import moment from 'moment';
import { SyntheticEvent } from 'react';
import { ActionType } from 'src/Enum/enums';
import { confirmDialog } from "primereact/confirmdialog";
import * as CryptoJS from 'crypto-js';

export class Utils {
    /**
     * Check 1 trường có lỗi hay không
     * @param {*} errors
     * @param {*} touched
     * @param {*} name
     * @return {*}
     */
    static isFormFieldValid = (errors: any, touched: any, name: string) => {
        const _touched = _.get(touched, name);
        const _error = _.get(errors, name);
        return !!(_touched && _error);
    };
    /**
     * Lấy thông báo lỗi validate
     * @param {*} errors
     * @param {*} name
     * @return {*}
     */
    static getFormErrorMessage = (errors: any, name: string) => {
        const error = _.get(errors, name) as any;
        let msg = '';
        if (typeof error == 'object') {
            if (error.key) {
                msg = translate(error.key, error.values);
            }
        } else {
            msg = error || '';
        }
        return msg;
    };

    /**
     * Sinh uuid
     * @return {*}
     */
    static generateUniqueId = () => {
        return Math.random()
            .toString(36)
            .substring(2);
    };

    /**
     * Tính dung lượng file
     * @param {*} bytes
     * @param {*} si
     * @param {*} dp
     * @return {string}
     */
    static viewFileSize = (bytes: number, si = false, dp = 1) => {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

        return bytes.toFixed(dp) + ' ' + units[u];
    };

    /**
     * get params _search từ p-table event
     * @param {*} event
     * @return {*}
     */
    static getSearchFromEvent = (event?: any) => {
        if (event) {
            delete event['filters'];
            delete event['multiSortMeta'];
        }
        return event;
    };

    /**
     * Build params for get request
     * @param {*} obj
     * @return {*}
     */
    static buildParams = (obj: any) => {
        return Object.entries(obj || {})
            .reduce((params: any, [key, value]) => {
                if (value === null || value === undefined) {
                    params[key] = String('');
                    return params;
                } else if (value && value instanceof Date) {
                    params[key] = value.getTime();
                    return params;
                } else if (typeof value === typeof {}) {
                    params[key] = JSON.stringify(value);
                    return params;
                } else {
                    params[key] = String(value);
                    return params;
                }
            }, {});
    };

    /**
     * Build params for post request
     * @param {*} dataPost
     * @return {*}
     */
    static convertFormFile = (dataPost: any): FormData => {
        const filteredData = Utils.convertData(dataPost);
        const formData = Utils.objectToFormData(filteredData, '', []);
        return formData;
    };

    /**
     * Convert data
     * @param {*} data
     * @return {*}
     */
    static convertData = (data: any): any => {
        if (data === null) {
            return data;
        }
        if (data instanceof Date) {
            return data.getTime();
        }
        if (typeof data === 'object') {
            return Utils.convertDataObject(data);
        }
        if (Array.isArray(data)) {
            return Utils.convertDataArray(data);
        } 
        if (typeof data === typeof true) {
            return Utils.convertBoolean(data);
        }
        return data;
    };

    /**
     * Convert data array
     * @param {*} data
     * @return {*}
     */
    static convertDataArray = (data: Array<any>): Array<any> => {
        if (data && data.length > 0) {
            // tslint:disable-next-line: forin
            for (const i in data) {
                data[i] = Utils.convertData(data[i]);
            }
        }
        return data;
    };

    /**
     * Convert data array
     * @param {*} data
     * @return {*}
     */
    static convertDataObject = (data: any): any => {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = Utils.convertData(data[key]);
            }
        }
        return data;
    };
    

    /**
     * Convert data boolean
     * @param {boolean} value
     * @return {*}
     */
    static convertBoolean = (value: boolean): number => {
        return value ? 1 : 0;
    };

    /**
     * Convert object to FormData
     * @param {*} obj
     * @param {*} rootName
     * @param {*} ignoreList
     * @return {*}
     */
    static objectToFormData = (obj: any, rootName: any, ignoreList: any): FormData => {
        const formData = new FormData();
        function appendFormData(data: any, root: any): void {
            if (!ignore(root)) {
                root = root || '';
                if (data instanceof File) {
                    if (data.type !== 'stored_file') {
                        formData.append(root, data);
                    }
                } else if (Array.isArray(data)) {
                    // let index = 0;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] instanceof File) {
                            if (data[i].type !== 'stored_file') {
                                // appendFormData(data[i], root + '[' + index + ']');
                                appendFormData(data[i], root);
                                // index++;
                            }
                        } else if (data[i] && typeof data[i] === 'object') {
                            appendFormData(data[i], root + '[' + i + ']');
                        } else {
                            appendFormData(data[i], root + '[' + i + ']');
                        }
                    }
                } else if (data && data instanceof Date) {
                    formData.append(root, data.getTime().toString());
                } else if (data && typeof data === 'object' && data.type !== 'stored_file') {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            // if (root === '') {
                            //     appendFormData(data[key], `[${key}]`);
                            // } else {
                            //     appendFormData(data[key], `${root}[${key}]`);
                            // }
                            if (root === '') {
                                appendFormData(data[key], `${key}`);
                            } else {
                                appendFormData(data[key], `${root}.${key}`);
                            }
                        }
                    }
                } else {
                    if (data !== null && typeof data !== 'undefined' && data.type !== 'stored_file') {
                        formData.append(root, data);
                    }
                }
            }
        }

        function ignore(root: any): any {
            return Array.isArray(ignoreList) && ignoreList.some(x => x === root);
        }

        appendFormData(obj, rootName);
        return formData;
    };
    /**
     * convert date to format
     * @param {*} value
     * @param {*} format
     * @returns
     */
     static convertDateToString = (timestamps: any, format: any = "DD/MM/YYYY") => {
        if (!timestamps) return null;
        return moment(timestamps).format(format);
    }
    /**
     * Scroll lên phần tử đầu tiên submit
     * @param event
     * @param defaultHandleSubmit
     */
    static focusOnSubmitError(event: SyntheticEvent<HTMLFormElement>, defaultHandleSubmit: Function) {
        defaultHandleSubmit(event); // formik validate and submit
        // thực hiện scroll to phần tử đầu tiên bị lỗi nếu có
        setTimeout(() => {
            // focus và scroll to element đầu tiên bị lỗi sau 100ms
            const html = event.target as HTMLInputElement;
            const element = html.querySelector('.p-invalid');
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {// thực hiện focus vào phần tử lỗi
                if (element?.classList.contains('p-dropdown')) {
                    (element as HTMLElement)?.click();
                } else if (element?.classList.contains('p-calendar')) {
                    const inputElement = element.querySelector('input');
                    inputElement?.focus();
                } else {
                    (element as HTMLElement)?.focus();
                }
            }, 400);
        }, 100)
    }

    static assignState = (state: any, params: any) => {
        _.assign(state, params);
    };

    static excuteFunction = (type: any, state: any, action: any, failure: any, succces: any) => {
        switch (action.type) {
            case REQUEST(type):
                Utils.assignState(state, {
                    action: ActionType.Request
                });
                return { ...state };
            case FAILURE(type):
                if (failure) return failure();
                Utils.assignState(state, {
                    errorMessage: action.payload,
                    suscessMessage: null,
                    action: ActionType.Error
                });
                return { ...state };
            case SUCCESS(type):
                return succces();
            default:
                return null;
        }
    };
    /**
     * nvl
     * param value
     * param defaultValue
   */
    static nvl(value: any, defaultValue: number = 0): number {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        return value;
    }
    /**
     * hàm xử lý lấy nationId hiện tại theo quốc gia
    */
    static getNationId(): number {
        return Utils.nvl(1740);
        // const selectedMarket = HrStorage.getSelectedMarket();
        // if (selectedMarket == null) {
        //     return 1740;
        // }
        // return CommonUtils.nvl(selectedMarket.nationId, 1740);
    }

    static confirmMessage = (messageCode: string, accept: Function, reject?: Function) => {
        confirmDialog({
            message: translate(messageCode),
            header: translate('common.confirm'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            acceptClassName: 'p-button-primary',
            rejectClassName: 'p-button-primary p-button-outlined',
            accept: () => {
                accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static confirmSaveOrUpdate = (accept: Function, reject?: Function) => {
        confirmDialog({
            message: translate('common.confirmSaveOrUpdate'),
            header: translate('common.confirm'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            acceptClassName: 'p-button-primary',
            rejectClassName: 'p-button-primary p-button-outlined',
            accept: () => {
                accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static confirmDelete = (accept: Function, reject?: Function) => {
        confirmDialog({
            message: translate('common.confirmDelete'),
            header: translate('common.confirm'),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: translate('common.acceptLabel'),
            rejectLabel: translate('common.rejectLabel'),
            acceptClassName: 'p-button-primary',
            rejectClassName: 'p-button-primary p-button-outlined',
            accept: () => {
                accept();
            },
            reject: () => {
                reject && reject();
            }
        });
    }

    static removeAccents = (str: any) => {
        const AccentsMap = [
          "aàảãáạăằẳẵắặâầẩẫấậ",
          "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
          "dđ", "DĐ",
          "eèẻẽéẹêềểễếệ",
          "EÈẺẼÉẸÊỀỂỄẾỆ",
          "iìỉĩíị",
          "IÌỈĨÍỊ",
          "oòỏõóọôồổỗốộơờởỡớợ",
          "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
          "uùủũúụưừửữứự",
          "UÙỦŨÚỤƯỪỬỮỨỰ",
          "yỳỷỹýỵ",
          "YỲỶỸÝỴ"
        ];
        for (var i = 0; i < AccentsMap.length; i++) {
            var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            var char = AccentsMap[i][0];
            str = str.replace(re, char);
        }
        return str;
    }

    /**
     * Hàm lấy danh sách năm trong khoảng xác định so với năm hiện tại
     * @param firstRange
     * @param secondRange
     */
    public static getYearList(firstRange: number = 20, secondRange: number = 0): any {
        const listYear = [];
        const currentYear = new Date().getFullYear();
        for (let i = (currentYear - firstRange); i <= (currentYear + secondRange); i++) {
        const obj = {
            year: i
        };
        listYear.push(obj);
        }
        return listYear;
    }

    static generateRandomString = (length: number = 6): string => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static encrAesEcb = (data: string) => {
        try {
            return CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse("8Js+s2i50melS4h42kbJdg=="), {
            mode: CryptoJS.mode.ECB
            }).toString().replace('+', '-').replace('/', '_').replace("%", "%25").replace("\n", "%0A");
        } catch (e) {
            console.error(e);
        }
      }
}
