/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra thẻ input textarea
 * => Thuộc tính:
 * labelKey: giá trị của label
 * initialValue :giá trị mặc định của input
 * required: có phải bắt buộc chọn? true | false
 * disabled: có bị disable ? true | false
 * 1 số thuộc tính khác https://www.primefaces.org/primereact/inputtextarea/
 */
import React, { forwardRef, useState, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import { Utils } from 'src/Utils/Utils';
import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import ErrorMessage from '../ErrorMessage';

type IControlTextareaProps = StateProps & DispatchProps & InputTextareaProps & IControlProps & {
}

const ControlTextarea = forwardRef((props: IControlTextareaProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    const onChange = (e: any) => {
        const newValue = e?.target?.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div className='form-control-wrap'>
            <InputTextarea
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`form-control${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
                placeholder={translate(props.labelKey || '')}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
ControlTextarea.displayName = 'ControlTextarea';
ControlTextarea.defaultProps = {
}
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
)(ControlTextarea);