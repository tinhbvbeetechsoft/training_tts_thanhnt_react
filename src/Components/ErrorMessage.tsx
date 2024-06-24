import _ from 'lodash';
import React, { forwardRef, useMemo} from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { Utils } from 'src/Utils/Utils';

type IErrorMessageProps = {
    errors: any;
    property: string;
    touched: any;
    fieldPath?: string;
}

const ErrorMessage = forwardRef((props: IErrorMessageProps, ref: any) => {
    const msg = useMemo( (): string => {
        const name = props.fieldPath || props.property;
        const _touched = _.get(props.touched, name);
        if (_touched) {
            return Utils.getFormErrorMessage(props.errors, name);
        }
        return '';
    }, [props?.errors, props.touched]);

return <>{msg && <small className="p-error">{msg}</small>}</>;
})
ErrorMessage.displayName = 'ErrorMessage';

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(ErrorMessage);