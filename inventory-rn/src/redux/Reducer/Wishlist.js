import { types } from '../Action/actionTypes';
import { logfunction } from '../../helpers/FunctionHelper';
import getApi from '@apis/getApi';

const initialState = {
  wishlistCount: 0,
};
export default (state = initialState, action) => {
  const { payload } = action;
  logfunction('PAYLOAD IN REDUCER WISHLIST', payload);

  switch (action.type) {
    case types.SUCCESS_WISHLIST:
      return {
        ...state,
        wishlistCount: payload.wishlistData.length,
        wishlistData: payload.wishlistData,
      };
    case types.WISHLIST_ADD_REMOVE:
      let sendData = new FormData();
      sendData.append('product_id', payload.product_id);
      getApi.postData('user/addUpdateWishlist', sendData).then(response => {});
    default:
      return state;
  }
};
