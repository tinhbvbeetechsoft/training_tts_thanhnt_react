import { RouteComponentProps, BrowserRouter } from 'react-router-dom';
import { IRootState } from './Services/Reducers';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import ErrorBoundary from './Components/Error/ErrorBoundary';
import AppRoutes from './Routes/AppRoutes';
import ToastMsg from './Components/Toast/ToastMsg';
import { ToastContainer } from 'react-toastify';
import 'src/Config/locale-validator';
import { ConfirmDialog } from 'primereact/confirmdialog';

type IAppProps = StateProps & DispatchProps & RouteComponentProps & {
    history?: any | undefined;
    location?: any | undefined;
    match?: any | undefined;
    staticContext?: any;
}

export const App = (props: IAppProps) => {
    return (
        <BrowserRouter>
            <>
                <div className={`app-container ${props.isCollapsed ? 'collapsed' : ''}`}>
                    <ErrorBoundary>
                        <AppRoutes />
                    </ErrorBoundary>
                </div>
                <ConfirmDialog />
                <ToastMsg />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
        </BrowserRouter>
    );
};
const mapStateToProps = ({authenticationState: {isCollapsed} }: IRootState) => ({
    isCollapsed
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(hot(module)(App));

