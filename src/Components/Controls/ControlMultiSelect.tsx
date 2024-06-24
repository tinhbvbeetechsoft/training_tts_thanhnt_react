/**
 * Hướng dẫn sử dụng component
 * => Công dụng: dùng để lựa chọn nhiều giá trị bên trong dropdown
 * => Thuộc tính:
 * labelKey: giá trị label của input
 * initialValue: giá trị mặc định của thẻ select
 * required: bắt buộc chọn giá trị bên trong ? true | false
 * id / property : id or tên thuộc tính của input file
 * baseService: tên Service gọi API lấy giá trị bên trong dropdown
 * disabled: có bị disable không ? true | false
 * 1 số thuộc tính khác tham khảo https://www.primefaces.org/primereact/multiselect/
 */
import { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import { Utils } from 'src/Utils/Utils';
import ErrorMessage from '../ErrorMessage';
import { store } from 'src';
import { handleUpdateDatasource } from 'src/Services/Reducers/authentication';
import { MultiSelect, MultiSelectChangeParams, MultiSelectProps } from 'primereact/multiselect';

type IControlDropdownMultiProps = StateProps & DispatchProps & MultiSelectProps & IControlProps & {
}

const ControlDropdownMulti = forwardRef((props: IControlDropdownMultiProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const controlId = props.id || props.property;
    const {errors, touched, property, labelKey, initialValue, fieldPath, required, baseService, callbackValueChange,  ...restProps} = props;
    //check control có bị lỗi không?
    const isInvalid = useMemo( (): boolean => {
        return Utils.isFormFieldValid(props?.errors, props?.touched, props.fieldPath || props.property)
    }, [props?.errors, props?.touched]);

    const placeholderDefault = useMemo(() => {
        let _placeholder = props.placeholder || "";
        if (_placeholder) {
            return _placeholder;
        }
        return _placeholder = props.required ? translate('common.requiredSelected') : translate('common.selected');
    }, [props?.placeholder, props.required]);

    const datasource = useMemo((): Array<any> => {
        if (!props.baseService) {
            return props.options || [];
        }
        const key = `${props.baseService.constructor.name}_${props.groupCode}`;
        const { datasource } = store.getState().authenticationState;
        if (datasource.get(key)) {
            return datasource.get(key) || [];
        } else {
            if (props.groupCode) {
                props.baseService.filterByGroupCode(props.groupCode).then((resp: any) => {
                    store.dispatch(handleUpdateDatasource(key, resp?.data?.data));
                    return resp?.data?.data || [];
                });
                return [];
            } else {
                props.baseService.findAll().then((resp: any) => {
                    store.dispatch(handleUpdateDatasource(key, resp?.data?.data));
                    return resp?.data?.data || [];
                }).catch((error: any) => {
                    console.log(">>>> error lazy loading multidropdown: ", error);
                    return [];
                });;
                return [];
            }
        }
    }, [props?.options, props?.baseService]);

    const onChange = (e: MultiSelectChangeParams) => {
        const newValue = e.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div className='form-control-wrap'>
            <MultiSelect
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                options={datasource}
                showClear
                placeholder={placeholderDefault}
                className={`w-100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
ControlDropdownMulti.displayName = 'ControlDropdownMulti';

ControlDropdownMulti.defaultProps = {
    display: 'chip'
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
)(ControlDropdownMulti);