import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ASSETS_DIR, CURRENCY } from '@env';
import FastImage from 'react-native-fast-image';
import {
  numberWithComma,
  logfunction,
  calculateOffPercentage,
} from '@helpers/FunctionHelper';
import moment from 'moment';

function SupplierSearchProducts(props) {
  let data = props.products;

  let special = 0;
  let off = '';
  for (let s = 0; s < data.length; s++) {
    if (data[s].special != null) {
      let startDate = moment(data[s].special.start_date, 'DD/MM/YYYY');
      let endDate = moment(data[s].special.end_date, 'DD/MM/YYYY');
      if (
        startDate <= moment(new Date(), 'DD/MM/YYYY') &&
        endDate >= moment(new Date(), 'DD/MM/YYYY')
      ) {
        special = data[s].special.price;
        off =
          calculateOffPercentage(data[s].price, data[s].special.price) +
          '% off';
      }
    }
  }

  return (
    <>
      {data.length > 0 &&
        data.map(item => (
          <TouchableOpacity
            style={styles.cartContent}
            key={item.id}
            // onPress={() =>
            //   props.navigation.navigate('ProductDetailScreen', { id: item.id })
            // }
            onLongPress={() => {
              props.onLongPress && props.onLongPress(item);
            }}>
            <View style={styles.cartBox}>
              <View style={styles.imageView}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: item.image
                      ? ASSETS_DIR + 'product/' + item.image
                      : ASSETS_DIR + '/assets/img/default.png',
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
              <View style={styles.infromationView}>
                <TouchableOpacity>
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
                {off != null && <Text style={styles.offerTxt}>{off} </Text>}
              </View>
              <View style={{ paddingRight: 12 }}>
                <Text style={{ color: Colors.themeColor, fontWeight: '700' }}>
                  X{item.quantity}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </>
  );
}

export default SupplierSearchProducts;
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
    width: wp('100%'),
    flex: 1,
  },
  imageView: {
    flex: 0.3,
    backgroundColor: Colors.light_white,
    margin: wp('1%'),
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
  // price: {
  //     textAlign: 'center',
  //     color: Colors.link_color,
  //     lineHeight: hp('4%'),
  //     fontSize: wp('5%'),
  //     fontFamily: Fonts.Font_Bold,
  // },
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
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
    lineHeight: hp('4%'),
    color: Colors.black,
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.5%'),
    lineHeight: hp('3.2%'),
    textDecorationLine: 'line-through',
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
