/**
 * Hướng dẫn sử dụng component
 * => Công dụng : dùng để nhập số
 * => Thuộc tính:
 * labelKey: giá trị label của input
 * addonLeft: vị trí của thẻ label(tiêu đề) ở bên trái
 * addonRight: vị trí của thẻ label(tiêu đề) ở bên phải
 * initialValue: giá trị mặc định
 * required: có phải bắt buộc nhập hay Không? true | false
 * disabled : có bị disable hay không? true | false
 */
/** @jsxImportSource @emotion/react */
import { forwardRef, useState, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { InputNumber, InputNumberChangeParams, InputNumberProps } from 'primereact/inputnumber';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import { Utils } from 'src/Utils/Utils';
import ErrorMessage from '../ErrorMessage';
import { css } from '@emotion/react';

type IControlNumberProps = StateProps & DispatchProps & InputNumberProps & IControlProps & {
    addonLeft?: string;
    addonRight?: string;
}

const fieldRadiobuttonCss = css`
.field-radiobutton>label {
    margin-left: 0.5rem;
    line-height: 1;
}
`;

const ControlNumber = forwardRef((props: IControlNumberProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || null);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    const onChange = (e: InputNumberChangeParams) => {
        const newValue = e.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div css={fieldRadiobuttonCss} className='form-control-wrap'>
            {/* <div className="p-inputgroup"> */}
                {props.addonLeft && <span className="p-inputgroup-addon">{props.addonLeft}</span>}
                <InputNumber
                    {...restProps}
                    id={controlId}
                    name={props.property}
                    value={value}
                    className={`w-100 ${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                    onChange={onChange}
                    placeholder={translate(props.labelKey || '')}
                />
                {props.addonRight && <span className="p-inputgroup-addon">{props.addonRight}</span>}
            {/* </div> */}
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
ControlNumber.displayName = 'ControlNumber';

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
)(ControlNumber);