/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo các radio cho phép tick chọn
 * => Thuộc tính:
 * initialValue :giá trị mặc định của rađio
 * required: có phải bắt buộc chọn? true | false
 * isMultiLanguage: dùng đa ngôn ngữ cho radio : true | false
 * datasource: list data checkbox
 * optionlabel: giá trị hiển thị lên label của radio
 * optionvalue: giá trị của radio
 * 1 số thuộc tính khác https://www.primefaces.org/primereact/radiobutton/
 */
/** @jsxImportSource @emotion/react */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { RadioButton, RadioButtonChangeParams, RadioButtonProps } from 'primereact/radiobutton';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { css } from '@emotion/react';
import { Utils } from 'src/Utils/Utils';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import ErrorMessage from '../ErrorMessage';

type IControlRadioProps = StateProps & DispatchProps & RadioButtonProps & IControlProps & {
    isMultiLanguage?: boolean;
    datasource?: any[];
    optionlabel?: string;
    optionvalue?: string;
}

const fieldRadiobuttonCss = css`
.field-radiobutton>label {
    margin: 5px 10px 0px 5px;
    line-height: 1;
}
`;

const ControlRadio = forwardRef((props: IControlRadioProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    const onChange = (e: RadioButtonChangeParams) => {
        const newValue = e?.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

    useImperativeHandle(ref, () => ({
    }));

    const datasource = useMemo(() => {
        if (props.isMultiLanguage) {
            const _datasource = _.cloneDeep(props.datasource) || [];
            return _datasource.map((e: any) => {
                if (props.optionlabel) {
                    e[props.optionlabel] = translate(e[props.optionlabel]);
                }
                return e;
            });
        }
        return props.datasource || [];
    }, [props.datasource]);

    const optionvalue = useMemo(() => {
        return props.optionvalue || '';
    }, [props.optionvalue]);

    const optionlabel = useMemo(() => {
        return props.optionlabel || '';
    }, [props.optionlabel]);

    return (
        <>
            {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
            <div css={fieldRadiobuttonCss} className='form-control-wrap d-flex'>
                {datasource.map((item: any, idx: any) => {
                    return <div key={idx} className="field-radiobutton mr-5 d-flex">
                        <RadioButton
                            {...restProps}
                            id={controlId}
                            name={props.property}
                            inputId={`${props.property}_${item[optionvalue]}`}
                            value={item[optionvalue]}
                            className={`${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                            onChange={onChange} checked={value === item[optionvalue]} />
                        <label htmlFor={`${props.property}_${item[optionvalue]}`}>{item[optionlabel]}</label>
                    </div>;
                })}
            </div>
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </>
    )
});

ControlRadio.displayName = 'ControlRadio';

ControlRadio.defaultProps = {
    optionlabel: 'label',
    optionvalue: 'value'
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
)(ControlRadio);
