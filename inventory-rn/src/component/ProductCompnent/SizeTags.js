import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GlobalStyles, Colors } from '@helpers';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '@helpers/Fonts';
import { checkaround, circle } from '@common';

function SizeTags(props) {
  let selectedTag = false;
  if (props.selected.includes(props.tagID)) {
    selectedTag = true;
  }

  return (
    <TouchableOpacity
      style={[styles.filterBox, selectedTag && styles.borderBox]}
      onPress={() => props.onFilterPress(props.tagID)}>
      {selectedTag && <Image source={checkaround} style={styles.imageView} />}
      <Text style={styles.tagStyle}>{props.tagName}</Text>
    </TouchableOpacity>
  );
}

export default SizeTags;

const styles = StyleSheet.create({
  filterBox: {
    width: wp('18%'),
    height: hp('3.5%'),
    flexDirection: 'row',
    marginHorizontal: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    marginVertical: hp('0.5%'),
    alignItems: 'center',
  },
  tagStyle: {
    color: Colors.black,
    fontFamily: Fonts.Font_Semibold,
    fontSize: wp('3%'),
  },
  borderBox: {
    borderColor: Colors.themeColor,
    borderWidth: 1,
  },

  imageView: {
    height: hp('2%'),
    width: wp('4%'),
    borderRadius: 50,
    marginHorizontal: wp('1%'),
  },

  imageCircle: {
    height: hp('2%'),
    width: wp('4%'),
    marginHorizontal: wp('1%'),
  },
});
