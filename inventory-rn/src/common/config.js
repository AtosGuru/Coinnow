import { APP_URL_ENV, BASE_URL_ENV, API_URL_ENV, ACCESS_TOKEN_ENV } from '@env';
export const APP_URL = APP_URL_ENV;
export const BASE_URL = BASE_URL_ENV;
export const API_URL = API_URL_ENV;
export const ACCESS_TOKEN = ACCESS_TOKEN_ENV;

export const AppStyle = {
  default: {
    paddingHorizontal: 15,
  },
};
export const currency = '₹';
export const logo = require('../assets/images/logo.png');
export const splashlogo = require('../assets/images/splash_logo.png');

//bottom tab images
export const bottomHome = require('../assets/images/bottomtab/Bottom_Home.png');
export const bottomHomeFill = require('../assets/images/bottomtab/Botto_Home_Fill.png');
export const bottomCategory = require('../assets/images/bottomtab/Bottom_Category.png');
export const bottomCategoryFill = require('../assets/images/bottomtab/Bottom_Category_Fill.png');
export const bottomCart = require('../assets/images/bottomtab/Bottom_cart.png');
export const bottomCart2 = require('../assets/images/bottomtab/Bottom_cart2.png');
export const bottomProfile = require('../assets/images/bottomtab/Bottom_Profile.png');
export const bottomProfileFill = require('../assets/images/bottomtab/Bottom_Profile_Fill.png');
export const bottomSetting = require('../assets/images/bottomtab/Bottom_Setting.png');
export const bottomSettingFill = require('../assets/images/bottomtab/Bottom_Setting_Fill.png');

//social images
export const google = require('../assets/images/google.png');
export const facebook = require('../assets/images/facebook.jpg');
export const twitter = require('../assets/images/twitter.jpg');

//common images
export const menu = require('../assets/images/menu.png');
export const offerBanner = require('../assets/images/banner2.jpg');
export const back = require('../assets/images/back.png');
export const filter = require('../assets/images/filter.png');
export const checkaround = require('../assets/images/check.png');
export const close = require('../assets/images/cancel.png');
export const checkround2 = require('../assets/images/check2.png');
export const circle = require('../assets/images/circle.png');
export const checked = require('../assets/images/checked.png');
export const avatarImg = require('../assets/images/man.jpg');
export const heart = require('../assets/images/heart.png');
export const avatarImg2 = require('../assets/images/user.png');
export const emptyBox = require('../assets/images/box.png');
export const congratulation = require('../assets/images/congratulation.png');
export const shipping = require('../assets/images/shipping_fast.png');
export const refund = require('../assets/images/my_return.png');

HEADER = new Headers();
HEADER.append('Accept', 'application/json');
HEADER.append('Content-Type', 'application/x-www-form-urlencoded');
