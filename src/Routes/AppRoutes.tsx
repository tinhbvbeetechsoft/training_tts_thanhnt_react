
import { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'src/Components/Error/ErrorBoundaryRoute';
import Logined from 'src/Layouts/Logined';

const AppRoutes = () => {
    return <>
        <Suspense fallback={<div>Loading</div>}>
            <>
                <Switch>
                    <ErrorBoundaryRoute path="/" component={Logined} />
                    {/* <ErrorBoundaryRoute component={ExceptionPage} /> */}
                </Switch>
            </>
        </Suspense>
    </>;
};

export default AppRoutes;
