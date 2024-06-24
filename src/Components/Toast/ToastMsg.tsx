import React from 'react';
import { Toast } from 'primereact/toast';
import { connect } from 'react-redux';
import { useEffect, useRef } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { clearMsg } from './toast-msg.reducer';
import { IRootState } from 'src/Services/Reducers';

export interface IToastMsgProps extends StateProps, DispatchProps {

}

const ToastMsg = (props: IToastMsgProps) => {
    const toast = useRef<any>(null);

    useEffect(() => {
        if (props.type && props.message) {
            toast.current.show({ severity: props.type, detail: props.message, life: 3000 });
            setTimeout(() => {
                props.clearMsg();
            }, 3000);
        }
    }, [props.type, props.message]);

    return (
        <>
            <Toast ref={toast} position="top-right" />
        </>
    );
};
const mapStateToProps = ({ toastMsgState }: IRootState) => ({
    type: toastMsgState.type,
    message: toastMsgState.message
});

const mapDispatchToProps = {
    clearMsg
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ToastMsg);
