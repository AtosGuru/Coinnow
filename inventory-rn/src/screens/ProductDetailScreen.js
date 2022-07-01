import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixContent,
  OtrixDivider,
  OtirxBackButton,
  OtrixLoader,
  SimilarProduct,
  OtrixAlert,
  RatingComponent,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import { bottomCart, checkround2, close } from '@common';
import { SliderBox } from 'react-native-image-slider-box';
import { Badge, ScrollView, Button } from 'native-base';
import Fonts from '../helpers/Fonts';
import { bindActionCreators } from 'redux';
import { addToCart, addToWishList } from '@actions';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
import Stars from 'react-native-stars';
import RenderHtml from 'react-native-render-html';
import getApi from '@apis/getApi';
import {
  numberWithComma,
  logfunction,
  _addToWishlist,
} from '@helpers/FunctionHelper';
import { ASSETS_DIR, CURRENCY } from '@env';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment';

function ProductDetailScreen(props) {
  const scrollRight = useRef();
  const { cartCount, USER_AUTH, wishlistData, userData } = props;

  const [state, setState] = React.useState({
    loading: true,
    productPrice: 0,
    productCount: 1,
    productDetail: null,
    value: null,
    isFocus: false,
    productDescription: null,
    productSpecial: null,
    productAttributes: null,
    productImages: null,
    productRelated: null,
    productOption: [],
    fetchCart: false,
    productReview: null,
    optionColor: 0,
    optionSelect: 0,
    optionSize: 0,
    showZoom: false,
    zoomImages: [],
    message: null,
    type: 'error',
    optionColorPrice: 0,
    optionSelectPrice: 0,
    optionSizePrice: 0,
  });
  const {
    loading,
    productDetail,
    productOption,
    productPrice,
    fetchCart,
    productReview,
    productImages,
    productAttributes,
    productDescription,
    isFocus,
    productRelated,
    productSpecial,
    optionColor,
    optionSelect,
    optionSize,
    productCount,
    zoomImages,
    showZoom,
    msg,
    optionColorPrice,
    optionSelectPrice,
    optionSizePrice,
    message,
    type,
  } = state;

  const _CartData = () => {
    // setState({ ...state, fetchCart: false })
  };

  const showOutofStock = () => {
    setTimeout(() => {
      setState({ ...state, message: null });
    }, 2500);
    setState({ ...state, message: 'Product out of stock', type: 'error' });
  };

  const onPressBuy = () => {
    let sendData = new FormData();
    sendData.append('id', productDetail?.id);

    getApi.postData('seller/buyProduct', sendData).then(response => {
      logfunction('RESPONSE ORDER  ', response);
      if (response.status == 1) {
        setState({
          ...state,
          message: response.message,
          type: 'success',
        });
      } else {
        setState({
          ...state,
          message: response.message,
          type: 'error',
        });
      }
      setTimeout(() => {
        setState({
          ...state,
          message: null,
        });
      }, 3000);
      getDetails();
    });
  };

  const _addToCart = () => {
    const mode = userData?.mode;
    if (USER_AUTH == true) {
      setState({ ...state, fetchCart: true });

      let sendData = new FormData();
      sendData.append('quantity', productCount);
      sendData.append('product_id', productDetail.id);
      sendData.append(
        'options',
        JSON.stringify({
          optionColorSelected: optionColor,
          optionSizeSelected: optionSize,
          optionSelectSelected: optionSelect,
        }),
      );
      logfunction('Sample requrest  ', sendData);
      getApi.postData('seller/addToCart', sendData).then(response => {
        logfunction('response response  ', response);

        if (response.status == 1) {
          props.addToCart(response.cartCount);
          setState({
            ...state,
            message: response.message,
            fetchCart: false,
            type: 'success',
          });
        } else {
          setState({
            ...state,
            message: response.message,
            fetchCart: false,
            type: 'error',
          });
        }

        setTimeout(() => {
          setState({
            ...state,
            message: null,
          });
        }, 3000);
      });
    } else {
      props.navigation.navigate('LoginScreen');
    }
  };

  const addToWish = async id => {
    let wishlistData = await _addToWishlist(id);
    props.addToWishList(wishlistData, id);
  };

  const colorChange = data => {
    logfunction('COlor Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - parseFloat(optionColorPrice);

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionColor: data.product_option_id,
      productPrice: calculatePrice,
      optionColorPrice: data.price,
    });
  };

  const sizeChange = data => {
    logfunction('COlor Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - parseFloat(optionSizePrice);

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionSize: data.product_option_id,
      productPrice: calculatePrice,
      optionSizePrice: data.price,
    });
  };

  const setOptionSelect = (selected, data) => {
    logfunction('Select Data ', data);
    let calculatePrice = parseFloat(productPrice);
    calculatePrice = calculatePrice - optionSelectPrice;

    if (data.price != null) {
      calculatePrice = calculatePrice + parseFloat(data.price);
    }

    logfunction('Final Price ', calculatePrice);
    setState({
      ...state,
      optionSelect: selected,
      productPrice: calculatePrice,
      optionSelectPrice: data.price,
    });
  };

  let optionArr = [];
  const buildSelect = (item, index) => {
    let label =
      item.price != null ? item.label + ' (+' + item.price + ')' : item.label;
    optionArr.push({
      price: item.price,
      label: label,
      value: item.product_option_id,
    });
    let last = Object.keys(productOption).length - 1;
    if (index == last) {
      return (
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          iconStyle={styles.iconStyle}
          data={optionArr}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={optionSelect}
          onChange={item => {
            setOptionSelect(item.value, item);
          }}
          renderLeftIcon={() => (
            <Icon
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      );
    }
  };

  const getDetails = () => {
    const { id } = props.route.params;
    logfunction('PRODUCT ID ', id);
    // getApi.postData('incrementProductView/' + id, []).then(response => {
    //   console.log(response);
    // });
    logfunction('Product detail  ', 'productDetail/' + id);
    getApi.getData('productDetail/' + id, []).then(response => {
      logfunction('RESPONSE DETAIL ', response);
      let productData = response.data;

      //product details
      let images = [];
      let zoomImages = [];
      if (productData.data.image != null) {
        images.push(ASSETS_DIR + 'product/' + productData.data.image);
        zoomImages.push({
          url: ASSETS_DIR + 'product/' + productData.data.image,
        });
      } else {
        images.push(ASSETS_DIR + '/assets/img/default.png');
        zoomImages.push({
          url: ASSETS_DIR + '/assets/img/default.png',
        });
      }

      logfunction('OPTIONS  ', Object.keys(productData.productOptions).length);
      if (productData.productImages && productData.productImages.length > 0) {
        for (let i = 0; i < productData.productImages.length; i++) {
          images.push(
            ASSETS_DIR + 'product/' + productData.productImages[i].image,
          );
          zoomImages.push({
            url: ASSETS_DIR + 'product/' + productData.productImages[i].image,
          });
        }
      }

      let special = 0;

      if (productData.productSpecial != null) {
        let startDate = moment(
          productData.productSpecial.start_date,
          'DD/MM/YYYY',
        );
        let endDate = moment(productData.productSpecial.end_date, 'DD/MM/YYYY');
        logfunction('Product Special  ', productData.productSpecial);

        if (
          startDate <= moment(new Date(), 'DD/MM/YYYY') &&
          endDate >= moment(new Date(), 'DD/MM/YYYY')
        ) {
          special = productData.productSpecial.price;
        }
      }

      setState({
        ...state,
        productDetail: productData.data,
        productDescription: productData.data.product_description,
        productPrice: special > 0 ? special : productData.data.price,
        basePrice: special > 0 ? special : productData.data.price,
        productSpecial: special,
        productRelated: productData.reletedProducts,
        productAttributes: productData.productAttributes,
        productImages: images,
        productOption: productData.productOptions,
        zoomImages: zoomImages,
        productReview: {
          totalReview: productData.totalReviews,
          avgRating: productData.avgReview,
          star1: productData.star1,
          star2: productData.star2,
          star3: productData.star3,
          star4: productData.star4,
          star5: productData.star5,
        },
        loading: false,
      });
      logfunction('PRODUCT DETAIL ', parseFloat(productData.avgReview));
      logfunction(
        'productData.productRelatedAttribute ',
        productData.productAttributes,
      );
    });
  };

  useEffect(() => {
    getDetails();
  }, []);

  const { width } = useWindowDimensions();
  const tagsStyles = {
    p: {
      color: Colors.secondry_text_color,
      fontFamily: Fonts.Font_Reguler,
      fontSize: wp('3.5%'),
      lineHeight: hp('2.4%'),
    },
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {loading ? (
        <OtrixLoader />
      ) : (
        <>
          {/* Product Detail View */}
          {productImages && productImages.length > 0 && (
            <View style={styles.container}>
              <SliderBox
                images={productImages}
                onCurrentImagePressed={index =>
                  setState({ ...state, showZoom: true })
                }
                dotColor={Colors.themeColor}
                inactiveDotColor="#90A4AE"
                sliderBoxHeight={hp('35%')}
                paginationBoxVerticalPadding={20}
                autoplay={true}
                ImageComponentStyle={{
                  borderRadius: 15,
                  width: '80%',
                  marginTop: 5,
                }}
                circleLoop={true}
                resizeMode={'cover'}
                dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 15,
                  marginHorizontal: 0,
                  padding: 0,
                  margin: 0,
                }}
              />
            </View>
          )}

          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              marginTop: hp('2%'),
            }}>
            <TouchableOpacity
              style={[
                GlobalStyles.headerLeft,
                { zIndex: 999999999, flex: 0.9, alignItems: 'flex-start' },
              ]}
              onPress={() => props.navigation.goBack()}>
              <OtirxBackButton />
            </TouchableOpacity>
            {/*<TouchableOpacity
              style={[
                GlobalStyles.headerRight,
                {
                  zIndex: 999999999,
                  flex: 0.1,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                },
              ]}
              onPress={() => props.navigation.navigate('CartScreen')}>
              <Image source={bottomCart} style={styles.menuImage} />
              {cartCount > 0 && (
                <Badge
                  style={[
                    GlobalStyles.badge,
                    {
                      left: wp('4.4%'),
                      top: -hp('1.4%'),
                      height: cartCount > 9 ? 28 : 24,
                      width: cartCount > 9 ? 28 : 24,
                      backgroundColor: Colors.white,
                    },
                  ]}>
                  <Text
                    style={[
                      GlobalStyles.badgeText,
                      {
                        color: Colors.themeColor,
                        fontSize: cartCount > 9 ? wp('2.5%') : wp('3%'),
                      },
                    ]}>
                    {cartCount}
                  </Text>
                </Badge>
              )}
            </TouchableOpacity>*/}
          </View>

          {/* Content Start from here */}
          <OtrixContent customStyles={styles.productDetailView}>
            <OtrixDivider size={'lg'} />
            <ScrollView
              style={styles.childView}
              showsVerticalScrollIndicator={false}>
              {/* Name Container*/}
              <View style={styles.subContainer}>
                <Text style={styles.headingTxt}>{productDescription.name}</Text>
                <Text
                  style={[
                    styles.stock,
                    {
                      color: productDetail.quantity > 0 ? '#5ddb79' : '#fe151b',
                    },
                  ]}>
                  {productDetail.quantity} in stock
                </Text>
              </View>
              <OtrixDivider size={'md'} />

              {/* Price Container*/}
              <View style={styles.subContainer}>
                {productSpecial > 0 ? (
                  <View style={styles.SpcialView}>
                    <Text style={styles.price}>
                      {CURRENCY}
                      {numberWithComma(productPrice)}{' '}
                    </Text>
                    <Text style={styles.originalPrice}>
                      {CURRENCY}
                      {numberWithComma(productDetail.price)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.productPrice}>
                    {CURRENCY}
                    {numberWithComma(productPrice)}
                  </Text>
                )}

                {/*
                <View style={styles.starView}>
                  <Stars
                    default={
                      productReview.avgRating > 0
                        ? parseFloat(productReview.avgRating)
                        : 0
                    }
                    count={5}
                    half={true}
                    starSize={45}
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
                    disabled={true}
                  />
                  <Text style={styles.reviewTxt}>
                    ({productReview != null ? productReview.totalReview : 0}{' '}
                    Reviews)
                  </Text>
                </View>
*/}
              </View>
              <OtrixDivider size={'md'} />

              {/* Options And Heart Icon */}
              <View style={styles.colorView}>
                {/* Option */}
                <View style={{ flexDirection: 'column', flex: 0.85 }}>
                  {Object.keys(productOption).length > 0 &&
                    Object.keys(productOption).map((item, index) => (
                      <View key={item.toString()}>
                        <View style={styles.colorContainer}>
                          <Text style={styles.containerTxt}>{item}:</Text>
                          <ScrollView
                            ref={scrollRight}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{
                              flexDirection: 'row',
                              marginHorizontal: wp('1%'),
                            }}>
                            {productOption[item].map((childItem, index) =>
                              childItem.type == 'Color' ? (
                                <View
                                  style={{ flexDirection: 'column' }}
                                  key={childItem.product_option_id.toString()}>
                                  <TouchableOpacity
                                    style={[
                                      styles.box,
                                      { backgroundColor: childItem.color_code },
                                    ]}
                                    onPress={() => colorChange(childItem)}>
                                    {optionColor != null &&
                                      childItem.product_option_id ==
                                        optionColor && (
                                        <Image
                                          source={checkround2}
                                          style={styles.colorimageView}
                                        />
                                      )}
                                  </TouchableOpacity>
                                  {childItem.price != null && (
                                    <Text style={styles.optionPrice}>
                                      +{childItem.price}
                                    </Text>
                                  )}
                                </View>
                              ) : childItem.type == 'Radio' ||
                                childItem.type == 'Checkbox' ? (
                                <View
                                  style={{ flexDirection: 'column' }}
                                  key={childItem.product_option_id.toString()}>
                                  <TouchableOpacity
                                    style={[
                                      styles.box,
                                      styles.sizeBox,
                                      {
                                        borderColor:
                                          optionSize ==
                                          childItem.product_option_id
                                            ? Colors.themeColor
                                            : 'rgb(225, 225, 225)',
                                      },
                                    ]}
                                    key={index}
                                    onPress={() => sizeChange(childItem)}>
                                    <Text
                                      style={[
                                        styles.sizeTxt,
                                        {
                                          color:
                                            optionSize ==
                                            childItem.product_option_id
                                              ? Colors.themeColor
                                              : Colors.secondry_text_color,
                                        },
                                      ]}>
                                      {childItem.label}
                                    </Text>
                                  </TouchableOpacity>
                                  {childItem.price != null ? (
                                    <Text style={styles.optionPrice}>
                                      +{childItem.price}
                                    </Text>
                                  ) : null}
                                </View>
                              ) : (
                                buildSelect(childItem, index)
                              ),
                            )}
                          </ScrollView>
                          <TouchableOpacity
                            style={{ justifyContent: 'center', top: hp('1%') }}
                            onPress={() => {
                              scrollRight.current.scrollTo({ x: 1500 });
                            }}>
                            <Icon name="right" style={styles.arrowRight}></Icon>
                          </TouchableOpacity>
                        </View>
                        <OtrixDivider size={'md'} />
                      </View>
                    ))}
                </View>

                {/* Heart Icon */}
                {/*<View style={styles.heartIconView}>
                  {wishlistData &&
                  wishlistData.length > 0 &&
                  wishlistData.includes(productDetail.id) ? (
                    <TouchableOpacity
                      style={[
                        GlobalStyles.FavCircle,
                        { left: wp('4%'), top: 0 },
                      ]}
                      onPress={() =>
                        props.USER_AUTH
                          ? addToWish(productDetail.id)
                          : props.navigation.navigate('LoginScreen')
                      }>
                      <FontAwesomeIcon
                        name="heart"
                        style={GlobalStyles.unFavIcon}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        GlobalStyles.unFavCircle,
                        { left: wp('4%'), top: 0 },
                      ]}
                      onPress={() =>
                        props.USER_AUTH
                          ? addToWish(productDetail.id)
                          : props.navigation.navigate('LoginScreen')
                      }>
                      <FontAwesomeIcon
                        name="heart-o"
                        style={GlobalStyles.unFavIcon}
                        color={Colors.secondry_text_color}
                      />
                    </TouchableOpacity>
                  )}
                </View>*/}
              </View>

              {Object.keys(productOption).length == 0 && (
                <OtrixDivider size={'lg'} />
              )}

              {Object.keys(productOption).length == 0 && (
                <OtrixDivider size={'md'} />
              )}

              {/* Sizes Container */}
              {/* <SizeContainerComponent productData={productDetail} /> */}

              {/* Description Container*/}
              <View style={GlobalStyles.horizontalLine} />
              <OtrixDivider size={'sm'} />
              <Text style={[styles.headingTxt, { fontSize: wp('3.8%') }]}>
                Description
              </Text>
              <OtrixDivider size={'sm'} />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: productDescription.description,
                }}
                tagsStyles={tagsStyles}
              />

              {/* <Text style={styles.description}>{productDescription.description}</Text> */}

              {/*{Object.keys(productAttributes).length > 0 && (
                <View>
                  <OtrixDivider size={'md'} />
                  <View style={GlobalStyles.horizontalLine} />
                  <OtrixDivider size={'sm'} />
                  <Text style={[styles.headingTxt, { fontSize: wp('3.8%') }]}>
                    Specification
                  </Text>
                  <OtrixDivider size={'sm'} />

                  {Object.keys(productAttributes).map((item, index) => (
                    <>
                      <View
                        style={{
                          backgroundColor: Colors.light_gray,
                          marginVertical: hp('1%'),
                        }}>
                        <Text
                          style={[
                            styles.headingtext,
                            { marginHorizontal: wp('1%'), padding: 2 },
                          ]}>
                          {item}
                        </Text>
                      </View>
                      {productAttributes[item].map((attribute, attIndex) => (
                        <View style={[styles.attributeView, {}]}>
                          <Text
                            style={[
                              styles.attributeTitle,
                              { color: 'rgba(0, 0, 0, 0.70)' },
                            ]}>
                            {attribute.name}
                          </Text>
                          <Text
                            style={[
                              styles.attributeInfo,
                              { color: 'rgba(0, 0, 0, 0.70)' },
                            ]}>
                            {attribute.text}
                          </Text>
                        </View>
                      ))}
                    </>
                  ))}
                </View>
              )}*/}

              <OtrixDivider size={'md'} />
              <View style={GlobalStyles.horizontalLine} />

              {/* Rating Container*/}
              {/*<RatingComponent reviewData={productReview} />*/}

              {/* Similar Product Component  */}
              {productRelated.length > 0 && (
                <SimilarProduct
                  navigation={props.navigation}
                  reletedData={productRelated}
                />
              )}
            </ScrollView>
          </OtrixContent>

          {/* Zoom image */}
          <Modal visible={showZoom} transparent={true}>
            <ImageViewer
              imageUrls={zoomImages}
              saveToLocalByLongPress={false}
              backgroundColor={Colors.light_white}
              renderIndicator={(currentIndex, allSize) => {
                return (
                  <View style={styles.pageindexview}>
                    <TouchableOpacity
                      onPress={() => setState({ ...state, showZoom: false })}
                      style={{ padding: 8 }}>
                      <Image square source={close} style={styles.cancleIcon} />
                    </TouchableOpacity>
                    <Text style={styles.pageindextext}>
                      {currentIndex} / {allSize}
                    </Text>
                  </View>
                );
              }}
            />
          </Modal>

          {/* Bottom View */}
          <View style={styles.footerView}>
            <Button
              isLoading={fetchCart}
              size="md"
              variant="solid"
              bg={Colors.themeColor}
              style={[
                GlobalStyles.button,
                { flex: 0.7, marginHorizontal: wp('2%') },
              ]}
              onPress={() =>
                !productDetail.out_of_stock ? onPressBuy() : showOutofStock()
              }>
              <Text style={GlobalStyles.buttonText}>BUY NOW</Text>
            </Button>
          {/*  <View style={styles.countBox}>
              <Text style={styles.countTxt}>{productCount}</Text>
              <View style={styles.arrowContainer}>
                <TouchableOpacity
                  style={{ flex: 0.5 }}
                  onPress={() =>
                    setState({ ...state, productCount: productCount + 1 })
                  }>
                  <MaterialIconsIcon
                    name="keyboard-arrow-up"
                    style={styles.plusminusArrow}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 0.5 }}
                  onPress={() =>
                    setState({
                      ...state,
                      productCount: productCount > 1 ? productCount - 1 : 1,
                    })
                  }>
                  <MaterialIconsIcon
                    name="keyboard-arrow-down"
                    style={styles.plusminusArrow}
                  />
                </TouchableOpacity>
              </View>
            </View>*/}
          </View>
          {message != null && <OtrixAlert type={type} message={message} />}
        </>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartCount: state.cart.cartCount,
    wishlistData: state.wishlist.wishlistData,
    USER_AUTH: state.auth.USER_AUTH,
    userData: state.auth.USER_DATA,
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToCart,
      addToWishList,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);

