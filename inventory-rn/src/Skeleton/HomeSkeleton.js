import React from 'react';
import { View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

function HomeSkeleton() {
  return (
    <SkeletonPlaceholder>
      <View
        style={{
          width: wp('96%'),
          height: hp('6%'),
          left: wp('2%'),
          marginTop: hp('2%'),
        }}
      />
      <View
        style={{
          marginTop: hp('2%'),
          flexDirection: 'row',
          marginLeft: wp('2%'),
        }}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <View
            key={item}
            style={{
              height: hp('8.5%'),
              width: wp('15%'),
              marginHorizontal: wp('1%'),
              borderRadius: 5,
            }}>
            <View
              style={{
                backgroundColor: Colors.light_white,
                height: hp('7..5%'),
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          width: wp('92%'),
          height: hp('15%'),
          left: wp('4%'),
          marginTop: hp('2%'),
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          marginVertical: hp('1.5%'),
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
        }}>
        <View style={{ height: hp('4%'), width: wp('40%') }} />
        <View style={{ height: hp('0%'), width: wp('40%') }} />
        <View style={{ height: hp('4%'), width: wp('30%') }} />
      </View>

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
          marginVertical: hp('3%'),
          justifyContent: 'space-around',
          marginHorizontal: hp('5%'),
        }}>
        <View style={{ height: hp('4%'), width: wp('40%') }} />
        <View style={{ height: hp('0%'), width: wp('40%') }} />
        <View style={{ height: hp('4%'), width: wp('30%') }} />
      </View>

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
    </SkeletonPlaceholder>
  );
}

export default HomeSkeleton;
