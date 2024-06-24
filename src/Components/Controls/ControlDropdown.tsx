/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra dropdown và có thể lựa chọn một giá trị bên trong đó
 * => Thuộc tính:
 * initialValue: giá trị mặc định của dropdown
 * placeholder: chuỗi placeholder của dropdown khi chưa có giá trị bên trong
 * required: bắt buộc chọn giá trị bên trong ? true | false
 * options: list giá trị bên trong dropdown
 * disabled: có bị disable? true | false
 * baseService: tên Service gọi API lấy giá trị bên trong dropdown
 * groupCode:
 * className: tên class muốn custom vào dropdown
 * 1 số thuộc tính khác tham khảo https://www.primefaces.org/primereact/dropdown/
 */
import { forwardRef, useState, useEffect, useMemo } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { IControlProps } from '../interface/control-prop';
import { translate } from 'react-jhipster';
import { Utils } from 'src/Utils/Utils';
import ErrorMessage from '../ErrorMessage';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { store } from 'src';
import { handleUpdateDatasource } from 'src/Services/Reducers/authentication';
type IControlDropdownProps = StateProps & DispatchProps & DropdownProps & IControlProps & {
}

const ControlDropdown = forwardRef((props: IControlDropdownProps, ref: any) => {
    const [value, setValue] = useState(props.initialValue || '');
    const [datasource, setDatasource] = useState(props.options || []);
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
    }, [props?.placeholder, props.required])

    useEffect(() => {
        setValue(props.initialValue || '');
    }, [props.initialValue])

    useEffect(() => {
        const fetchDatasource = async () => {
            if (!props.baseService) {
                setDatasource(props.options || []);
                return;
            }
            const key = `${props.baseService.constructor.name}_${props.groupCode}`;
            const { datasource } = store.getState().authenticationState;
            if (datasource.get(key)) {
                return datasource.get(key) || [];
            } else {
                if (props.groupCode) {
                    const resultData = await props.baseService.filterByGroupCode(props.groupCode);
                    if (resultData.isSuccess()) {
                        store.dispatch(handleUpdateDatasource(key, resultData.getData()));
                        setDatasource(resultData.getData());
                    } else {
                        setDatasource([]);
                    }
                } else {
                    const resultData = await props.baseService.findAll();
                    if (resultData.isSuccess() && resultData.hasData()) {
                        // store.dispatch(handleUpdateDatasource(key, resultData.getData()));
                        setDatasource(resultData.getData());
                    } else {
                        setDatasource([]);
                    }
                }
            }
        }
        fetchDatasource()
    }, [props?.options, props?.baseService]);

    const onChange = (e: any) => {
        const newValue = e?.target?.value;
        setValue(newValue);
        props.callbackValueChange && props.callbackValueChange(props.fieldPath || props.property, null, newValue);
    };

return (
    <>
        {props.labelKey ? <label className={`control-label ${props.required ? 'required' : ''}`} htmlFor={props.property}>{translate(props.labelKey)}</label> : ''}
        <div className='form-control-wrap'>
            <Dropdown
                filter={true}
                {...restProps}
                id={controlId}
                name={props.property}
                value={value}
                options={datasource}
                showClear
                placeholder={placeholderDefault}
                className={`w-100${props.disabled ? ' disable' : ''}${isInvalid ? ' p-invalid' : ''} ${props.className || ''}`}
                onChange={onChange}
                dataKey={props.optionValue}
                ariaLabel={props.property}
            />
            <ErrorMessage errors={props?.errors} touched={props.touched} property={props.property} fieldPath={props.fieldPath}/>
        </div>
    </>
    );
})
ControlDropdown.displayName = 'ControlDropdown';

ControlDropdown.defaultProps = {
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
)(ControlDropdown);