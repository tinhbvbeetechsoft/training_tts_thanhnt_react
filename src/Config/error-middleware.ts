import { isPromise } from 'react-jhipster';

const getErrorMessage = (errorData: any) => {
    let message = errorData.message;
    if (errorData.fieldErrors) {
        errorData.fieldErrors.forEach((fErr: any) => {
            message += `\nfield: ${fErr.field},  Object: ${fErr.objectName}, message: ${fErr.message}\n`;
        });
    }
    return message;
};

// eslint-disable-next-line react/display-name
export default () => (next: any) => (action: any) => {
    // If not a promise, continue on
    if (action && !isPromise(action.payload)) {
        return next(action);
    }

    /**
     *
     * The error middleware serves to dispatch the initial pending promise to
     * the promise middleware, but adds a `catch`.
     * It need not run in production
     */
    if (process && process.env.NODE_ENV === 'development') {
        // Dispatch initial pending promise, but catch any errors
        if (!action) {
            return null;
        }
        return next(action).catch((error: any) => {
            console.error(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`);

            // Toast.error('Có lỗi xảy ra!');
            if (error && error.response && error.response.data) {
                const message = getErrorMessage(error.response.data);
                console.error(`Actual cause: ${message}`);
            }

            return Promise.reject(error);
        });
    }
    return next(action).catch((_error: any) => {
        // Toast.error('Có lỗi xảy ra!');
    });
};
