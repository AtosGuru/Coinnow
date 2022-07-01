import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
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
import moment from 'moment';
import FastImage from 'react-native-fast-image';

function FlatListProductView(props) {
  const data = props.data;
  let off = null;
  let special = 0;
  let price = data.price != undefined ? data.price : data.product_details.price;

  if (data.special != null) {
    let startDate = moment(data.special.start_date, 'DD/MM/YYYY');
    let endDate = moment(data.special.end_date, 'DD/MM/YYYY');
    if (
      startDate <= moment(new Date(), 'DD/MM/YYYY') &&
      endDate >= moment(new Date(), 'DD/MM/YYYY')
    ) {
      special = data.special.price;
      off = calculateOffPercentage(price, data.special.price) + '% off';
    }
  }

  const wishlistArr = props.wishlistArray ? props.wishlistArray : null;

  return (
    <TouchableOpacity
      style={styles.productBox}
      onPress={() => props.navToDetail(data)}>
      <View
        style={[
          styles.imageView,
          {
            backgroundColor: props.imageViewBg
              ? props.imageViewBg
              : Colors.light_white,
          },
        ]}>
        {/* <Image source={{ uri: image ? ASSETS_DIR + 'product/' + image : ASSETS_DIR + '/assets/img/default.png' }} style={styles.image}
                ></Image> */}
        <FastImage
          style={styles.image}
          source={{
            uri: data.image
              ? ASSETS_DIR + 'product/' + data.image
              : ASSETS_DIR + '/assets/img/default.png',
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.infromationView}>
        {/*<View style={styles.starView}>
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
        </View>*/}
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
                {numberWithComma(price)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.price, { flex: 0.7 }]}>
              {CURRENCY}
              {numberWithComma(price)}
            </Text>
          )}
          {off != null && <Text style={styles.offerTxt}>{off} </Text>}
        </View>
      </View>

      {data.quantity == 0 && (
        <View style={GlobalStyles.outstockview}>
          <Text style={GlobalStyles.outofstockTxt}>Out of stock</Text>
        </View>
      )}

      {/* {wishlistArr &&
      wishlistArr.length > 0 &&
      wishlistArr.includes(data.id) ? (
        <TouchableOpacity
          style={GlobalStyles.FavCircle}
          onPress={() => props.addToWishlist(data.id)}>
          <Icon
            name="heart"
            style={GlobalStyles.unFavIcon}
            color={Colors.white}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            GlobalStyles.unFavCircle,
            { backgroundColor: Colors.light_white },
          ]}
          onPress={() => props.addToWishlist(data.id)}>
          <Icon
            name="heart-o"
            style={GlobalStyles.unFavIcon}
            color={Colors.secondry_text_color}
          />
        </TouchableOpacity>
      )}*/}
    </TouchableOpacity>
  );
}

export default FlatListProductView;

const styles = StyleSheet.create({
  productBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    paddingBottom: hp('1%'),
    width: wp('45%'),
    maxWidth: wp('45%'),
    marginHorizontal: wp('1%'),
    flex: 0.5,
    backgroundColor: Colors.white,
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: 'column',
  },
  imageView: {
    flex: 0.63,
    backgroundColor: Colors.black,
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
    flex: 0.37,
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
    bottom: hp('0.2%'),
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
