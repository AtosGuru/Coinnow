import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
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

function CartView(props) {
  let cartProduct = props.products;

  return (
    <>
      <OtrixDivider size={'md'} />
      {cartProduct.length > 0 &&
        cartProduct.map(data => (
          <View style={styles.cartContent} key={data.cart_id}>
            <View style={styles.cartBox}>
              <View style={styles.imageView}>
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
                <TouchableOpacity
                  style={{ padding: 4 }}
                  onPress={() =>
                    props.navigation.navigate('ProductDetailScreen', {
                      id: data.id,
                    })
                  }>
                  <Text style={styles.name}>{data.name}</Text>
                </TouchableOpacity>
                <Text style={styles.price}>
                  {CURRENCY}
                  {data.special > 0 ? data.special : data.price}{' '}
                </Text>
                <View style={styles.plusminus}>
                  <TouchableOpacity
                    style={{ marginRight: wp('2.5%'), padding: 4 }}
                    onPress={() =>
                      data.quantity != 1 &&
                      props.decrementItem(data.cart_id, data.id, data.quantity)
                    }>
                    <Icon name="minus" style={styles.plusminusTxt} />
                  </TouchableOpacity>
                  <Text style={styles.quantityTxt}>{data.quantity}</Text>
                  <TouchableOpacity
                    style={{ marginLeft: wp('2.5%'), padding: 4 }}
                    onPress={() =>
                      props.incrementItem(data.cart_id, data.id, data.quantity)
                    }>
                    <Icon name="plus" style={styles.plusminusTxt} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => props.deleteItem(data.cart_id)}>
              <MatIcon name="trash" style={styles.delete} />
            </TouchableOpacity>
          </View>
        ))}
    </>
  );
}

export default CartView;
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
    marginLeft: wp('1.5%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('14%'),
    width: wp('100%'),
    flex: 0.9,
  },
  imageView: {
    flex: 0.3,
    backgroundColor: Colors.light_white,
    marginVertical: wp('1%'),
    marginRight: wp('4%'),
    height: hp('12%'),
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
    textAlign: 'center',
  },
  deleteIcon: {
    flex: 0.1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: wp('2%'),
    padding: 4,
  },
  delete: {
    fontSize: wp('3.6%'),
    color: Colors.secondry_text_color,
  },
});
