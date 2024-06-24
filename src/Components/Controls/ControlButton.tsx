/**
 * Hướng dẫn sử dụng component
 * => Công dụng: render lên button
 * => Thuộc tính:
 * type: button hoặc submit
 * mode: Màu button 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'default'
 * size: 'small' | 'medium' | 'large'
 * outline: Button có outline true | false
 * disabled: Button có bị disable true | false
 * 1 số thuộc tính khác tham khảo https://www.primefaces.org/primereact/button/
 */
import { forwardRef} from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { Button, ButtonProps } from 'primereact/button';
import _ from 'lodash';
import { BUTTON_TYPE, BUTTON_SIZE } from 'src/Enum/enums';
type IControlButtonProps = StateProps & DispatchProps & ButtonProps & {
    type?: 'button' | 'submit';
    property?: string; // tên button
    id?: string; // id button nếu không có thì sử dụng property
    disabled?: boolean;
    className?: string;
    mode?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'default';
    size?: 'small' | 'medium' | 'large';
    outline?: boolean;
}
export const ControlButtonStyleClass = {
    primary: 'p-button-primary',
    info: 'p-button-info',
    success: 'p-button-success',
    warning: 'p-button-warning',
    danger: 'p-button-danger',
    default: 'p-button-default',
    small: 'p-button-sm btn-sm',
    medium: 'btn-md',
    large: 'p-button-lg btn-lg',
}
const ControlButton = forwardRef((props: IControlButtonProps, ref: any) => {
    const controlId = props.id || props.property;
    const { property, mode, outline,  ...restProps} = props;
    const getStyleClass = (type: any) => {
        return _.get(ControlButtonStyleClass, type) || '';
    }
return (
    <>
        <Button
            {...restProps}
            id={controlId}
            name={props.property}
            tooltip={props.label}
            tooltipOptions={{ position: 'top' }}
            className={`${getStyleClass(props.mode)} ${getStyleClass(props.size)}${props.outline ? ' p-button-outlined' : '' }${props.disabled ? ' disable' : ''} ${props.className || ''}`}
        />
    </>
    );
})
ControlButton.displayName = 'ControlButton';

ControlButton.defaultProps = {
    type: 'button',
    mode: BUTTON_TYPE.PRIMARY,
    size: BUTTON_SIZE.MEDIUM,
    outline: false,
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
)(ControlButton);