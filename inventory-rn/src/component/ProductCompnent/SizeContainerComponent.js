import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';

function SizeContainerComponent(props) {
  let productDetail = props.productData;

  const [state, setState] = React.useState({ selectedSize: null });

  const { selectedSize } = state;

  return (
    <View style={styles.sizeContainer}>
      <Text style={styles.containerTxt}>Available Sizes:</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginHorizontal: wp('1%'),
        }}>
        {productDetail.sizes.length > 0 &&
          productDetail.sizes.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.box,
                styles.sizeBox,
                {
                  borderColor:
                    selectedSize == item
                      ? Colors.themeColor
                      : 'rgb(225, 225, 225)',
                },
              ]}
              key={index}
              onPress={() => setState({ ...state, selectedSize: item })}>
              <Text
                style={[
                  styles.sizeTxt,
                  {
                    color:
                      selectedSize == item
                        ? Colors.themeColor
                        : Colors.secondry_text_color,
                  },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

export default SizeContainerComponent;

const styles = StyleSheet.create({
  sizeContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sizeBox: {
    height: hp('3%'),
    width: wp('9.5%'),
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
  containerTxt: {
    fontSize: wp('4%'),
    fontFamily: Fonts.Font_Reguler,
    color: Colors.secondry_text_color,
  },
  box: {
    height: hp('3.5%'),
    width: wp('8%'),
    flexDirection: 'row',
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    alignItems: 'center',
  },
  borderBox: {
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },
});
