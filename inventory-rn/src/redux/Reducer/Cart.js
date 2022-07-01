import { types } from '../Action/actionTypes';
import { logfunction } from '../../helpers/FunctionHelper';

const initialState = {
  cartCount: 0,
  cartData: [],
};
export default (state = initialState, action) => {
  const { payload } = action;
  logfunction('PAYLOAD IN REDUCER CART', payload);
  switch (action.type) {
    case types.SUCCESS_CART:
      return {
        ...state,
        cartCount: payload.cartData.totalCount,
      };
    case types.SUCCESS_CHECKOUT:
      return {
        ...state,
        cartCount: 0,
      };
    default:
      return state;
  }
};
