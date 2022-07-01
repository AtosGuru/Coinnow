import React from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { OtrixDivider } from '@component';
import Fonts from '@helpers/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GlobalStyles, Colors } from '@helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { ASSETS_DIR, CURRENCY } from '@env';
import moment from 'moment';

function OrdersComponent(props) {
  let item = props.orders;

  return (
    <>
      <OtrixDivider size={'md'} />

      <View style={styles.cartContent} key={item.id}>
        <View style={styles.cartBox}>
          <View style={styles.imageView}>
            <FastImage
              style={styles.image}
              source={{
                uri: item.products[0].image
                  ? ASSETS_DIR + 'product/' + item.products[0].image
                  : ASSETS_DIR + '/assets/img/default.png',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={styles.infromationView}>
            <View>
              <Text style={styles.name}>{item.products[0].name}</Text>
            </View>
            <Text style={styles.orderDate}>
              Ordered On {moment(item.order_date).format('DD MMM YYYY')}
            </Text>
            <Text style={styles.orderDate}>
              Order Status{' '}
              <Text style={styles.orderStatuss}>{item.order_status.name}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View style={GlobalStyles.horizontalLine} />
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('ProductDetailScreen', {
            id: item.products[0].product_id,
          })
        }
        style={styles.bottomButton}>
        <Text style={styles.bottomLeftTxt}>Buy it Again</Text>
        <Icon name="arrow-forward-ios" />
      </TouchableOpacity>
      <View style={GlobalStyles.horizontalLine} />
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('OrderDetailScreen', { orderData: item })
        }
        style={[styles.bottomButton, { marginBottom: hp('2%') }]}>
        <Text style={styles.bottomLeftTxt}>Order Details</Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Icon name="arrow-forward-ios" />
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
}

export default OrdersComponent;
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('11%'),
    width: wp('90%'),
    flex: 0.9,
  },
  imageView: {
    flex: 0.3,
    backgroundColor: Colors.light_white,
    margin: wp('0.5%'),
    height: hp('8%'),
    borderRadius: wp('1.5%'),
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: undefined,
    aspectRatio: 1,
    width: wp('15.5%'),
  },
  infromationView: {
    flex: 0.7,
    marginBottom: hp('1.4%'),
    marginLeft: wp('1%'),
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    textAlign: 'center',
    color: Colors.text_color,
    fontSize: wp('3.8%'),
    fontFamily: Fonts.Font_Bold,
  },
  orderDate: {
    textAlign: 'center',
    color: Colors.secondry_text_color,
    lineHeight: hp('3%'),
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Regular,
  },

  bottomButton: {
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
    marginBottom: hp('0%'),
  },
  bottomLeftTxt: {
    textAlign: 'left',
    fontSize: wp('3.8%'),
    flex: 0.9,
    color: Colors.black,
  },
  orderStatuss: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('3.5%'),
    color: Colors.text_color,
  },
});
