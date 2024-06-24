import { isPromise, translate } from 'react-jhipster';
import { Toast } from 'src/Components/Toast/toast.utils';

const addErrorAlert = (message: string, key?: string, data?: any) => {
    // const msg = key ? translate(key, data) : message;
    // alert(msg);
    const msg = key ? translate(key, data) : message;
    Toast.error(msg);
};
export default () => (next: any) => (action: any) => {
    // If not a promise, continue on
    if (action && !isPromise(action.payload)) {
        return next(action);
    }

    /**
     *
     * The notification middleware serves to dispatch the initial pending promise to
     * the promise middleware, but adds a `then` and `catch.
     */
    return next(action)
        .then((response: any) => {
            if (action.meta && action.meta.successMessage) {
                Toast.success(action.meta.successMessage);
                // alert(action.meta.successMessage);
            } else if (response && response.action && response.action.payload && response.action.payload.headers) {
                const headers = response.action.payload.headers;
                let _alert = null;
                let _alertParams = null;
                Object.entries(headers).forEach(([k, v]) => {
                    if (k.toLowerCase().endsWith('app-alert')) {
                        _alert = v;
                    } else if (k.toLowerCase().endsWith('app-params')) {
                        _alertParams = v;
                    }
                });
                if (_alert) {
                    const alertParam = _alertParams;
                    Toast.success(translate(_alert, { param: alertParam }));
                    // alert(translate(_alert, { param: alertParam }));
                }
            }
            return Promise.resolve(response);
        })
        .catch((error: any) => {
            if (action.meta && action.meta.errorMessage) {
                Toast.error(action.meta.errorMessage);
                alert(action.meta.errorMessage);
            } else if (error && error.response) {
                const response = error.response;
                const data = response.data;
                if (!(response.status === 401 && (error.message === '' || (data && data.path && data.path.includes('/api/account'))))) {
                    let i;
                    switch (response.status) {
                        // connection refused, server not reachable
                        case 0:
                            addErrorAlert('Server not reachable', 'error.server.not.reachable');
                            break;

                        case 400: {
                            const headers = Object.entries(response.headers);
                            let errorHeader = null;
                            let entityKey = null;
                            headers.forEach(([k, v]) => {
                                if (k.toLowerCase().endsWith('app-error')) {
                                    errorHeader = v;
                                } else if (k.toLowerCase().endsWith('app-params')) {
                                    entityKey = v;
                                }
                            });
                            if (errorHeader) {
                                const entityName = translate('global.menu.entities.' + entityKey);
                                addErrorAlert(errorHeader, errorHeader, { entityName });
                            } else if (data !== '' && data.fieldErrors) {
                                const fieldErrors = data.fieldErrors;
                                for (i = 0; i < fieldErrors.length; i++) {
                                    const fieldError = fieldErrors[i];
                                    if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                                        fieldError.message = 'Size';
                                    }
                                    // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                                    const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                                    const fieldName = translate(`gatewayApp.${fieldError.objectName}.${convertedField}`);
                                    addErrorAlert(`Error on field "${fieldName}"`, `error.${fieldError.message}`, { fieldName });
                                }
                            } else if (data !== '' && data.message) {
                                addErrorAlert(data.message, data.message, data.params);
                            } else {
                                addErrorAlert(data || "Có lỗi xảy ra");
                            }
                            break;
                        }
                        case 404:
                            addErrorAlert('Not found', 'error.url.not.found');
                            break;

                        default:
                            if (data !== '' && data.error_description) {
                                addErrorAlert(data.error_description);
                            } else {
                                addErrorAlert(data);
                            }
                    }
                }
            } else if (error && error.config && error.config.url === 'api/account' && error.config.method === 'get') {
                /* eslint-disable no-console */
                console.log('Authentication Error: Trying to access url api/account with GET.');
            } else if (error && error.message) {
                Toast.error(error.message);
                // alert(error.message);
            } else {
                Toast.error('Unknown error!');
                // alert('Unknown error!');
            }
            return Promise.reject(error);
        });
};
