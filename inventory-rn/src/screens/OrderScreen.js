import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixDivider,
  OtirxBackButton,
  OtrixContent,
  OrdersComponent,
  OtrixLoader,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { logfunction } from '@helpers/FunctionHelper';
import { _roundDimensions } from '@helpers/util';
import Fonts from '@helpers/Fonts';
import getApi from '@apis/getApi';

function OrderScreen(props) {
  const [state, setState] = React.useState({
    orderList: [],
    currentPage: 1,
    totalPages: 1,
    loading: true,
    loader: false,
  });
  const { orderList, totalPages, currentPage, loading, loader } = state;

  fetchData = page => {
    getApi.getData('user/getOrdersList?page=' + page, []).then(response => {
      if (response.status == 1) {
        setState(prevstate => ({
          ...prevstate,
          orderList:
            page == 1
              ? response.data.data
              : [...prevstate.orderList, ...response.data.data],
          totalPages: response.data.last_page,
          loading: false,
          loader: false,
        }));
      }
    });
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const paginate = () => {
    if (totalPages > 1 && currentPage <= totalPages) {
      setState({
        ...state,
        loader: true,
        currentPage: currentPage + 1,
      });
      fetchData(currentPage + 1);
    }
  };

  const renderFooter = () => {
    return (
      //Footer View
      <View>
        {loader && <OtrixLoader />}
        <OtrixDivider size={'sm'} />
      </View>
    );
  };

  return (
    <OtrixContainer customStyles={{ backgroundColor: Colors.light_white }}>
      {/* Header */}
      <OtrixHeader customStyles={{ backgroundColor: Colors.light_white }}>
        <TouchableOpacity
          style={GlobalStyles.headerLeft}
          onPress={() => props.navigation.navigate('ProfileScreen')}>
          <OtirxBackButton />
        </TouchableOpacity>
        <View style={[GlobalStyles.headerCenter, { flex: 1 }]}>
          <Text style={GlobalStyles.headingTxt}> Orders</Text>
        </View>
      </OtrixHeader>

      {/* Orders Content start from here */}
      <OtrixDivider size={'md'} />
      <Text style={styles.deliveryTitle}>Your Orders</Text>
      <OtrixDivider size={'sm'} />
      {loading ? (
        <OtrixLoader />
      ) : (
        <View
          style={styles.addressBox}
          showsHorizontalScrollIndicator={false}
          vertical={false}>
          {orderList.length > 0 ? (
            <FlatList
              style={{ padding: wp('1%') }}
              data={orderList}
              horizontal={false}
              onEndReachedThreshold={0.2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(contact, index) => String(index)}
              ListFooterComponent={renderFooter}
              onEndReached={({ distanceFromEnd }) => {
                paginate();
              }}
              renderItem={({ item, index }) => (
                <OrdersComponent navigation={props.navigation} orders={item} />
              )}
            />
          ) : null}
        </View>
      )}
    </OtrixContainer>
  );
}

function mapStateToProps(state) {
  return {
    cartData: state.cart.cartData,
  };
}

export default connect(mapStateToProps)(OrderScreen);

const styles = StyleSheet.create({
  deliveryTitle: {
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.8%'),
    color: Colors.text_color,
    marginLeft: wp('5%'),
  },
  addressBox: {
    marginHorizontal: wp('4%'),
    flex: 1,
    height: 'auto',
    borderRadius: wp('2%'),
  },
  deliveryBox: {
    marginHorizontal: wp('1.5%'),
    width: wp('88%'),
    marginVertical: hp('0.5%'),
    height: hp('30.5%'),
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
});
