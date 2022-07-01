import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixContent,
  OtrixLoader,
  OtrixAlert,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';
import { close } from '@common';
import { ASSETS_DIR, CURRENCY } from '@env';
import { numberWithComma, logfunction } from '@helpers/FunctionHelper';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Input,
  FormControl,
  Button,
  TextArea,
  Select,
  CheckIcon,
  InfoOutlineIcon,
} from 'native-base';
import Stars from 'react-native-stars';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

function OrderDetailScreen(props) {
  const { orderData } = props.route.params;
  const [state, setState] = React.useState({
    rateReview: false,
    loading: false,
    name: null,
    star: 0,
    submited: false,
    productID: null,
    message: null,
    type: 'error',
  });
  const {
    rateReview,
    name,
    star,
    message,
    loading,
    submited,
    productID,
    type,
  } = state;
  const [errors, setErrors] = React.useState({});
  const [showMessage, setShowLoading] = React.useState(false);

  const validate = () => {
    if (star == 0) {
      setErrors({
        ...errors,
        star: 'Star is required',
      });
      return false;
    } else if (name == null) {
      setErrors({
        ...errors,
        name: 'Name is required',
      });
      return false;
    }

    return true;
  };

  const submit = () => {
    setState({
      ...state,
      loading: true,
      rateReview: false,
      submited: true,
    });
    if (validate()) {
      let sendData = new FormData();
      sendData.append('text', name);
      sendData.append('rating', star);
      sendData.append('product_id', productID);

      setState({
        ...state,
        loading: true,
      });

      //login to our server 🧛🏻‍♀️
      try {
        getApi.postData('user/addReview', sendData).then(response => {
          logfunction('Social RESPONSE ', response);
          if (response.status == 1) {
            logfunction('RESPONSE ', 'Success');
            setState({
              ...state,
              text: null,
              star: 0,
              rateReview: false,
              loading: false,
              message: response.message,
              type: 'success',
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 3000);
          } else {
            //navigation part  😎
            setState({
              ...state,
              type: 'error',
              rateReview: false,
              message: response.message,
              loading: false,
            });
            setShowLoading(true);
            setTimeout(() => {
              setShowLoading(false);
            }, 3000);
          }
        });
      } catch (error) {
        logfunction('Error', error);
        setState({
          ...state,
          loading: false,
        });
      }
    }
  };

  useEffect(() => {}, []);

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.goBack()}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Orders Details </Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      {loading && <OtrixLoader />}
      <OtrixContent style={styles.addressContent}>
        <View
          style={styles.addressBox}
          showsHorizontalScrollIndicator={false}
          vertical={true}>
          <OtrixDivider size={'md'} />
          <Text style={styles.deliveryTitle}>View Orders Details</Text>
          <OtrixDivider size={'sm'} />
          <View style={styles.cartContent}>
            <View style={[styles.detailBox, { height: hp('15%') }]}>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Order Date</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>{orderData.order_date}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Payment Method</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>
                    {orderData.payment_method}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Order</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>#{orderData.id}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={[styles.leftTxt]}>Order Total</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>{orderData.grand_total}</Text>
                </View>
              </View>
            </View>
          </View>

          <OtrixDivider size={'md'} />
          <Text style={styles.deliveryTitle}>Shipping Address</Text>
          <OtrixDivider size={'sm'} />
          <View style={styles.cartContent}>
            <TouchableOpacity style={[styles.deliveryBox]}>
              <Text style={styles.addressTxt} numberOfLines={1}>
                {orderData.shipping_name}{' '}
              </Text>
              <Text style={styles.addressTxt} numberOfLines={2}>
                {orderData.shipping_address_1}{' '}
              </Text>
              <Text style={styles.addressTxt} numberOfLines={2}>
                {orderData.shipping_address_2
                  ? orderData.shipping_address_2 + ','
                  : ','}{' '}
                {orderData.shipping_city}
              </Text>
              <Text style={styles.addressTxt} numberOfLines={1}>
                {orderData.shipping_postcode}
              </Text>
            </TouchableOpacity>
          </View>

          <OtrixDivider size={'md'} />
          <Text style={styles.deliveryTitle}>Order Product List</Text>
          <OtrixDivider size={'sm'} />

          <View style={styles.cartContent}>
            {orderData.products.length > 0 &&
              orderData.products.map((item, index) => (
                <View>
                  <View style={styles.cartBox}>
                    <View style={styles.imageView}>
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
                      <View>
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                      <Text style={styles.orderDate}>
                        Quantity: {item.quantity}
                      </Text>
                    </View>
                    <View style={styles.priceView}>
                      <Text style={styles.price}>
                        {CURRENCY} {numberWithComma(item.total)}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      setState({
                        ...state,
                        productID: item.product_id,
                        rateReview: true,
                      })
                    }
                    style={styles.bottomButton}>
                    <Text style={styles.bottomLeftTxt}>
                      {' '}
                      Rate This Product{' '}
                    </Text>
                    <Icon name="arrow-forward-ios" color={Colors.themeColor} />
                  </TouchableOpacity>
                  <OtrixDivider size={'md'} />
                </View>
              ))}
          </View>

          <OtrixDivider size={'md'} />
          <Text style={styles.deliveryTitle}>Orders Summary</Text>
          <OtrixDivider size={'sm'} />
          <View style={styles.cartContent}>
            <View style={[styles.detailBox, { height: hp('22%') }]}>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Items Count</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>
                    {' '}
                    {orderData.products.length}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Tax</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>
                    {' '}
                    {CURRENCY} {orderData.tax_amount}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Discount</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>
                    {' '}
                    {CURRENCY} {orderData.discount}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text style={styles.leftTxt}>Shipping Charge</Text>
                </View>
                <View style={styles.rightView}>
                  <Text style={styles.rightTxt}>
                    {' '}
                    {CURRENCY}{' '}
                    {orderData.shipping_charge > 0
                      ? orderData.shipping_charge
                      : 0}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.leftView}>
                  <Text
                    style={[
                      styles.leftTxt,
                      { color: Colors.link_color, fontSize: wp('4.5%') },
                    ]}>
                    Order Total
                  </Text>
                </View>
                <View style={styles.rightView}>
                  <Text
                    style={[
                      styles.rightTxt,
                      ,
                      { color: Colors.link_color, fontSize: wp('4.5%') },
                    ]}>
                    {' '}
                    {CURRENCY}
                    {orderData.grand_total}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </OtrixContent>

      <Modal visible={rateReview} transparent={true}>
        <View>
          {Platform.OS === 'ios' && <View style={{ height: hp('5%') }} />}
          <View style={styles.modelView}>
            {/* Model header */}
            <View style={styles.contentView}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end' }}
                onPress={() =>
                  setState({
                    ...state,
                    rateReview: false,
                  })
                }>
                <Image source={close} style={styles.button} />
              </TouchableOpacity>
              <Text style={styles.rateTitle}>Rate Product Now!</Text>
              <FormControl isRequired isInvalid={submited && 'star' in errors}>
                <Stars
                  default={0}
                  count={5}
                  half={true}
                  starSize={60}
                  fullStar={
                    <FontAwesomeIcon
                      name={'star'}
                      size={wp('3.5%')}
                      style={[styles.myStarStyle]}
                    />
                  }
                  emptyStar={
                    <FontAwesomeIcon
                      name={'star-o'}
                      size={wp('3.5%')}
                      style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                    />
                  }
                  halfStar={
                    <FontAwesomeIcon
                      name={'star-half-empty'}
                      size={wp('3.5%')}
                      style={[styles.myStarStyle]}
                    />
                  }
                  update={val => {
                    setState({
                      ...state,
                      submited: false,
                      star: val,
                    });
                  }}
                />
                {submited && 'star' in errors && (
                  <FormControl.ErrorMessage
                    leftIcon={<InfoOutlineIcon size="xs" />}>
                    {errors.star}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>

              <OtrixDivider size={'md'} />
              <FormControl isRequired isInvalid={submited && 'name' in errors}>
                <Input
                  variant="outline"
                  value={name}
                  placeholder="Review Text"
                  style={GlobalStyles.textInputStyle}
                  onChangeText={value => {
                    setState({ ...state, submited: false, name: value }),
                      delete errors.name;
                  }}
                />
                <FormControl.ErrorMessage
                  leftIcon={<InfoOutlineIcon size="xs" />}>
                  {errors.name}
                </FormControl.ErrorMessage>
              </FormControl>
              <Button
                size="md"
                variant="solid"
                bg={Colors.themeColor}
                style={[
                  GlobalStyles.button,
                  { marginHorizontal: wp('4%'), top: hp('4.5%') },
                ]}
                onPress={() => submit()}>
                <Text style={GlobalStyles.buttonText}>Submit</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {showMessage == true && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

export default connect(mapStateToProps)(OrderDetailScreen);

const styles = StyleSheet.create({
  deliveryTitle: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('2%'),
  },
  addressBox: {
    // marginLeft: wp('5%'),
    //  marginRight: wp('2.5%'),
    flex: 1,
    height: 'auto',
    borderRadius: wp('2%'),
  },
  deliveryBox: {
    marginHorizontal: wp('1.5%'),
    width: wp('88%'),
    marginVertical: hp('0.5%'),
    height: hp('14.5%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    padding: wp('2.5%'),
  },
  addressTxt: {
    fontSize: wp('3.6%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.text_color,
    textAlign: 'left',
  },
  deliveryAddressTxt: {
    textAlign: 'right',
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.link_color,
  },
  edit: {
    textAlign: 'right',
  },
  editView: { justifyContent: 'flex-start' },
  addressContent: {
    flexDirection: 'row',
  },
  cartContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
  },
  cartBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('12%'),
    backgroundColor: Colors.white,
    width: wp('90%'),
    flex: 1,
  },
  detailBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('11%'),
    flex: 1,
  },
  imageView: {
    flex: 0.25,
    backgroundColor: Colors.light_white,
    margin: wp('1%'),
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
    flex: 0.5,
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
  orderStatuss: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('3.5%'),
    color: Colors.text_color,
  },
  priceView: {
    flex: 0.25,
    bottom: hp('3%'),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: wp('4%'),
  },
  price: {
    color: Colors.link_color,
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
  },
  leftView: {
    flex: 0.35,
    marginLeft: wp('3%'),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 0.65,
  },
  leftTxt: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.5%'),
    color: Colors.secondry_text_color,
  },
  rightTxt: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('4%'),
    color: Colors.text_color,
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: hp('0.4%'),
  },

  bottomButton: {
    borderTopColor: Colors.light_white,
    borderTopWidth: 1,
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    borderRadius: wp('2%'),
    width: wp('90%'),
    marginBottom: hp('0%'),
  },

  modelView: {
    height: hp('100%'),
    width: wp('100%'),
    alignSelf: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'rgba(52,52,52,0.8)',
  },
  contentView: {
    marginHorizontal: wp('10%'),
    backgroundColor: Colors.white,
    padding: wp('5%'),
  },
  rateTitle: {
    textAlign: 'center',
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('4.5%'),
    color: Colors.black,
    marginVertical: hp('1.5%'),
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
  button: {
    height: _roundDimensions()._height * 0.016,
    width: _roundDimensions()._height * 0.016,
  },
});
