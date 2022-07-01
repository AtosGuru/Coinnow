import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ASSETS_DIR, CURRENCY } from '@env';
import {
  numberWithComma,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import FastImage from 'react-native-fast-image';

function DealsProduct(props) {
  const data = props.data;
  const wishlistArr = props.wishlistArray ? props.wishlistArray : null;

  let off = null;
  let special = 0;
  if (data.special != null) {
    special = data.special.price;
    off =
      calculateOffPercentage(data.product_details.price, data.special.price) +
      '% off';
  }

  return (
    <TouchableOpacity
      style={styles.productBox}
      onPress={() => props.navToDetail(data)}>
      <View style={styles.imageView}>
        {/* <Image source={{ uri: data.product_details.image ? ASSETS_DIR + 'product/' + data.product_details.image : ASSETS_DIR + '/assets/img/default.png' }} style={styles.image}
                ></Image> */}
        <FastImage
          style={styles.image}
          source={{
            uri: data.product_details.image
              ? ASSETS_DIR + 'product/' + data.product_details.image
              : ASSETS_DIR + '/assets/img/default.png',
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.infromationView}>
        <View style={styles.starView}>
          <Stars
            default={data.review_avg ? parseFloat(data.review_avg) : 0}
            count={5}
            half={true}
            starSize={45}
            fullStar={
              <Icon name={'star'} size={11} style={[styles.myStarStyle]} />
            }
            emptyStar={
              <Icon
                name={'star-o'}
                size={11}
                style={[styles.myStarStyle, styles.myEmptyStarStyle]}
              />
            }
            halfStar={
              <Icon
                name={'star-half-empty'}
                size={11}
                style={[styles.myStarStyle]}
              />
            }
            disabled={true}
          />
        </View>
        <Text style={styles.productName} numberOfLines={2}>
          {data.product_description.name}
        </Text>
        <View style={styles.priceView}>
          {special > 0 ? (
            <View style={styles.SpcialView}>
              <Text style={styles.price}>
                {CURRENCY}
                {numberWithComma(special)}{' '}
              </Text>
              <Text style={styles.originalPrice}>
                {CURRENCY}
                {numberWithComma(data.product_details.price)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.price, { flex: 0.7 }]}>
              {CURRENCY}
              {numberWithComma(data.product_details.price)}
            </Text>
          )}
          {off != null && <Text style={styles.offerTxt}>{off} </Text>}
        </View>
      </View>
      {data.out_of_stock && (
        <View style={GlobalStyles.outstockview}>
          <Text style={GlobalStyles.outofstockTxt}>Out of stock</Text>
        </View>
      )}
      {data.out_of_stock == false && data.new == true && (
        <View style={GlobalStyles.newtextView}>
          <Text style={GlobalStyles.newTxt}>New</Text>
        </View>
      )}
      {wishlistArr &&
      wishlistArr.length > 0 &&
      wishlistArr.includes(data.product_id) ? (
        <TouchableOpacity
          style={GlobalStyles.FavCircle}
          onPress={() => props.addToWishlist(data.product_id)}>
          <Icon
            name="heart"
            style={GlobalStyles.FavIcon}
            color={Colors.white}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={GlobalStyles.unFavCircle}
          onPress={() =>
            props.userAuth
              ? props.addToWishlist(data.product_id)
              : props.navToLogin()
          }>
          <Icon
            name="heart-o"
            style={GlobalStyles.unFavIcon}
            color={Colors.secondry_text_color}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export default DealsProductView = React.memo(DealsProduct);

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: wp('100%'),
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'column',
  },
  imageView: {
    flex: 0.63,
    backgroundColor: Colors.light_white,
    width: wp('42.2%'),
    borderTopStartRadius: wp('2%'),
    borderTopEndRadius: wp('2%'),
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: hp('16%'),
    width: wp('30%'),
  },
  infromationView: {
    flex: 0.4,
    width: wp('40%'),
  },
  starView: {
    alignItems: 'flex-start',
    marginVertical: hp('0.6%'),
  },
  myStarStyle: {
    color: '#ffd12d',
    backgroundColor: 'transparent',
    marginHorizontal: 1,
    textShadowRadius: 1,
  },
  myEmptyStarStyle: {
    color: 'gray',
  },
  productName: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.5%'),
  },
  priceView: {
    flex: 1,
    marginTop: hp('0.6%'),
    flexDirection: 'row',
  },
  price: {
    color: Colors.black,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('3.5%'),
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.6%'),
    textDecorationLine: 'line-through',
    bottom: hp('0.1%'),
  },
  offerTxt: {
    flex: 0.3,
    textAlign: 'center',
    color: Colors.link_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('2.2%'),
    textTransform: 'uppercase',
    borderRadius: 5,
  },
  SpcialView: {
    flex: 0.7,
    flexDirection: 'row',
  },
});
