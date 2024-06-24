import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import errorMiddleware from './error-middleware';
import notificationMiddleware from './notification-middleware';
import loggerMiddleware from './logger-middleware';
import actionMiddleware from './action-middleware';
import rootReducer, { IRootState } from '../Services/Reducers';

const defaultMiddlewares = [
  thunkMiddleware,
  errorMiddleware,
  notificationMiddleware,
  promiseMiddleware,
  actionMiddleware(),
  loggerMiddleware
];
const composedMiddlewares = (middlewares: any[]) =>
  process && process.env.NODE_ENV === 'development'
    ? compose(
      // @ts-ignore
      applyMiddleware(...defaultMiddlewares, ...middlewares),
    )
    : compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

const initialize = (initialState?: IRootState, middlewares = []) =>
  createStore(rootReducer, initialState, composedMiddlewares(middlewares));

export default initialize;
