/**
 * Hướng dẫn sử dụng component
 * => Công dụng: tạo ra hộp thoại lên màn hình và có thể custom lại bằng nội dung bên trong
 * Thuộc tính truyền vào: Tham khảo https://www.primefaces.org/primereact/dialog/
 */
import { forwardRef, useImperativeHandle, useState } from 'react';
import { connect, Options } from 'react-redux';
import { Dialog, DialogProps } from 'primereact/dialog';
import { IRootState } from 'src/Services/Reducers';

type IControlDialogProps = StateProps & DispatchProps & DialogProps & {
}

const ControlDialog = forwardRef((props: IControlDialogProps, ref: any) => {
    const [displayModal, setDisplayModal] = useState(false);

    const onHide = () => {
        setDisplayModal(false);
        props.onHide && props.onHide();
    };

    useImperativeHandle(ref, () => ({
        show() {
            setDisplayModal(true);
        },
        hide() {
            onHide();
        }
    }));

    return (
        <>
            <Dialog {...props} visible={displayModal} onHide={onHide}>
                {props.children}
            </Dialog>
        </>
    );
});

ControlDialog.displayName = 'ControlDialog';

ControlDialog.defaultProps = {
    style: { width: '50vw' },
    closeOnEscape: false,
    maximizable: true
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
)(ControlDialog);

