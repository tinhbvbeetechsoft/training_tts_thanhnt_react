import { combineReducers } from 'redux';
import toastMsgState, { ToastMsgState } from 'src/Components/Toast/toast-msg.reducer';
import authenticationState, { AuthenticationState } from './authentication';
import locale, { LocaleState } from './locale';
export interface IRootState {
    readonly locale: LocaleState;
    readonly authenticationState: AuthenticationState;
    readonly toastMsgState: ToastMsgState;
}

const rootReducer = combineReducers<IRootState>({
    locale,
    authenticationState,
    toastMsgState,
});

export default rootReducer;
