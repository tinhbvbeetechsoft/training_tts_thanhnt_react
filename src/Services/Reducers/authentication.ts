
// export enum ActionSession {
//     None,
//     Request,
//     Done
// }

import LocalStorage from 'src/Utils/LocalStorage';
import { ActionEntity } from '../Models/ActionEntity';

/**
 * initial state
 */
const initialState = {
    datasource: new Map<string, any>(),
    redirectMessage: '' as string,
    isLoading: false as boolean,
    isAuthenticated: false as boolean,
    isCollapsed: LocalStorage.get(LocalStorage.KEYS.COLLAPSE_MENU) as boolean,
};

export const ACTION_TYPES = {
    CLEAR_AUTH: 'authentication/CLEAR_AUTH',
    ERROR_MESSAGE: 'authentication/ERROR_MESSAGE',
    SET_LOADING: 'authentication/SET_LOADING',
    SET_COLLAPSED: 'authentication/SET_COLLAPSED',
    UPDATE_DATASOURCE: 'authentication/UPDATE_DATASOURCE',
};

export type AuthenticationState = Readonly<typeof initialState>;

export default (state: AuthenticationState = initialState, action: ActionEntity): AuthenticationState => {
    switch (action.type) {
        case ACTION_TYPES.ERROR_MESSAGE:
            return {
                ...initialState,
                redirectMessage: action.message
            };
        case ACTION_TYPES.SET_COLLAPSED:
            return {
                ...initialState,
                isCollapsed: action.payload
            };
        case ACTION_TYPES.CLEAR_AUTH:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false
            };
        case ACTION_TYPES.UPDATE_DATASOURCE:
            const datasource = state.datasource || new Map<string, any>();
            const { key, value } = action.payload
            datasource.set(key, value);
            return {
                ...state,
                datasource: datasource
            };
        default:
            return {
                ...state,
            };
    }
};

export const displayAuthError = (message: string) => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const clearAuthentication = (messageKey: string) => (dispatch: any, getState: any) => {
    dispatch(displayAuthError(messageKey));
    dispatch({
        type: ACTION_TYPES.CLEAR_AUTH
    });
};

export const setLoading = (isLoading: boolean) => ({
    type: ACTION_TYPES.SET_LOADING,
    payload: isLoading
});


export const setCollapsed = (isCollapsed: boolean) => {
    LocalStorage.set(LocalStorage.KEYS.COLLAPSE_MENU, isCollapsed);
    return {
        type: ACTION_TYPES.SET_COLLAPSED,
        payload: isCollapsed
    }
}

export const handleUpdateDatasource = (key: any, value: any) => {
    return ({
        type: ACTION_TYPES.UPDATE_DATASOURCE,
        payload: { key, value }
    });
};