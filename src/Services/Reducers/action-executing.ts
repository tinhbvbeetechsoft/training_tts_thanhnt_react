import update from 'immutability-helper';
import _ from 'lodash';

export const ACTION_TYPES = {
  ACTION_EXECUTING: 'executing/ACTION',
  ACTION_EXECUTING_BOTTOM: 'executing/ACTION_BOTTOM'
};

export const LOCATION_EXECUTING = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM'
};

const updateAction = (state: any, action: any, location: any) => {
  if (_.isNil(action.executing)) {
    return state;
  }
  if (action.executing) {
    return update(state, {
      actionInfo: {
        $push: [action.actionId]
      },
      location: { $set: location }
    });
  } else {
    const indexAction = state.actionInfo.findIndex((a: any) => a === action.actionId);
    return update(state, {
      actionInfo: {
        $splice: [[indexAction, 1]]
      },
      location: { $set: location }
    });
  }
};

const initialState = {
  actionInfo: [],
  location: LOCATION_EXECUTING.TOP
};

export type ActionExecutingState = Readonly<typeof initialState>;

export default (state: ActionExecutingState = initialState, action: any): ActionExecutingState => {
  if (action.type === ACTION_TYPES.ACTION_EXECUTING) {
    return updateAction(state, action.payload, LOCATION_EXECUTING.TOP);
  } else if (action.type === ACTION_TYPES.ACTION_EXECUTING_BOTTOM) {
    return updateAction(state, action.payload, LOCATION_EXECUTING.BOTTOM);
  } else {
    return {
      ...state
    };
  }
};

export const startExecuting = (actionId: string, checkExecuting?: boolean) => ({
  type: ACTION_TYPES.ACTION_EXECUTING,
  payload: { executing: checkExecuting, actionId } // TODO fix not click in detail screen
});

export const endExecuting = (actionId: string) => ({
  type: ACTION_TYPES.ACTION_EXECUTING,
  payload: { executing: false, actionId }
});

export const startExecutingBottom = (actionId: string, checkExecuting?: boolean) => ({
  type: ACTION_TYPES.ACTION_EXECUTING_BOTTOM,
  payload: { executing: checkExecuting, actionId }
});

export const endExecutingBottom = (actionId: string) => ({
  type: ACTION_TYPES.ACTION_EXECUTING_BOTTOM,
  payload: { executing: false, actionId }
});
