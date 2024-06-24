
import { translate } from 'react-jhipster';
import { MESSAGE_TYPE, toastMsg } from './toast-msg.reducer';
import { store } from 'src';
import { RESPONSE_TYPE } from 'src/Enum/enums';

/**
 * Hiển thị thông báo
 */
export class Toast {
    /**
     * Thông báo thành công
     * @param {string} message Nội dung thông báo
     */
    static success = (message: string) => {
        store.dispatch(toastMsg(MESSAGE_TYPE.SUCCESS, message));
    };

    /**
     * Thông báo thất bại
     * @param {string} message Nội dung thông báo
     */
    static error = (message: string) => {
        store.dispatch(toastMsg(MESSAGE_TYPE.ERROR, message));
    };


    /**
     * Thông báo cảnh báo
     * @param {string} message Nội dung thông báo
     */
    static warn = (message: string) => {
        store.dispatch(toastMsg(MESSAGE_TYPE.WARN, message));
    };

    /**
     * Thông báo thông tin
     * @param {string} message Nội dung thông báo
     */
    static info = (message: string) => {
        store.dispatch(toastMsg(MESSAGE_TYPE.INFO, message));
    };

    /**
     * Hiển thị thông báo
     * @param {string} type loại thông báo
     * @param {string} code mã thông báo
     * @param {string} message nội dung thông báo
     */
    static show = (type: string, code: string, message?: string) => {
        const msg = message ? message : translate(code);
        switch (type) {
            case RESPONSE_TYPE.SUCCESS:
                store.dispatch(toastMsg(MESSAGE_TYPE.SUCCESS, msg));
                break;
            case RESPONSE_TYPE.ERROR:
                store.dispatch(toastMsg(MESSAGE_TYPE.ERROR, msg));
                break;
            case RESPONSE_TYPE.WARNING:
                store.dispatch(toastMsg(MESSAGE_TYPE.WARN, msg));
                break;
            default:
                store.dispatch(toastMsg(MESSAGE_TYPE.INFO, msg));
                break;
        }
    };
}
