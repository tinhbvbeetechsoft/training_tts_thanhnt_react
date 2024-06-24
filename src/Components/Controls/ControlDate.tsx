/**
 * Hướng dẫn sử dụng component
 * => Công dụng: render lên input dùng để chọn ngày giờ
 * => Thuộc tính:
 * labelKey: tên label của input
 * initialValue: giá trị mặc định của date
 * id: Id định danh duy nhất của phần tử.
 * property: thuộc tính của Control
 * disabled: có bị disable hay không true | false
 * required: có bắt buộc nhập hay không? true | false
 * 1 số thuộc tính khác tham khảo https://www.primefaces.org/primereact/calendar/
 */
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { connect, Options } from 'react-redux';
import { Calendar, CalendarChangeParams, CalendarProps } from 'primereact/calendar';
import { IRootState } from 'src/Services/Reducers';
import { Utils } from 'src/Utils/Utils';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import ErrorMessage from '../ErrorMessage';
import moment from 'moment';
type IControlDateProps = StateProps & DispatchProps & CalendarProps & IControlProps & {
}

const ControlDate = forwardRef((props: IControlDateProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue ? moment.utc(props.initialValue).toDate() : undefined);
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    useImperativeHandle(ref, () => ({
    }));

    useEffect(() => {
        setValue(props.initialValue ? moment.utc(props.initialValue).toDate() : undefined);
    }, [JSON.stringify(props.initialValue)]);

    const onChange = (e: CalendarChangeParams) => {
        const newValue = e.value as Date;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div className='form-control-wrap'>
            <Calendar
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                className={`w100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
                showIcon
                placeholder={translate(props.labelKey || '')}
            />
            <ErrorMessage errors={props?.errors} touched={props?.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
        </>
});

ControlDate.displayName = 'ControlDate';
ControlDate.defaultProps = {
    dateFormat: 'dd/mm/yy',
    hourFormat: '24',
    view: 'date',
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
)(ControlDate);
