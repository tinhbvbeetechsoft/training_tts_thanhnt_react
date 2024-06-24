/**
 * Appends REQUEST async action type
 */

export const REQUEST = (actionType: any) => `${actionType}_PENDING`;

/**
 * Appends SUCCESS async action type
 */

export const SUCCESS = (actionType: any) => `${actionType}_FULFILLED`;

/**
 * Appends FAILURE async action type
 */

export const FAILURE = (actionType: any) => `${actionType}_REJECTED`;
