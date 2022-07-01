import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';

import {
  OtrixContainer,
  SupplierSearchProducts,
  OtrixLoader,
  OtirxBackButton,
  OtrixContent,
  OtrixAlert,
  NewProduct,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fonts from '@helpers/Fonts';
import {
  _getWishlist,
  _addToWishlist,
  logfunction,
} from '@helpers/FunctionHelper';
import MostSearchArr from '@component/items/MostSearchArr';
import { Input } from 'native-base';
import getApi from '@apis/getApi';
import ProductView from '../component/ProductCompnent/ProductView';

function SellerStore(props) {
  const { customerData } = props;
  const [state, setState] = React.useState({
    data: [],
    searchKeyword: '',
    loading: false,
    showMost: true,
    showSuggestions: false,
  });
  const [showMessage, setShowLoading] = React.useState(false);
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const bottomMenu = React.useRef();
  const selectedProduct = React.useRef(null);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getData('');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return () => unsubscribe();
  }, [customerData]);

  const onHoldItem = product => {
    selectedProduct.current = product;
    bottomMenu.current?.open();
  };

  const onPressBuy = () => {
    bottomMenu.current?.close();
    let sendData = new FormData();
    sendData.append('id', selectedProduct.current?.id);

    getApi.postData('seller/buyProduct', sendData).then(response => {
      logfunction('RESPONSE ORDER  ', response);
      if (response.status == 1) {
        setType('success');
        setMessage(response.message);
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      } else {
        setType('error');
        setMessage(JSON.stringify(response.message));
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const onPressFight = () => {
    bottomMenu.current?.close();
    let sendData = new FormData();
    sendData.append('id', selectedProduct.current?.id);

    getApi.postData('seller/fightProduct', sendData).then(response => {
      logfunction('RESPONSE ORDER  ', response);
      if (response.status == 1) {
        setType('success');
        setMessage(response.message);
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      } else {
        setType('error');
        setMessage(JSON.stringify(response.message));
        setShowLoading(true);
        setShowLoading(true);
        setTimeout(() => {
          setShowLoading(false);
        }, 3000);
      }
    });
  };

  const _renderBottomMenu = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <TouchableOpacity style={styles.menuItem} onPress={onPressBuy}>
          <Text>Buy with balance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={onPressFight}>
          <Text>Fight</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getData = text => {
    if (text.length > -1) {
      console.log(customerData, 'xxx');
      setTimeout(() => {
        setState({ loading: true });
        getApi
          .getData(
            `searchOtherSellersProducts?q=${text}&seller_id=${customerData?.id}`,
            [],
          )
          .then(response => {
            if (response.status === 1) {
              logfunction('RESPONSEEE ', response.data);
              setState({
                showSuggestions: true,
                showMost: false,
                loading: false,
                searchKeyword: text,
                data: response.data,
              });
            }
          });
      }, 600);
    } else {
      setState({
        showSuggestions: false,
        showMost: true,
      });
    }

    setState({
      searchKeyword: text,
    });
  };

  const { searchKeyword, data, loading, showMost, showSuggestions } = state;
  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      <View style={styles.headerCenter}>
        <Text style={styles.headingTxt}>marketplace</Text>
      </View>

      <OtrixContent>
        <View style={[styles.headerView]}>
          <View style={styles.searchContainer}>
            <Icon name="search" style={styles.searchIcon} />
            <View style={styles.verticalLine} />
            <Input
              w={'100%'}
              autoFocus={false}
              variant="outline"
              placeholder="Search Products"
              style={[styles.textInputSearchStyle, { flex: 1 }]}
              returnKeyType="search"
              value={searchKeyword}
              onEndEditing={e => {
                getData(e.nativeEvent.text);
              }}
              onChangeText={value => {
                setState({ ...state, searchKeyword: value });
              }}
            />
          </View>
        </View>

        {showMost && (
          <View style={styles.mostSearchView}>
            <Text style={styles.title}>Most Searches</Text>
            <View style={styles.tagRow}>
              {MostSearchArr.map(item => (
                <TouchableOpacity
                  style={styles.tagStyle}
                  key={item}
                  onPress={() => {
                    getData(item);
                  }}>
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {showSuggestions && data.length > 0 && (
          <OtrixContent customStyles={{ marginHorizontal: 0 }}>
            <SupplierSearchProducts
              onLongPress={onHoldItem}
              navigation={props.navigation}
              products={data}
            />
          </OtrixContent>
        )}
        {loading && <OtrixLoader />}
      </OtrixContent>
      <RBSheet
        ref={bottomMenu}
        height={300}
        closeOnDragDown
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}>
        {_renderBottomMenu()}
      </RBSheet>
      {showMessage && <OtrixAlert type={type} message={message} />}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
    customerData: state.auth.USER_DATA,
  };
}

export default connect(mapStateToProps, {})(SellerStore);

const styles = StyleSheet.create({
  headerView: {
    marginVertical: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchView: {
    height: hp('9%'),
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.white,
    height: hp('6%'),
  },
  searchIcon: {
    flex: 0.08,
    color: Colors.secondry_text_color,
    alignSelf: 'center',
    textAlign: 'center',
  },
  verticalLine: {
    height: hp('2.5%'),
    backgroundColor: Colors.link_color,
  },
  textInputSearchStyle: {
    fontFamily: Fonts.Font_Reguler,
    backgroundColor: Colors.white,
    fontSize: wp('3.5%'),
    borderRadius: 5,
    color: Colors.secondry_text_color,
    borderWidth: 0,
    marginHorizontal: wp('5%'),
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
  mostSearchView: {
    backgroundColor: Colors.white,
    padding: hp('1.5%'),
    marginHorizontal: wp('4%'),
    borderRadius: wp('3%'),
  },
  title: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.text_color,
    textAlign: 'left',
  },
  tagStyle: {
    justifyContent: 'center',
    padding: hp('1.5%'),
    backgroundColor: Colors.light_white,
    borderRadius: wp('5%'),
    marginHorizontal: wp('2%'),
    marginVertical: hp('0.4%'),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: wp('3.5%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
  headerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingTxt: {
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('6.5%'),
    color: Colors.themeColor,
  },
  productBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    width: '46%',
    height: 'auto',
    marginBottom: wp('2%'),
    borderRadius: wp('2%'),
    marginHorizontal: wp('1.5%'),
    paddingBottom: hp('1%'),
    paddingTop: hp('1%'),
  },
  menuItem: {
    marginBottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
