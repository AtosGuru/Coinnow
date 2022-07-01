import { types } from '../Action/actionTypes';
import { logfunction } from '../../helpers/FunctionHelper';

const initialState = {
  USER_AUTH: false,
  USER_DATA: {},
};

export default (state = initialState, action) => {
  const { payload } = action;
  logfunction('PAYLOAD IN REDUCER AUTH', payload);
  logfunction('PAYLOAD IN TYPE AUTH', action.type);

  switch (action.type) {
    case types.AUTH_STATUS:
      return {
        ...state,
        USER_AUTH: payload.status,
      };
    case types.AUTH_DATA:
      return {
        ...state,
        USER_DATA: payload.customerData,
      };
    default:
      return state;
  }
};
