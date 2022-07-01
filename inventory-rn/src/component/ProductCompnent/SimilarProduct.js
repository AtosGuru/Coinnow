import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OtrixDivider from '../OtrixComponent/OtrixDivider';
import Fonts from '@helpers/Fonts';
import ProductView from './ProductView';

function SimilarProduct(props) {
  const navigateToDetailPage = data => {
    props.navigation.push('ProductDetailScreen', { id: data.id });
  };

  return (
    <>
      <View style={styles.catHeading}>
        <Text style={GlobalStyles.boxHeading}>Similar Products</Text>
      </View>
      <OtrixDivider size={'sm'} />
      <FlatList
        style={{ padding: wp('1%') }}
        data={props.reletedData}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{
          paddingTop: wp('2.5%'),
        }}
        onEndReachedThreshold={0.7}
        keyExtractor={(contact, index) => String(index)}
        renderItem={({ item, index }) => (
          <ProductView
            data={item}
            key={item.id.toString()}
            navToDetail={navigateToDetailPage}
            fromSimilar={true}
          />
        )}
      />
    </>
  );
}

export default SimilarProduct;

const styles = StyleSheet.create({
  catHeading: {
    justifyContent: 'flex-start',
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
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    paddingBottom: hp('1%'),
    width: wp('44%'),
    maxWidth: wp('44%'),
    marginHorizontal: wp('2%'),
    flex: 0.5,
    backgroundColor: Colors.white,
    marginBottom: wp('3%'),
    borderRadius: wp('2%'),
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
    flexDirection: 'column',
  },
  imageView: {
    flex: 0.63,
    backgroundColor: Colors.light_white,
    width: wp('42.2%'),
    borderTopStartRadius: wp('2%'),
    borderTopEndRadius: wp('2%'),
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    height: hp('16%'),
    width: wp('30%'),
  },
  infromationView: {
    flex: 0.37,
    width: wp('35%'),
  },
  starView: {
    alignItems: 'flex-start',
    marginVertical: hp('0.6%'),
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
  productName: {
    color: Colors.secondry_text_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3.5%'),
  },
  priceView: {
    flex: 1,
    marginTop: hp('0.6%'),
    flexDirection: 'row',
  },
  price: {
    flex: 0.3,
    color: Colors.black,
    fontFamily: Fonts.Font_Bold,
    fontSize: wp('4%'),
  },
  offerTxt: {
    flex: 0.7,
    textAlign: 'right',
    color: Colors.link_color,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('2.8%'),
    textTransform: 'uppercase',
  },
});
