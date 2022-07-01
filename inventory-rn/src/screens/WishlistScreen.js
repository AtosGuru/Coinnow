import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import {
  OtrixContainer,
  OtrixHeader,
  OtrixContent,
  OtrixLoader,
  OtirxBackButton,
  WishlistComponent,
} from '@component';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import { _roundDimensions } from '@helpers/util';
import Icon from 'react-native-vector-icons/Ionicons';
import Fonts from '@helpers/Fonts';
import { bindActionCreators } from 'redux';
import { addToWishList } from '@actions';
import {
  _getWishlist,
  _addToWishlist,
  logfunction,
} from '@helpers/FunctionHelper';
import getApi from '@apis/getApi';

function WishlistScreen(props) {
  const [state, setState] = React.useState({
    loading: true,
    noRecord: false,
    wishlistArr: [],
  });

  const wishlistGetData = () => {
    getApi.getData('user/getWishlist', []).then(response => {
      if (response.status == 1) {
        logfunction('RESPONSEEE ', response.data);
        setState({
          ...state,
          noRecord: response.data.length > 0 ? false : true,
          wishlistArr: response.data,
          loading: false,
        });
      } else {
        setState({
          ...state,
          noRecord: true,
          loading: false,
        });
      }
    });
  };

  const onDeleteItem = async id => {
    setState({
      ...state,
      loading: true,
    });
    let wishlistData = await _addToWishlist(id);
    props.addToWishList(wishlistData, id);
    wishlistGetData();
  };

  useEffect(() => {
    wishlistGetData();
  }, []);

  const { wishlistArr, loading, noRecord } = state;
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
          <Text style={GlobalStyles.headingTxt}> Wishlist</Text>
        </View>
      </OtrixHeader>

      {/* Content Start from here */}
      <OtrixContent>
        {!noRecord && !loading && (
          <WishlistComponent
            navigation={props.navigation}
            products={wishlistArr}
            deleteItem={onDeleteItem}
          />
        )}
        {!loading && noRecord && (
          <View style={styles.noRecord}>
            <Text style={styles.emptyTxt}>Wishlist is empty!</Text>
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
                  name={'md-heart'}
                  color={Colors.white}
                  style={{ fontSize: wp('4.5%') }}
                />{' '}
                Add Now
              </Text>
            </Button>
          </View>
        )}
        {loading ? <OtrixLoader /> : null}
      </OtrixContent>
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
      addToWishList,
    },
    dispatch,
  );
export default connect(mapStateToProps, mapDispatchToProps)(WishlistScreen);

const styles = StyleSheet.create({
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
