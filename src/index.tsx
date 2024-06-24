
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/Font/fontawesome-free-6.1.1-web/css/all.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './Assets/Css/common.css';
import './Assets/Font/be-vietnam-pro/css/all.css';
import './App.css';
import './Assets/Css/layout.css';

import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import initStore from './Config/store';
import { bindActionCreators } from 'redux';
import { clearAuthentication } from './Services/Reducers/authentication';
import ErrorBoundary from './Components/Error/ErrorBoundary';
import { registerLocale } from './Config/translation';
import setupAxiosInterceptors from './Config/axios-interceptor';

const rootEl = document.getElementById('root');
const root = createRoot(rootEl as HTMLElement);

export const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

const render = (Component: any) =>
  // eslint-disable-next-line react/no-render-return-value
  root.render(
    <ErrorBoundary>
      <Provider store={store}>
        {/* If this slows down the app in dev disable it and enable when required  */}
        <Component />
      </Provider>
    </ErrorBoundary>
  );

render(App);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
