import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  OtrixAlert,
  HomeSlider,
  HomeManufacturerView,
  HomeCategoryView,
  SearchBar,
  NewProduct,
  TrendingProduct,
  BestDeal,
} from '@component';
import { HomeSkeleton } from '@skeleton';
import { addToWishList } from '@actions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors, GlobalStyles } from '@helpers';
import { bindActionCreators } from 'redux';
import { Badge, Avatar } from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';

import { heart, offerBanner, avatarImg, avatarImg2 } from '@common';
import Fonts from '@helpers/Fonts';
import { _roundDimensions } from '@helpers/util';
import { _addToWishlist, logfunction } from '@helpers/FunctionHelper';
import getApi from '@apis/getApi';
import { ASSETS_DIR } from '@env';

function HomeScreen(props) {
  const [state, setState] = React.useState({
    homePageData: [],
    loading: true,
    profileImageURL: null,
  });

  const bottomMenu = React.useRef();
  const [showMessage, setShowLoading] = React.useState(false);
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const selectedProduct = React.useRef(null);

  const addToWish = async id => {
    let wishlistData = await _addToWishlist(id);
    props.addToWishList(wishlistData, id);
  };

  useEffect(() => {
    getApi.getData('getHomePage', []).then(response => {
      if (response.status == 1) {
        logfunction('RESPONSEEE ', response);
        setState({
          ...state,
          homePageData: response.data,
          loading: false,
        });
      }
    });
  }, []);

  const onPressBuy = () => {
    bottomMenu.current?.close();
    let sendData = new FormData();
    sendData.append('id', selectedProduct.current?.id);

    getApi.postData('seller/buyProduct', sendData).then(response => {
      logfunction('RESPONSE ORDER  ', response);
      if (response.status == 1) {
        setType('success');
        setMessage(response.message);
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      } else {
        setType('error');
        setMessage(JSON.stringify(response.message));
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const _renderBottomMenu = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <TouchableOpacity style={styles.menuItem} onPress={onPressBuy}>
          <Text>Buy with balance</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const { homePageData, loading, profileImageURL } = state;
  const { USER_AUTH, wishlistData, customerData, wishlistCount } = props;
  logfunction('profile Image ', customerData);
  logfunction('wishlistData wishlistData ', wishlistData);
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.white }}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          {USER_AUTH ? (
            customerData.creation == 'D' ? (
              customerData.image != null ? (
                <Image
                  style={styles.avatarImg}
                  source={{
                    uri: ASSETS_DIR + 'user/' + customerData.image,
                  }}
                />
              ) : (
                <Image
                  ml="3"
                  size="sm"
                  style={styles.avatarImg}
                  source={avatarImg}
                />
              )
            ) : (
              <Image
                style={styles.avatarImg}
                source={{
                  uri: customerData.image,
                }}
              />
            )
          ) : (
            <Image
              ml="3"
              size="sm"
              style={styles.avatarImg}
              source={avatarImg2}
            />
          )}
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headingTxt}>Weird App</Text>
        </View>

        {!loading && (
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => {
              USER_AUTH
                ? props.navigation.navigate('WishlistScreen')
                : props.navigation.navigate('LoginScreen');
            }}>
            <Image source={heart} style={styles.heartIcon} />
            {wishlistCount > 0 && (
              <Badge
                style={[
                  GlobalStyles.badge,
                  {
                    height:
                      wishlistCount > 9
                        ? _roundDimensions()._height * 0.038
                        : _roundDimensions()._height * 0.032,
                    width:
                      wishlistCount > 9
                        ? _roundDimensions()._height * 0.038
                        : _roundDimensions()._height * 0.032,
                    borderRadius: _roundDimensions()._borderRadius,
                    right: wishlistCount > 9 ? -wp('0.6%') : wp('0.2%'),
                    top: wishlistCount > 9 ? -hp('0.5%') : hp('0.1%'),
                  },
                ]}>
                <Text
                  style={[
                    GlobalStyles.badgeText,
                    styles.countText,
                    { fontSize: wishlistCount > 9 ? wp('2.2%') : wp('3%') },
                  ]}>
                  {wishlistCount}
                </Text>
              </Badge>
            )}
          </TouchableOpacity>
        )}
      </OtrixHeader>

      {loading ? (
        <HomeSkeleton />
      ) : (
        <OtrixContent>
          {/* SearchBar Component */}
          <SearchBar navigation={props.navigation} />

          {/* HomeCategoryView Component */}
          <HomeCategoryView
            navigation={props.navigation}
            data={homePageData.categories}
          />

          {/* HomeSlider Component */}
          <HomeSlider data={homePageData.banners} />
          <OtrixDivider size={'md'} />

          {/* NewProduct Component */}
          <NewProduct
            navigation={props.navigation}
            wishlistArr={wishlistData}
            data={
              homePageData.newProducts.length > 0
                ? homePageData.newProducts.slice(0, 4)
                : []
            }
            arr={homePageData.newProducts}
            addToWishlist={addToWish}
            userAuth={props.USER_AUTH}
          />

          {/* HomeManufacturerView Component */}
          <HomeManufacturerView
            navigation={props.navigation}
            data={homePageData.manufacturers}
          />

          {/* BestDeal Component */}
          <BestDeal
            navigation={props.navigation}
            data={
              homePageData.dodProducts.length > 0
                ? homePageData.dodProducts.slice(0, 4)
                : []
            }
            arr={homePageData.dodProducts}
            wishlistArr={wishlistData}
            addToWishlist={addToWish}
            userAuth={props.USER_AUTH}
          />
          <OtrixDivider size={'sm'} />

          {/* Banner Image */}
          <Image source={offerBanner} style={styles.bannerStyle} />
          <OtrixDivider size={'sm'} />

          {/* TrendingProduct Component */}
          <TrendingProduct
            navigation={props.navigation}
            data={
              homePageData.trendingProducts.length > 0
                ? homePageData.trendingProducts.slice(0, 4)
                : []
            }
            arr={homePageData.trendingProducts}
            wishlistArr={wishlistData}
            addToWishlist={addToWish}
            userAuth={props.USER_AUTH}
          />
        </OtrixContent>
      )}
      <RBSheet
        ref={bottomMenu}
        height={300}
        closeOnDragDown
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}>
        {_renderBottomMenu()}
      </RBSheet>
      {showMessage && <OtrixAlert type={type} message={message} />}

    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    USER_AUTH: state.auth.USER_AUTH,
    wishlistData: state.wishlist.wishlistData,
    wishlistCount: state.wishlist.wishlistCount,
    customerData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToWishList,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  headerRight: {
    flex: 0.15,
    marginRight: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: wp('6.5%'),
    height: hp('6.5%'),
    resizeMode: 'contain',
    tintColor: Colors.custom_pink,
  },
  headerCenter: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6.5%'),
    color: Colors.themeColor,
  },
  headerLeft: {
    flex: 0.15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bannerStyle: {
    resizeMode: 'contain',
    width: wp('100%'),
    height: hp('16%'),
    alignSelf: 'center',
  },
  avatarImg: {
    height: _roundDimensions()._height * 0.055,
    width: _roundDimensions()._height * 0.055,
    borderRadius: _roundDimensions()._borderRadius,
    marginLeft: wp('3%'),
  },
});
