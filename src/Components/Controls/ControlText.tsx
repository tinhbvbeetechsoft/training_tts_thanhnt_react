/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra thẻ input
 * => Thuộc tính:
 * labelKey: giá trị của label
 * initialValue :giá trị mặc định của input
 * required: có phải bắt buộc chọn? true | false
 * disabled: có bị disable ? true | false
 * 1 số thuộc tính khác https://www.primefaces.org/primereact/inputtext/
 * => Sự kiện:
 * onBlur: sự kiện khi blur ra khỏi inputtext
 * callbackValueBlur:
 */
import { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { InputText, InputTextProps } from 'primereact/inputtext';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import { Utils } from 'src/Utils/Utils';
import ErrorMessage from '../ErrorMessage';
import _ from 'lodash';

type IControlTextProps = StateProps & DispatchProps & InputTextProps & IControlProps & {
    onBlur?: Function;
    callbackValueBlur?: Function;
}

const ControlText = forwardRef((props: IControlTextProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const [isChangeValue, setIsChangeValue] = useState(false);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange, callbackValueBlur, ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useEffect(() => {
        setValue(_.cloneDeep(props.initialValue || ''));
    }, [JSON.stringify(props.initialValue)]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChangeValue(true);
        const newValue = event?.target?.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

    const onBlurValueEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isChangeValue) {
            setValue(event?.target?.value?.trim());
            props.callbackValueBlur && props.callbackValueBlur(props.fieldPath || props.property, null, _.cloneDeep(value));
        }
    }

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div className='form-control-wrap'>
            <InputText
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`form-control${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onBlur={onBlurValueEdit}
                onChange={onChange}
                placeholder={translate(props.labelKey || '')}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
ControlText.displayName = 'ControlText';

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
)(ControlText);