import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import { OtrixDivider } from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { close } from '@common';
import { _roundDimensions } from '@helpers/util';
import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-input-credit-card';

function CreditCartComponent(props) {
  const [formData, setData] = React.useState({
    valid: false,
    cvc: null,
    number: null,
    expiry: null,
  });

  const { valid } = formData;

  const _onChange = data => {
    if (data.valid) {
      setData({
        ...formData,
        valid: true,
      });
    } else {
      setData({
        ...formData,
        valid: false,
      });
    }
  };

  return (
    <View>
      {Platform.OS === 'ios' && <View style={{ height: hp('5%') }} />}
      <View style={styles.modelView}>
        <View style={styles.contentView}>
          <TouchableOpacity
            style={[{ left: wp('80%'), bottom: hp('10%') }]}
            onPress={() => props.closePayModal(false)}>
            <View style={styles.round}>
              <Image source={close} style={styles.button} />
            </View>
          </TouchableOpacity>
          <CreditCardInput onChange={_onChange} />
          <Button
            size="md"
            variant="solid"
            bg={Colors.themeColor}
            style={[
              GlobalStyles.button,
              {
                marginHorizontal: wp('4%'),
                top: hp('2%'),
                opacity: valid ? 1 : 0.7,
              },
            ]}
            onPress={() => (valid ? props.payWithCard() : null)}>
            <Text style={GlobalStyles.buttonText}>
              <Icon name="credit-card" size={wp('5%')} /> Pay Now
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default CreditCartComponent;

const styles = StyleSheet.create({
  modelView: {
    height: hp('100%'),
    width: wp('100%'),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  round: {
    justifyContent: 'center',
    alignItems: 'center',
    height: _roundDimensions()._height * 0.042,
    width: _roundDimensions()._height * 0.04,
    borderRadius: _roundDimensions()._borderRadius,
    backgroundColor: Colors.light_white,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    height: _roundDimensions()._height * 0.016,
    width: _roundDimensions()._height * 0.016,
  },
  contentView: {
    marginHorizontal: wp('4%'),
    bottom: hp('10%'),
  },
  paymentSuccess: {
    fontSize: wp('4.8%'),
    fontFamily: Fonts.Font_Semibold,
    textAlign: 'center',
  },
  checkImg: {
    height: hp('20%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  paymentDescTxt: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Regular,
    textAlign: 'left',
    left: wp('2.5%'),
    lineHeight: hp('3%'),
  },
});