const styles = StyleSheet.create({
  productDetailView: {
    backgroundColor: Colors.white,
    marginHorizontal: 0,
    borderTopRightRadius: wp('13%'),
    borderTopLeftRadius: wp('13%'),
  },
  container: {
    height: hp('35%'),
    position: 'relative',
    backgroundColor: Colors.light_white,
    zIndex: 99,
  },
  childView: {
    marginHorizontal: wp('5%'),
    paddingBottom: hp('1.8%'),
  },
  menuImage: {
    width: wp('6%'),
    height: hp('6%'),
    resizeMode: 'contain',
    tintColor: Colors.themeColor,
  },
  colorView: {
    flexDirection: 'row',
    flex: 1,
  },
  colorContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  containerTxt: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.secondry_text_color,
    textAlign: 'left',
  },
  box: {
    height: hp('3.5%'),
    width: wp('13%'),
    flexDirection: 'column',
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionPrice: {
    fontSize: wp('2.7%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.secondry_text_color,
    textAlign: 'center',
  },
  borderBox: {
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },
  colorimageView: {
    height: hp('2%'),
    width: wp('4%'),
    borderRadius: 50,
    marginHorizontal: wp('1%'),
  },
  arrowRight: {
    fontSize: wp('3.5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.text_color,
  },
  heartIconView: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.Font_Bold,
    textAlignVertical: 'center',
    flex: 0.8,
  },
  subContainer: {
    flexDirection: 'row',
  },
  stock: {
    flex: 0.2,
    fontSize: wp('3%'),
    textAlignVertical: 'center',
    fontFamily: Fonts.Font_Semibold,
    textAlign: 'right',
  },
  productPrice: {
    fontSize: wp('5.5%'),
    fontFamily: Fonts.Font_Bold,
    textAlignVertical: 'center',
    color: Colors.themeColor,
    flex: 0.8,
  },
  starView: {
    flex: 0.2,
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
  reviewTxt: {
    fontFamily: Fonts.Font_Reguler,
    fontSize: wp('2.5%'),
    marginTop: hp('0.3%'),
    textAlign: 'center',
    color: Colors.secondry_text_color,
  },
  description: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Reguler,
    lineHeight: hp('2.4%'),
    color: Colors.secondry_text_color,
  },

  footerView: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: hp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    borderTopColor: Colors.light_gray,
    borderTopWidth: 1,
  },
  countBox: {
    backgroundColor: Colors.light_white,
    flexDirection: 'row',
    flex: 0.2,
    height: hp('4.8%'),
    marginHorizontal: wp('1%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    borderRadius: 5,
    justifyContent: 'center',
  },
  countTxt: {
    fontSize: wp('4.5%'),
    flex: 0.6,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.text_color,
    fontFamily: Fonts.Font_Semibold,
  },
  arrowContainer: {
    flex: 0.4,
    flexDirection: 'column',
  },
  plusminusArrow: {
    fontSize: wp('5.2%'),
  },
  cancleIcon: {
    marginLeft: wp('3%'),
    height: wp('6%'),
    width: wp('6%'),
    tintColor: Colors.black,
  },
  pageindexview: {
    position: 'absolute',
    marginTop: wp('4.5%'),
    flexDirection: 'row',
  },
  sizeBox: {
    height: hp('3%'),
    width: wp('12.5%'),
    marginHorizontal: wp('1.4%'),
    backgroundColor: Colors.light_white,
  },
  sizeTxt: {
    fontSize: wp('3.5%'),
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Reguler,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  pageindextext: {
    width: wp('15%'),
    textAlign: 'center',
    fontSize: wp('4.5%'),
    color: Colors.black_text,
    marginHorizontal: wp('34%'),
  },
  dropdown: {
    height: 40,
    width: wp('60%'),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  SpcialView: {
    flex: 0.8,
    flexDirection: 'row',
  },
  originalPrice: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('2.8%'),
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: wp('5.5%'),
    fontFamily: Fonts.Font_Bold,
    textAlignVertical: 'center',
    color: Colors.themeColor,
  },
  headingtext: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('4%'),
    marginTop: wp('2%'),
    marginBottom: wp('2%'),
    textAlign: 'left',
    textTransform: 'uppercase',
    padding: 2,
  },
  attributeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp('1.2%'),
    paddingHorizontal: wp('3%'),
  },
  attributeTitle: {
    fontFamily: Fonts.Font_Segoe_UI_Reguler,
    fontSize: wp('4%'),
    width: wp('30%'),
    textAlign: 'left',
  },
  attributeInfo: {
    fontFamily: Fonts.Font_Segoe_UI_Reguler,
    fontSize: wp('4%'),
    width: wp('55%'),
    textAlign: 'left',
  },
});
