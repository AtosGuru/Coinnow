import { combineReducers } from 'redux';
import Cart from './Cart';
import MainScreenReducer from './MainScreenReducer';
import Auth from './Auth';
import Wishlist from './Wishlist';

const Reducers = combineReducers({
  mainScreenInit: MainScreenReducer,
  cart: Cart,
  auth: Auth,
  wishlist: Wishlist,
});

export default Reducers;
