import React from 'react';
import { View, TouchableOpacity } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import { ScrollView } from 'native-base';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function CategorySkeleton() {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
        }}>
        <View style={{ height: hp('25%'), width: wp('45%') }} />
        <View style={{ height: hp('0%'), width: wp('30%') }} />
        <View style={{ height: hp('25%'), width: wp('45%') }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
          marginTop: hp('2%'),
        }}>
        <View style={{ height: hp('25%'), width: wp('45%') }} />
        <View style={{ height: hp('0%'), width: wp('30%') }} />
        <View style={{ height: hp('25%'), width: wp('45%') }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
          marginTop: hp('2%'),
        }}>
        <View style={{ height: hp('25%'), width: wp('45%') }} />
        <View style={{ height: hp('0%'), width: wp('30%') }} />
        <View style={{ height: hp('25%'), width: wp('45%') }} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
          marginTop: hp('2%'),
        }}>
        <View style={{ height: hp('25%'), width: wp('45%') }} />
        <View style={{ height: hp('0%'), width: wp('30%') }} />
        <View style={{ height: hp('25%'), width: wp('45%') }} />
      </View>
    </SkeletonPlaceholder>
  );
}

export default CategorySkeleton;
