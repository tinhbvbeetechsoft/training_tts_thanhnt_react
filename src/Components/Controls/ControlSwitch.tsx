/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra công tắc bật tắt với giá trị true | false
 * => Thuộc tính:
 * labelKey: giá trị của label
 * initialValue :giá trị mặc định của switch
 * required: có phải bắt buộc chọn? true | false
 * disabled: có bị disable ? true | false
 * 1 số thuộc tính khác https://www.primefaces.org/primereact/inputswitch/
 */
/** @jsxImportSource @emotion/react */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { InputSwitch, InputSwitchChangeParams, InputSwitchProps } from 'primereact/inputswitch';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { Utils } from 'src/Utils/Utils';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import ErrorMessage from '../ErrorMessage';

type IControlSwitchProps = StateProps & DispatchProps & InputSwitchProps & IControlProps & {
}

const ControlSwitch = forwardRef((props: IControlSwitchProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    const onChange = (e: InputSwitchChangeParams) => {
        const newValue = e.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

    useImperativeHandle(ref, () => ({
    }));

    return (
        <>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
            <div className='form-control-wrap'>
                <InputSwitch
                    {...restProps}
                    id={controlId}
                    name={props.property}
                    checked={value == 1}
                    className={`${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                />
            </div>
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </>
    )
});

ControlSwitch.displayName = 'ControlSwitch';

ControlSwitch.defaultProps = {
};

const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(ControlSwitch);
