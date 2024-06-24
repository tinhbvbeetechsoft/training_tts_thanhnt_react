import { ActionEntity } from 'src/Services/Models/ActionEntity';

const initialState = {
    message: null,
    type: null
};

export type ToastMsgState = Readonly<typeof initialState>;

// export enum MSG_TYPES {
//     SUCCESS,
//     ERROR,
//     INFO,
//     WARN
// };

export const MESSAGE_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARN: 'warn'
};

export const ACTION_TYPES = {
    UPDATE_MSG: 'toastMsg/UPDATE_MSG',
    CLEAR_MSG: 'toastMsg/CLEAR_MSG'
};

export default (state: ToastMsgState = initialState, action: ActionEntity): ToastMsgState => {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_MSG:
            setTimeout(clearMsg, 3000);
            return {
                ...state,
                message: action.payload.msg,
                type: action.payload.type
            };
        case ACTION_TYPES.CLEAR_MSG:
            return {
                ...state,
                message: null,
                type: null
            };
        default:
            return state;
    }
};

export const toastMsg = (type: string, msg: string) => ({
    type: ACTION_TYPES.UPDATE_MSG,
    payload: { type, msg }
});


export const clearMsg = () => ({
    type: ACTION_TYPES.CLEAR_MSG
});
