import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Input, Button } from 'native-base';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixDivider,
  CartView,
  OtrixLoader,
  OtrixAlert,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { useIsFocused } from '@react-navigation/native';
import { bindActionCreators } from 'redux';
import { removeFromCart, decrementQuantity, incrementQuantity } from '@actions';
import { CURRENCY } from '@env';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';
import { logfunction, numberWithComma } from '@helpers/FunctionHelper';

function CustomerCartScreen(props) {
  const [state, setState] = React.useState({
    loading: true,
    cartProducts: [],
    sumAmount: 0,
    isApplied: false,
    validCode: false,
    couponCode: null,
    noRecord: false,
    subTotal: 0,
    discount: null,
    tax: null,
    grandTotal: 0,
    message: null,
    type: 'error',
  });
  const [showMessage, setShowLoading] = React.useState(false);
  const isFocused = useIsFocused();

  const applyCouponCode = () => {
    const { couponCode } = state;
    if (couponCode != null) {
      let sendData = new FormData();
      sendData.append('couponCode', couponCode);
      logfunction('Sample requrest  ', sendData);
      getApi.postData('user/applyCoupon', sendData).then(response => {
        logfunction('response response  ', response);
        if (response.status == 1) {
          setState({
            ...state,
            discount: response.discount,
            grandTotal: response.grandTotal,
            type: 'success',
            message: response.message,
          });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 3000);
        } else {
          setState({
            ...state,
            message: response.message,
            fetchCart: false,
            discount: null,
            type: 'error',
          });
          setShowLoading(true);
          setTimeout(() => {
            setShowLoading(false);
          }, 3000);
        }
      });
    } else {
      setState({ ...state, isApplied: true, validCode: false });
    }
  };

  const onDeleteItem = id => {
    let sendData = new FormData();
    sendData.append('cart_id', id);
    logfunction('Sample requrest  ', sendData);
    getApi.postData('user/deleteCart', sendData).then(response => {
      logfunction('response response  ', response);

      if (response.status == 1) {
        props.removeFromCart(response.cartCount);
        setState({
          ...state,
          cartProducts: response.cartData,
          subTotal: response.subTotal,
          discount: response.discount,
          tax: response.taxes,
          grandTotal: response.grandTotal,
          noRecord: response.cartData.length > 0 ? false : true,
        });
      } else {
        setState({
          ...state,
          message: response.message,
          fetchCart: false,
          type: 'error',
        });
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const decrement = (id, productID, quantity) => {
    let qty = parseInt(quantity);

    let sendData = new FormData();
    sendData.append('cart_id', id);
    sendData.append('quantity', qty - 1);
    logfunction('Sample requrest  ', sendData);
    getApi.postData('user/updateCart', sendData).then(response => {
      logfunction('response response  ', response);

      if (response.status == 1) {
        props.incrementQuantity(response.cartCount);
        setState({
          ...state,
          cartProducts: response.cartData,
          subTotal: response.subTotal,
          discount: response.discount,
          tax: response.taxes,
          grandTotal: response.grandTotal,
          noRecord: response.cartData.length > 0 ? false : true,
        });
      } else {
        setState({
          ...state,
          message: response.message,
          fetchCart: false,
          type: 'error',
        });
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const increment = (id, productID, quantity) => {
    let qty = parseInt(quantity);

    let sendData = new FormData();
    sendData.append('cart_id', id);
    sendData.append('quantity', qty + 1);
    logfunction('Sample requrest  ', sendData);
    getApi.postData('user/updateCart', sendData).then(response => {
      logfunction('response response  ', response);

      if (response.status == 1) {
        props.incrementQuantity(response.cartCount);
        setState({
          ...state,
          cartProducts: response.cartData,
          subTotal: response.subTotal,
          discount: response.discount,
          tax: response.taxes,
          grandTotal: response.grandTotal,
          noRecord: response.cartData.length > 0 ? false : true,
        });
      } else {
        setState({
          ...state,
          message: response.message,
          fetchCart: false,
          type: 'error',
        });
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const calculateCart = () => {
    getApi.getData('user/getCart', []).then(response => {
      logfunction('RESPONS ', response);
      if (response.status == 1) {
        setState({
          ...state,
          cartProducts: response.cartData,
          subTotal: response.subTotal,
          discount: response.discount,
          tax: response.taxes,
          grandTotal: response.grandTotal,
          noRecord: response.cartData.length > 0 ? false : true,
          loading: false,
        });
      } else {
        setState({
          ...state,
          loading: false,
          message: response.cartData.length > 0 ? response.message : null,
          noRecord: response.cartData.length > 0 ? false : true,
        });
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });

    /***************OLD local cart functionality *********/
    // //find and create array
    // cartProducts && cartProducts.length > 0 && cartProducts.forEach(function (item, index) {
    //     let findedProduct = ProductListDummy.filter(product => product.id == item.product_id);
    //     cartItems.push({
    //         quantity: item.quantity,
    //         name: findedProduct[0].name,
    //         price: findedProduct[0].price,
    //         image: findedProduct[0].image,
    //         id: findedProduct[0].id
    //     });
    //     let amt = parseInt(findedProduct[0].price.replace('$', ''));
    //     sumAmount += amt * item.quantity;
    // });

    //setState({ ...state, noRecord: cartProducts.length > 0 ? false : true, loading: false, cartProducts: cartItems, sumAmount: sumAmount, });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      calculateCart();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  const {
    cartProducts,
    subTotal,
    discount,
    type,
    message,
    grandTotal,
    couponCode,
    loading,
    isApplied,
    validCode,
    tax,
    noRecord,
  } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Shopping Cart</Text>
        </View>
      </OtrixHeader>

      {/* Content Start from here */}
      <OtrixContent>
        {/* Cart Component Start from here */}
        {!noRecord && !loading && (
          <CartView
            navigation={props.navigation}
            products={cartProducts}
            deleteItem={onDeleteItem}
            decrementItem={decrement}
            incrementItem={increment}
          />
        )}
        {loading && <OtrixLoader />}
        {!loading && noRecord && (
          <View style={styles.noRecord}>
            <Text style={styles.emptyTxt}>Cart is empty!</Text>
            <Button
              size="lg"
              variant="solid"
              bg={Colors.themeColor}
              style={[
                GlobalStyles.button,
                {
                  marginHorizontal: wp('2%'),
                  marginBottom: hp('2.5%'),
                  marginTop: hp('1%'),
                },
              ]}
              onPress={() => props.navigation.navigate('HomeScreen')}>
              <Text style={GlobalStyles.buttonText}>
                <Icon
                  name={'md-cart-sharp'}
                  color={Colors.white}
                  style={{ fontSize: wp('4.5%') }}
                />{' '}
                Shop Now
              </Text>
            </Button>
          </View>
        )}
      </OtrixContent>

      {!noRecord && !loading && (
        <View style={styles.checkoutView}>
          {/*
          <View style={styles.couponInput}>
            <Input
              variant="outline"
              placeholder="Coupon Code (use weird)"
              style={[GlobalStyles.textInputStyle, styles.inputStyle]}
              onChangeText={couponCode => setState({ ...state, couponCode })}
              InputRightElement={
                <View
                  style={{
                    flexDirection: 'row',
                    marginRight: wp('3%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {isApplied ? (
                    validCode ? (
                      <Icon
                        name={'checkmark-circle'}
                        size={18}
                        color={'#3ad35c'}
                      />
                    ) : (
                      <Icon name={'ios-close-circle'} size={18} color={'red'} />
                    )
                  ) : null}
                  <TouchableOpacity
                    style={styles.applyView}
                    onPress={() => applyCouponCode()}>
                    <Text style={styles.applyTxt}>Apply</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
*/}
          <View style={GlobalStyles.horizontalLine} />
          <OtrixDivider size={'sm'} />
          <View style={styles.totalView}>
            <Text style={styles.leftTxt}>Sub Total</Text>
            <Text style={styles.rightTxt}>
              {CURRENCY}
              {subTotal}
            </Text>
          </View>

          {tax && tax.taxAmount > 0 && (
            <View style={styles.totalView}>
              <Text style={styles.leftTxt}>{tax.name}</Text>
              <Text style={styles.rightTxt}>
                {CURRENCY}
                {numberWithComma(tax.taxAmount)}
              </Text>
            </View>
          )}
          {discount != null && (
            <View style={styles.totalView}>
              <Text style={styles.leftTxt}>{discount.name}</Text>
              <Text style={styles.rightTxt}>
                - {CURRENCY}
                {discount.discountAmt}
              </Text>
              <OtrixDivider size={'sm'} />
            </View>
          )}
          {validCode && (
            <View style={styles.totalView}>
              <Text style={styles.leftTxt}>Coupon ({couponCode})</Text>
              <Text style={styles.rightTxt}>-$50</Text>
              <OtrixDivider size={'sm'} />
            </View>
          )}
          <OtrixDivider size={'sm'} />

          <View style={styles.totalView}>
            <Text style={styles.leftTxt}>Total</Text>
            <Text
              style={[
                styles.rightTxt,
                { color: Colors.link_color, fontSize: wp('5.5%') },
              ]}>
              {CURRENCY}
              {grandTotal}
            </Text>
          </View>
          <Button
            size="md"
            variant="solid"
            bg={Colors.themeColor}
            style={[
              GlobalStyles.button,
              {
                marginHorizontal: wp('5%'),
                marginBottom: hp('2.5%'),
                marginTop: hp('1%'),
              },
            ]}
            onPress={() => props.navigation.navigate('CheckoutScreen')}>
            <Text style={GlobalStyles.buttonText}>Checkout</Text>
          </Button>
        </View>
      )}
      {!noRecord && showMessage == true && (
        <OtrixAlert type={type} message={message} />
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      removeFromCart,
      decrementQuantity,
      incrementQuantity,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomerCartScreen);

const styles = StyleSheet.create({
  checkoutView: {
    backgroundColor: Colors.light_white,
    height: hp('32%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    borderTopLeftRadius: wp('2%'),
    borderTopRightRadius: wp('2%'),
  },
  couponInput: {
    marginHorizontal: wp('5%'),
    marginVertical: hp('1.5%'),
  },
  inputStyle: {
    borderColor: Colors.black,
    backgroundColor: Colors.light_white,
  },
  applyTxt: {
    color: Colors.link_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('4%'),
  },
  applyView: {
    marginHorizontal: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  totalView: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: wp('6%'),
  },
  leftTxt: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    flex: 0.5,
    fontSize: wp('3.8%'),
    textAlign: 'left',
  },
  rightTxt: {
    color: Colors.text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4.5%'),
    flex: 0.5,
    textAlign: 'right',
  },
  noRecord: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: hp('25%'),
  },
  emptyTxt: {
    fontSize: wp('6%'),
    marginVertical: hp('1.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
});
