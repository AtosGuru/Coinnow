import React, { useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { OtrixDivider } from '@component';
import { Text } from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import Fonts from '@helpers/Fonts';
import { google, facebook, twitter } from '@common';

function SocialContainer(props) {
  return (
    <>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerTxt}>OR</Text>
      </View>

      <OtrixDivider size={'md'} />

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => props.googleLogin()}>
          <Image
            square
            source={google}
            style={[
              {
                height: wp('7%'),
                width: wp('7%'),
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => props.facebookLogin()}>
          <Image
            square
            source={facebook}
            style={[
              {
                height: wp('10%'),
                width: wp('10%'),
              },
            ]}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.imageContainer}>
                <Image
                    square
                    source={twitter}
                    style={[{
                        height: wp('7%'),
                        width: wp('7%'),
                    }]}
                />
            </TouchableOpacity> */}
      </View>
    </>
  );
}

export default OtrixSocialContainer = React.memo(SocialContainer);

const styles = StyleSheet.create({
  divider: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: wp('0.2%'),
    backgroundColor: Colors.dark_grey,
    alignSelf: 'center',
  },
  dividerTxt: {
    alignSelf: 'center',
    backgroundColor: Colors.light_white,
    paddingHorizontal: wp('3%'),
    fontSize: wp('3.4%'),
    fontFamily: Fonts.Font_Semibold,
    color: Colors.secondry_text_color,
  },
  socialContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: Colors.white,
    height: wp('10%'),
    width: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('4%'),
  },
});
