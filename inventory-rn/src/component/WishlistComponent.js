import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import MatIcon from 'react-native-vector-icons/FontAwesome5';
import { ASSETS_DIR, CURRENCY } from '@env';
import {
  numberWithComma,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import FastImage from 'react-native-fast-image';

function WishlistComponent(props) {
  let data = props.products;

  let off = null;
  let special = 0;

  if (data.special != null) {
    let startDate = moment(data.special.start_date, 'DD/MM/YYYY');
    let endDate = moment(data.special.end_date, 'DD/MM/YYYY');
    if (
      startDate <= moment(new Date(), 'DD/MM/YYYY') &&
      endDate >= moment(new Date(), 'DD/MM/YYYY')
    ) {
      special = data.special.price;
      off = calculateOffPercentage(data.price, data.special.price) + '% off';
    }
  }

  return (
    <>
      <OtrixDivider size={'md'} />
      {data.length > 0 &&
        data.map(item => (
          <View style={styles.cartContent} key={item.id.toString()}>
            <View style={styles.cartBox}>
              <View style={styles.imageView}>
                {/* <Image source={item.image} style={styles.image}
                                ></Image> */}
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item.image
                      ? ASSETS_DIR + 'product/' + item.image
                      : ASSETS_DIR + '/assets/img/default.png',
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View style={styles.infromationView}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('ProductDetailScreen', {
                      id: item.id,
                    })
                  }>
                  <Text style={styles.name}>
                    {item.product_description.name}
                  </Text>
                </TouchableOpacity>
                {special > 0 ? (
                  <View style={styles.SpcialView}>
                    <Text style={styles.price}>
                      {CURRENCY}
                      {numberWithComma(special)}{' '}
                    </Text>
                    <Text style={styles.originalPrice}>
                      {CURRENCY}
                      {numberWithComma(item.price)}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.price, { flex: 0.7 }]}>
                    {CURRENCY}
                    {numberWithComma(item.price)}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => props.deleteItem(item.id)}>
              <MatIcon name="trash" style={styles.delete} />
            </TouchableOpacity>
          </View>
        ))}
    </>
  );
}

export default WishlistComponent;
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('12%'),
    flex: 0.9,
  },
  imageView: {
    flex: 0.4,
    backgroundColor: Colors.light_white,
    height: hp('11%'),
    borderRadius: wp('1.5%'),
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: undefined,
    aspectRatio: 1,
    width: wp('21.5%'),
  },
  infromationView: {
    flex: 0.7,
    marginBottom: hp('1.4%'),
    marginLeft: wp('5%'),
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    textAlign: 'center',
    color: Colors.secondry_text_color,
    fontSize: wp('3.8%'),
    fontFamily: Fonts.Font_Bold,
  },
  price: {
    textAlign: 'center',
    color: Colors.link_color,
    lineHeight: hp('4%'),
    fontSize: wp('5%'),
    fontFamily: Fonts.Font_Bold,
  },
  plusminus: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  plusminusTxt: {
    fontSize: wp('3%'),
    color: Colors.secondry_text_color,
    textAlign: 'center',
  },
  quantityTxt: {
    fontSize: wp('4%'),
    color: Colors.text_color,
    marginHorizontal: wp('1%'),
    fontFamily: Fonts.Font_Bold,
    top: hp('0.2%'),
    textAlign: 'center',
  },
  deleteIcon: {
    flex: 0.1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: wp('2%'),
  },
  delete: {
    fontSize: wp('3.6%'),
    color: Colors.secondry_text_color,
  },
  priceView: {
    flex: 1,
    marginTop: hp('0.6%'),
    flexDirection: 'row',
  },
  price: {
    color: Colors.link_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
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
