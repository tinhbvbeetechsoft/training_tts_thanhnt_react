import React from 'react';
import { Route } from 'react-router-dom';
import { RouteProps } from 'react-router';
import ErrorBoundary from 'src/Components/Error/ErrorBoundary';
import { AUTHORITIES } from 'src/Enum/enums';
import { IRootState } from 'src/Services/Reducers';
import { connect, Options } from 'react-redux';

interface IOwnProps extends RouteProps {
    hasAnyAuthorities?: string[];
    hasBreadCrumb?: boolean
}

export interface IMenuPrivateRouteProps extends IOwnProps, StateProps, DispatchProps {
    componentDisplayName?: any;
    component?: any;
}

export const MenuPrivateRouteComponent = ({
    componentDisplayName,
    component: Component,
    hasBreadCrumb,
    isAuthorized,
    ...rest
}: IMenuPrivateRouteProps) => {

    if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);

    const checkAuthorities = (props: any) =>
        isAuthorized ? (
            <ErrorBoundary>
                <div className={`wrap-content`}>
                    {/* <Component {...props} popout={true} popoutParams = {props.match.params} /> */}
                    <Component {...props} />
                </div>
            </ErrorBoundary>
        ) : (
            <div className="insufficient-authority m-auto">
                <div className="alert alert-danger text-center">
                    <h1>403</h1>
                    <h5>Forbidden</h5>
                </div>
            </div>
        );

    const renderRedirect = (props: any) => {
        // if (isAuthenticated) {
        //   if (!isSessionHasBeenFetched) {
        //     return <div/>;
        //   } else {
        return checkAuthorities(props);
        //   }
        // }
        // return <Redirect
        //   to={{
        //     pathname: '/account/login',
        //     search: props.location.search,
        //     state: { from: props.location }
        //   }}
        // />
    };

    return <Route {...rest} render={renderRedirect} />;

    // return (
    //   <div className="wrap-container">
    //     <SidebarMenuLeft componentDisplay={componentDisplay}></SidebarMenuLeft>
    //     <Route {...rest} render={renderRedirect} />
    //   </div>
    // );
};

export const hasAnyAuthority = (hasAnyAuthorities: string[]) => {
    const { role } = localStorage.get('userInfo') || {};
    if (!role) {
        return hasAnyAuthorities.includes(AUTHORITIES.ANONYMOUS);
    }
    if (hasAnyAuthorities.length === 0) {
        return true;
    }
    return hasAnyAuthorities.includes(role.code);
};

const mapStateToProps = (
    { }: IRootState,
    { hasAnyAuthorities = [] }: IOwnProps
) => ({
    isAuthorized: true
});


MenuPrivateRouteComponent.defaultProps = {
    componentDisplayName: '',
    hasBreadCrumb: false,
    isAuthorized: true
};

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
};

type DispatchProps = typeof mapDispatchToProps;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
 const options = { pure: false };
export const MenuPrivateRoute = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(MenuPrivateRouteComponent);

export default MenuPrivateRoute;
