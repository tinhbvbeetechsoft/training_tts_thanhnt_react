import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

type IErrorBoundaryRouteProps = RouteProps & {
    component?: any;
}

export const ErrorBoundaryRoute = ({ component, ...rest }: IErrorBoundaryRouteProps) => {
    const Component = component as React.ElementType;
    const encloseInErrorBoundary = (props: any) => (
        <ErrorBoundary>
            <Component {...props} />
        </ErrorBoundary>
    );

    if (!Component) throw new Error(`A component needs to be specified for path ${(rest as any).path}`);

    return <Route {...rest} render={encloseInErrorBoundary} />;
};

export default ErrorBoundaryRoute;
