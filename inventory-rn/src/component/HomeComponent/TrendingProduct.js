import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import ProductView from '../ProductCompnent/ProductView';
import Fonts from '@helpers/Fonts';
import { logfunction } from '@helpers/FunctionHelper';

function TrendingProduct(props) {
  const navigateToDetailPage = data => {
    props.navigation.navigate('ProductDetailScreen', { id: data.id });
  };

  const navigateToLoginPage = data => {
    props.navigation.navigate('LoginScreen', {});
  };

  const addToWishlist = async id => {
    props.addToWishlist(id);
    // logfunction(" wishlist Data ", wishlistData)
  };

  const renderCard = item => {
    return (
      <View style={styles.productBox} key={item.id.toString()}>
        <ProductView
          data={item}
          key={item.id}
          navToDetail={navigateToDetailPage}
          navToLogin={navigateToLoginPage}
          userAuth={props.userAuth}
          addToWishlist={addToWishlist}
          wishlistArray={wishlistArr}
        />
      </View>
    );
  };

  const { wishlistArr } = props;
  return (
    <>
      <View style={styles.catHeading}>
        <Text style={GlobalStyles.boxHeading}>Trending Products</Text>
        <TouchableOpacity
          style={{ flex: 0.5 }}
          onPress={() =>
            props.navigation.navigate('ProductListScreen', {
              title: 'Trending Products',
              type: 'trending',
            })
          }>
          <Text style={GlobalStyles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <OtrixDivider size={'sm'} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {props.data.map((item, index) => {
          return renderCard(item);
        })}
      </View>
    </>
  );
}

export default TrendingProduct;

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  catBox: {
    height: hp('12.5%'),
    width: wp('15%'),
    marginHorizontal: wp('1%'),
    borderRadius: 5,
  },

  catName: {
    fontSize: wp('3.3%'),
    fontFamily: Fonts.Font_Reguler,
    textAlign: 'center',
    color: Colors.text_color,
  },
  productBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    width: '46%',
    height: 'auto',
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    marginHorizontal: wp('1.5%'),
    paddingBottom: hp('1%'),
  },
});
