import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ErrorBoundaryRoute from 'src/Components/Error/ErrorBoundaryRoute';
import MenuPrivateRoute from './MenuPrivateRoute';
// const UsersRoutes = React.lazy(() => import('src/Pages/Users/UsersRoutes'));
const Home = React.lazy(() => import('src/Pages/Home/Home'));
const PageNotFound = React.lazy(() => import('src/Components/Error/PageNotFound'));
const ExceptionPage = React.lazy(() => import('src/Components/Error/ExceptionPage'));
import { IRootState } from 'src/Services/Reducers';
import Header from './Header/Header';
import AppMenu from './SidebarMenuLeft/AppMenu';
const LoginedComponent = ({ }) => {
    const renderComponent = () => {
        return (
            <>
                <Header></Header>
                <div className="app-content">
                    {/* <SidebarMenuLeft /> */}
                    <AppMenu />
                    <div className="app-box-content">
                        <Switch>
                            <Suspense fallback={<div>Loading...</div>}>
                                {/* <ErrorBoundaryRoute path="/setting/users" component={UsersRoutes} /> */}
                                <MenuPrivateRoute path="/" exact component={Home} />
                            </Suspense>
                            <ErrorBoundaryRoute component={PageNotFound} />
                            <ErrorBoundaryRoute component={ExceptionPage} />
                        </Switch>
                    </div>
                </div>
            </>
        );
    };
    return (
        <>
            {renderComponent()}
        </>
    );
};

const mapStateToProps = ({ }: IRootState) => ({
});

// type StateProps = ReturnType<typeof mapStateToProps>;

export const Logined = connect(
    mapStateToProps,
    // @ts-ignore
)(LoginedComponent);

export default Logined;

