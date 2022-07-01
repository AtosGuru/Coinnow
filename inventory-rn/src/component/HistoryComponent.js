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
  let item = props.history || {};
  const { type, quantity, created_at } = item;
  const product = item.product || {};
  const product_description = product.product_description || {};
  const message = React.useMemo(() => {
    let msg;
    switch (type) {
      case 'item_buy':
        msg = `You bought ${quantity} itemss(${product_description.name})`;
        break;
      case 'item_sell':
        msg = `You sold ${quantity} items(${product_description.name})`;
        break;
      case 'special_item_buy':
        msg = `You bought ${quantity} special items(${product_description.name})`;
        break;
      case 'special_item_sell':
        msg = `You sold ${quantity} special items(${product_description.name})`;
        break;
      case 'fight_item_buy':
        msg = `You won ${quantity} items(${product_description.name}) in fight`;
        break;
      case 'fight_item_sell':
        msg = `You lost ${quantity} items(${product_description.name}) in fight`;
        break;
      default:
        msg = '';
    }

    return msg;
  }, [type, product_description]);
  return (
    <>
      <OtrixDivider size={'md'} />

      <View style={styles.cartContent} key={item.id}>
        <View style={styles.cartBox}>
          <View style={styles.imageView}>
            <FastImage
              style={styles.image}
              source={{
                uri: item.product?.image
                  ? ASSETS_DIR + 'product/' + item.product?.image
                  : ASSETS_DIR + '/assets/img/default.png',
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <View style={styles.infromationView}>
            <View>
              <Text style={styles.name}>{message}</Text>
            </View>
            <Text style={styles.orderDate}>
              At {moment(item.created_at).format('DD MMM YYYY hh:mm:ss')}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default OrdersComponent;
const styles = StyleSheet.create({
  cartContent: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
  },
  cartBox: {
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    flex: 1,
  },
  imageView: {
    backgroundColor: Colors.light_white,
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
    flex: 1,
    marginBottom: hp('1.4%'),
    marginLeft: wp('1%'),
    marginTop: hp('1%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    textAlign: 'center',
    color: Colors.text_color,
    fontSize: 12,
    fontFamily: Fonts.Font_Bold,
  },
  orderDate: {
    textAlign: 'center',
    color: Colors.secondry_text_color,
    fontSize: wp('3%'),
    fontFamily: Fonts.Font_Regular,
  },
});
