import {
    startExecuting,
    endExecuting,
    startExecutingBottom,
    endExecutingBottom
} from '../Services/Reducers/action-executing';
import _ from 'lodash';
import { ActionEntity } from '../Services/Models/ActionEntity';
import { preventDoubleClick, preventDoubleClickBottom } from './modulo-bridge';

export default function actionMiddleware(config = {}) {
    return (store: any) => (next: any) => (action: any) => {
        if (_.get(action, 'meta.ignoreLoading')) {
            return next(action);
        }
        const isPending = new RegExp(`_PENDING`, 'g');
        if (preventDoubleClick.findIndex((e: ActionEntity) => action.type.includes(e)) >= 0) {
            let exeAction = '';
            if (_.get(action, 'meta.namespace')) {
                exeAction = `${_.get(action, 'meta.namespace')}_`;
            }
            if (_.get(action, 'meta.fieldBelong')) {
                exeAction = `${_.get(action, 'meta.fieldBelong')}_`;
            }
            if (action.type.match(isPending)) {
                exeAction = `${exeAction}${action.type.replace('_PENDING', '')}`;
                store.dispatch(startExecuting(exeAction, true));
            } else {
                exeAction = `${exeAction}${action.type.replace('_FULFILLED', '').replace('_REJECTED', '')}`;
                // setTimeout(() => {
                store.dispatch(endExecuting(exeAction));
                // }, 200)
            }
        } else if (preventDoubleClickBottom.findIndex((e: ActionEntity) => action.type.includes(e)) >= 0) {
            if (action.type.match(isPending)) {
                store.dispatch(startExecutingBottom(action.type.replace('_PENDING', ''), true));
            } else {
                store.dispatch(
                    endExecutingBottom(action.type.replace('_FULFILLED', '').replace('_REJECTED', ''))
                );
            }
        }
        return next(action);
    };
}
