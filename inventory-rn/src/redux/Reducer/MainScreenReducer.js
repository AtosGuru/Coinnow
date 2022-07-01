import { types } from '../Action/actionTypes';
import { logfunction } from '../../helpers/FunctionHelper';

const initialState = {
  loadApplication: false,
  navScreen: '',
};
export default (state = initialState, action) => {
  logfunction('STATE LOG ====', action.type);
  switch (action.type) {
    case types.REQUEST_INIT:
      return {
        ...state,
        loadApplication: false,
      };
    case types.SUCCESS_INIT:
      return {
        ...state,
        loadApplication: true,
        navScreen: action.payload.navigateScreen,
      };
    default:
      return state;
  }
};
